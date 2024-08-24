'use client';

import { useToast } from '@/components/ui/use-toast';
import { forgotPasswordSchema, resetPasswordSchema } from '@/schemas/forgotPassword';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(isOtpSent ? resetPasswordSchema : forgotPasswordSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: ''
    },
  });

  // Handle submission for forgot password
  const handleForgotPasswordSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/forgot-password', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      setIsOtpSent(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error in forgot password :: " + error);
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error in forgot password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submission for OTP verification and reset password
  const handleResetPasswordSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/resetPassword', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.push('/login');
    } catch (error:any) {
      console.log("Error in reset password :: " + error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error in reset password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">
            {isOtpSent ? 'Reset Password' : 'Forgot Password'}
          </h1>
          <p className="mb-4">
            {isOtpSent ? 'Enter the OTP sent to your email and set a new password' : 'Enter your email to reset your password'}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isOtpSent ? handleResetPasswordSubmit : handleForgotPasswordSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" disabled={isOtpSent} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isOtpSent && (
              <>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your OTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="New Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : (
                isOtpSent ? 'Reset Password' : 'Send Reset Link'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
