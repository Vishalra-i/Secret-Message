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
import { Skeleton } from "@/components/ui/skeleton"
import { AiBox } from "@/components/ui/AiBox";




function MessagePage() {
  const {username} = useParams()
  const [content , setContent] = useState("")
  const [AiContent , setAiContent] = useState([])
  const [isSending , setIsSending] = useState(false)
  const [isSuggest , setIsSuggest] = useState(false)
  
  
  const form = useForm({
    resolver : zodResolver(messageSchema),
    defaultValues : {
      content : ""
    }
  })

  const {setValue , getValues}  = form ;
  
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
        title: "Success✅",
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
    setIsSuggest(true)
    try {
      const response = await axios.post("/api/suggest-messages")
      console.log(response)
      const data = response.data.content?.split("||")
      setAiContent(data)
    } catch (error) {
       console.log(error)
    } finally {
      setIsSuggest(false)
    }
  }

  return (
    <div className="container mx-auto w-[500px] min-h-fit mt-5 bg-[#51bb81] p-10 rounded-md text-white">
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
                        <Textarea placeholder="Write your annoumous message here" value={form.getValues("content")} className=" h-24 w-full text-black font-medium text-lg" onChange={(e)=>{
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
                    isSuggest ?
                    <>
                       <Skeleton className="h-10 w-full animate-bounce"/>
                       <Skeleton className="h-10 w-full animate-bounce"/>
                       <Skeleton className="h-10 w-full animate-bounce"/>
                    </> : (
                      AiContent.length > 0 && (
                        <div className="mt-4">
                            {AiContent.map((item, index) => (
                              <AiBox onClick={(e)=> setValue("content" ,item)} text={item} className="h-fit w-full"  key={index}/>
                            ))}
                        </div>
                      )
                    )
                  }
                  <p onClick={aiCall} className="text-sm font-bold cursor-pointer border p-2 border-white bg-blue-800 w-52 rounded-md ">Ai Suggesttion ✨</p>
                  {/* //Submit Button  */}
                   <Button type="submit"  className={`w-full ${isSending && "cursor-not-allowed bg-gray-700"}`} disabled={isSending} >
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