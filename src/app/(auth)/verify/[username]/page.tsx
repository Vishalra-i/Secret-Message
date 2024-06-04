'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

function VerifyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const { username } = useParams<{username:string}>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver : zodResolver(verifySchema),
  })


  const onSubmit = async (data : z.infer<typeof verifySchema>) => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username,
        code : data.code
      })
      toast({
        title: response.status < 300 ? "Success" : "Failed" ,
        description: response?.data.message, 
      })
      router.replace("/sign-in")
    } catch (error: any) {
      console.error("Error:", error )
      const axiosError = error as AxiosError<ApiResponse>
      let errMessage = axiosError.response?.data.message
      toast({
        title: error?.status < 300 ? "Success" : "Failed" ,
        description: errMessage || error.message, 
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Account</h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        {/* //Form Start here */}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
         name="code"
         control={form.control}
         render={({ field }) => (
           <FormItem>
             <FormLabel>Please enter your code</FormLabel>
             <FormControl>
             <Input
                  placeholder="Enter verification code" 
                  className='my-10'
                  {...field}
              />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
         />
         <Button 
                type='submit'
                disabled={loading}
                className={"w-full"}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Submit'
                )}
          </Button>
        </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyPage
