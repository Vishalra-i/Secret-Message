'use client'

import { toast } from "@/components/ui/use-toast"
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios';
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea"



function MessagePage() {
  const {username} = useParams()
  const [content , setContent] = useState("")
  const [AiContent , setAiContent] = useState([])
  const [isSending , setIsSending] = useState(false)
  
  
  const form = useForm({
    resolver : zodResolver(messageSchema),
    defaultValues : {
      content : ""
    }
    
  })
  
  const sendMessage = async function(data : z.infer<typeof messageSchema>){
    const {content} = data
    setIsSending(true)
    try {
      const response = await axios.post("/api/send-message",{
        username,
        content
      })
      console.log(response)
      toast({
        title: "Success",
        description: response.data.message
      })
    } catch (error) {
       console.log(error)
       const axiosError = error as AxiosError<ApiResponse>;
       toast({
         title: 'Error',
         description: axiosError?.response?.data?.message || 'Failed to sent message ',
         variant: 'destructive',
       });
    } finally {
      setIsSending(false)
    }
  }

  const aiCall = async () => {
    try {
      const response = await axios.post("/api/suggest-messages")
      console.log(response)
      const data = response.data.content?.split("||")
      setAiContent(data)
    } catch (error) {
       console.log(error)
    }
  }

  return (
    <div className="container mx-auto w-[500px] min-h-fit mt-28">
        {username ? (
          <div >
             <Form {...form}>
              <form onSubmit={form.handleSubmit(sendMessage)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className="text-2xl font-bold">Send message to @{username}</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Write your annoumous message here" value={content} className=" h-24 w-full " onChange={(e)=>{
                          field.onChange(e)
                          setContent(e.target.value)
                        }}  />                       
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Ai Integration  */}
                  {
                    AiContent.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xl font-bold">AI Suggestion</p>
                        <ul className="list-disc pl-5">
                          {AiContent.map((item, index) => (
                            <li onClick={(e)=> setContent(item)} key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  <p onClick={aiCall}>Suggest</p>
                  {/* //Submit Button  */}
                   <Button type="submit" className="w-full" disabled={isSending}>
                  {
                    isSending ?<> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait </> : ('Send')
                  }
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="container  mx-auto text-center p-5">
            <p className="text-xl font-bold">Get Your Secret Message Board</p>
            <Link href={'/sign-up'}>
               <Button className="mt-5"> Create Your Account </Button>
            </Link>
        </div>
    </div>
  )
}

export default MessagePage