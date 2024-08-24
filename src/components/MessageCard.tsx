'use client';

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Share2, Loader2, Instagram } from "lucide-react";
import { Message } from "@/model/User.model";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import * as htmlToImage from 'html-to-image';
import { useRef, useState } from 'react';

type MessageCardsProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDeleteConfirm = async () => {
    const messageId = message?._id;
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/delete-message/${messageId}`);
      toast({
        title: "Message Deleted",
        description: response.data.message || "The message has been successfully deleted.",
        variant: "default",
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Deletion Failed",
        description: axiosError?.response?.data?.message || "Unable to delete the message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current);
        const blob = await fetch(dataUrl).then(res => res.blob());

        const filesArray = [
          new File([blob], 'message-card.png', {
            type: blob.type,
          })
        ];

        const shareData = {
          files: filesArray,
          title: 'Check out this message',
          text: 'Here is a message I wanted to share with you!',
          url: 'https://yourwebsite.com', // Replace with your desired URL
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          toast({
            title: "Sharing Not Supported",
            description: "Your device does not support sharing images.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Sharing Failed",
          description: "An error occurred while trying to share the message.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShareToInstagram = async () => {
    if (cardRef.current) {
      try {
        // Convert HTML to Image
        const dataUrl = await htmlToImage.toPng(cardRef.current);
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const file = new File([blob], 'message-card.png', { type: blob.type });
  
        // Trigger image download for mobile users
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'message-card.png';
        link.click();
  
        // Delay for the image to be saved
        setTimeout(() => {
          // Open Instagram to Story Camera
          window.location.href = 'instagram-stories://share';
        }, 500);
  
        toast({
          title: "Instagram Ready",
          description: "Image downloaded. Open Instagram to share your story.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Sharing Failed",
          description: "An error occurred while trying to share the message on Instagram.",
          variant: "destructive",
        });
      }
    }
  };
  

  return (
    isDeleting ? (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    ) : (
      <Card className="border rounded-lg shadow-sm" ref={cardRef}>
        <CardHeader className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium mb-2">
              {message?.Content || "Untitled Message"}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={handleShare} className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={handleShareToInstagram} className="text-pink-500 hover:bg-pink-100 p-2 rounded-full">
              <Instagram className="w-5 h-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="mr-4">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 text-white hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
      </Card>
    )
  );
}

export default MessageCard;
