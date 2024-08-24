'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect , useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { toast, useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios , {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const Page = () => {
  
  const [isSubmitting , setIsSubmitting] = useState(false)
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier : '',
      password: '',
    }
  })

  
  
  //Handle on submit
  const onSubmit = async (data : z.infer<typeof signInSchema>)=> {
    setIsSubmitting(true)
     try {
      const result = await signIn('credentials' , {
       redirect : false ,
       identifier : data.identifier ,
       password : data.password
      })
      if(result?.error){
        if(result.error === 'CredentialsSignin'){
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password",
            variant: "destructive",
          })
        }else{
          toast({
            title: "Error",
            description: result.error ,
            variant: "destructive",
          })
        }
      }
      if(result?.url){
       toast({
         title: "Success",
         description: "You have successfully logged in",
         variant: "default",
       })
        router.replace("/dashboard")
      }
     } catch (error) {
         console.log(error)
     }finally{
       setIsSubmitting(false)
     }
  }

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
          {/* heading */}
           <div className="text-center">
            <h1 className="text-4xl font-extrabold"> Mystrey Message</h1>
            <p className="mb-4">Login to your account</p>
           </div>
           {/* Form statrt here */}
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                   control={form.control}
                   name="identifier"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email or Username</FormLabel>
                       <FormControl>
                          <Input placeholder="email or username" {...field}  />
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
                       <FormLabel>Password</FormLabel>
                       <FormControl>
                          <Input type={"password"} placeholder="password" {...field}  />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {
                    isSubmitting ?<> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait </> : ('Login')
                  }
                </Button>
             </form>
           </Form>
           <div className="text-center mt-4">
               <p>
                <Link href="/forgot-password" >
                   <span className="text-black font-bold my-5 text-lg">Forgot password ?</span>
                </Link>
               </p>
               <p>
                 Create new account {' '} 
                <Link href="/sign-up" >
                   <span className="text-blue-400 my-5 font-bold">Signup</span>
                </Link>
               </p>
           </div>

        </div>
    </div>
  )
}

export default Page