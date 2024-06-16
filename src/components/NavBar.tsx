'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth'
import { Button } from './ui/button'

function NavBar() {
    const {data : session} = useSession()
    const user : User = session?.user as User
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <Link className='text-xl font-bold mb-4 md:mb-0' href="/dashboard">Secret Message🤫</Link>
        {
          session ? (
            <>
                {/* <ul>
                 <li className="mb-4">
                   <a href="#" className="hover:text-gray-400">Dashboard</a>
                 </li>
                 <li className="mb-4">
                   <a href="#" className="hover:text-gray-400">Settings</a>
                 </li>
                 <li>
                   <a href="#" className="hover:text-gray-400">Profile</a>
                 </li>
               </ul> */}
               <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>  
            </>
          ) : (
            <div className="space-x-5">
            <Link href="/sign-up">
              <Button className='w-full md:w-auto font-semibold bg-blue-500 hover:bg-blue-300'>SignUp</Button>
            </Link> 
            <Link href="/sign-in"> 
              <Button className='w-full md:w-auto font-semibold'>Login</Button>
            </Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default NavBar