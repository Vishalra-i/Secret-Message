'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/model/User.model';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileURL, setProfileURL] = useState('');

  const { data: session } = useSession();
  const onMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages', response.data?.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to fetch accept message status',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/getMessages');
      setMessages(response?.data?.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshing latest messages',
          description: 'Messages fetched successfully',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessages();
      const username = session.user.username;
      const baseURL = `${window.location.protocol}//${window.location.host}`;
      setProfileURL(`${baseURL}/u/${username}`);
    }
  }, [session, setValue,]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to update message setting',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: 'URL Copied',
      description: 'Copied to clipboard',
      variant: 'default',
    });
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-xl md:w-full max-w-6xl">
      <h1 className="text-4xl font-extrabold text-white mb-6">User Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Copy Your Unique Link</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 text-gray-900 rounded-lg"
          />
          <Button onClick={copyToClipboard} className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-100">
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-white">Accept Messages: {acceptMessages ? 'On' : 'Off'}</span>
      </div>
      <Separator className="mb-6 border-gray-300" />

      <Button
        className="mb-6 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-100"
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
        <span className="ml-2">Refresh Messages</span>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard key={message._id} message={message} onMessageDelete={onMessageDelete} />
          ))
        ) : (
          <p className="text-white">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
