'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect , useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios , {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"


const page = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage , setUsernameMessage] = useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername,500)
  const {toast} = useToast()
  const router = useRouter();

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])
  
  //Handle on submit
  const onSubmit = async (data : z.infer<typeof signUpSchema>)=> {
     setIsSubmitting(true)
     try {
       const response = await axios.post('/api/signup',data)
       toast({
         title : "Success" ,
         description : response.data.message
       })
       router.replace(`/verify/${username}`)
     } catch (error) {
       console.error("Error in signup user ::" + error)
       const axiosError = error as AxiosError<ApiResponse>
       let err = axiosError.response?.data.message
       toast({
         title : "Error" ,
         description : err || "Error in signup user" ,
         variant : "destructive"
       })
     } finally {
       setIsSubmitting(false)
     }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
          {/* heading */}
           <div className="text-center">
            <h1 className="text-4xl font-extrabold"> Join Mystrey Message</h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
           </div>
           {/* Form statrt here */}
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                   name="username"
                   control={form.control}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel >Username</FormLabel>
                       <FormControl>
                          <Input placeholder="username" onChange={(e)=>{
                            field.onChange(e)
                            debounced(e.target.value)
                          }}  />
                       </FormControl>
                       {
                            isCheckingUsername && <Loader2 className="animate-spin"/>
                      }
                      <p className={`text-sm font-semibold ${usernameMessage === "Username is Available" ? "text-green-400" : "text-red-400" }`}>
                        {usernameMessage}
                      </p>
                       <FormMessage />
                     </FormItem>
                   )}
                />
             <FormField
                   control={form.control}
                   name="email"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email</FormLabel>
                       <FormControl>
                          <Input placeholder="email" {...field}  />
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
                          <Input placeholder="password" {...field}  />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {
                    isSubmitting ?<> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait </> : ('Signup')
                  }
                </Button>
             </form>
           </Form>

           <div className="text-center mt-4">
               <p>
                Already a member ? {' '} 
                <Link href="/sign-in" >
                   <span className="text-blue-400 font-bold">Sign in</span>
                </Link>
               </p>
           </div>

        </div>
    </div>
  )
}

export default page