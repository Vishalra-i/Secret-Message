'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Message } from '@/model/User.model'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Loader2, Loader2Icon, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { getToken } from 'next-auth/jwt'

 function Dashboard() {
  const [messages , SetMessages] = useState<Message[]>([])
  const [isLoading , setIsLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading]= useState(false)

  const onMessageDelete = (messageId : string) => {
    SetMessages(messages.filter(message => message.id !== messageId))
  }
  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const {register , watch , setValue} = form 
  const acceptMessages = watch('acceptMessages')

  //Fetch status of accepting meesage
  const fetchAcceptMessages = useCallback(async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      console.log(response)
      setValue('acceptMessages' , response.data?.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError?.response?.data?.message || "Failed to fetch accept message status",
        variant : "destructive"
      })
    }finally{
      setIsSwitchLoading(false)
    }
  },[setValue])

  //fetch all messages
  const fetchMessages = useCallback(async (refresh : boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/getMessages')
      SetMessages(response?.data?.messages || [])
      if(refresh){
        toast({
          title : "Refreshing latest messages",
          description : "Messages fetched successfully",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError?.response?.data?.message || "Failed to fetch message ",
        variant : "destructive"
      })
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading , SetMessages])

  useEffect(()=>{
    if(!session || !session.user){
        return 
    }
    fetchMessages()
    fetchAcceptMessages()
  },[session , setValue , fetchAcceptMessages, fetchMessages])

  //Handle switch change for accepting messages
  const handleSwitchChange = async () => {
     try {
        const response = await axios.post<ApiResponse>('/api/accept-messages' , {
          acceptMessages : !acceptMessages
        })
        setValue('acceptMessages' , !acceptMessages)
        toast({
          title : response.data.message ,
          variant : 'destructive'
        })
     } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError?.response?.data?.message || "Failed to fetch message setting",
        variant : "destructive"
      })
     }
  } 

  const username = session?.user?.username
  const baseURL = `${window?.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`
  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileURL)
    toast({
      title : "URL Copied ✅",
      description : "Copied to clipboard"
    })
  }



  if(!session || !session.user){
    return (
      <div className="flex justify-center items-center  h-screen w-full ">
              <Loader2Icon className="animate-spin w-12 h-12 "/>
      </div>
    )
  }


  return (
<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-[#4a80f5e5]  rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch 
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={onMessageDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard