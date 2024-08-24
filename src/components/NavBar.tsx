'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-xl font-bold" href="/dashboard">
          Secret Message🤫
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <div className={`flex flex-col md:flex-row md:items-center bg-white absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}`}>
          {session ? (
            <div className="space-y-4 md:space-y-0 md:space-x-5 mt-4 md:mt-0 p-4 md:p-0">
              <Link href="/dashboard">
                <Button className="w-full md:w-auto font-semibold bg-blue-500 hover:bg-blue-300">
                  Dashboard
                </Button>
              </Link>
              <Button className="w-full md:w-auto font-semibold mt-5" onClick={() => signOut()}>Logout</Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-0 md:space-x-5 mt-4 md:mt-0 p-4 md:p-0">
              <Link href="/sign-up">
                <Button className="w-full md:w-auto font-semibold bg-blue-500 hover:bg-blue-300">
                  SignUp
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="w-full md:w-auto font-semibold hover:bg-blue-300 mt-5">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
