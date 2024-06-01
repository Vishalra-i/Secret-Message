// file path: pages/verify.js

'use client'

import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const { username } = useParams()


  const onSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username,
        code
      })
      console.log(response)
      toast({
        title: response.status < 300 ? "Success" : "Failed" ,
        description: response?.data.message, 
      })
    } catch (error) {
      console.error("Error:", error : any)
      toast({
        title: error?.status < 300 ? "Success" : "Failed" ,
        description: error?.response?.data?.message || error.message, 
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
        <div>
          <p className="text-center mb-4">{`Verification for: ${username}`}</p>
          <Input
          placeholder="Enter verification code" 
          onChange={(e) => setCode(e.target.value)} 
          className='my-10'
          max={6}
          />
          <button 
            onClick={onSubmit} 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
