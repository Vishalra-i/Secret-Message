'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User.model"

import axios, { AxiosError } from "axios"
import dayjs from "dayjs"
import { toast } from "./ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
  
type MessageCardsProps = {
    message : Message ;
    onMessageDelete : (messageId:string) => void
}
  
function MessageCard({message , onMessageDelete}:MessageCardsProps) {
    
    const handleDeleteConfirm = async () => {
      let messageId = message?._id
      try {
          const response = await axios.delete(`/api/delete-message/${messageId}`)
          toast({
              title: "Message deleted successfully",
              description: response.data.message || "Deleted"
          })
          onMessageDelete(message._id)
      } catch (error) {
         console.log(error)
         const axiosError = error as AxiosError<ApiResponse>;
         toast({
           title: 'Error',
           description: axiosError?.response?.data?.message || 'Failed to update message setting',
           variant: 'destructive',
         });
      }
    }

  return (
    <Card className="card-bordered">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{message?.Content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-sm">
        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </div>
    </CardHeader>
    <CardContent></CardContent>
  </Card>
  )
}

export default MessageCard