'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-4 md:p-6 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link  href="/dashboard">
          <Logo />
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle Menu">
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
        <div className={`flex flex-col md:flex-row  md:items-center absolute md:static z-20 top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}`}>
          {session ? (
            <div className="space-y-4 md:space-y-0 md:space-x-5 mt-4 md:mt-0 p-4 md:p-0 w-full md:w-auto">
              <Link href="/dashboard">
                <Button className="w-full md:w-auto font-semibold bg-blue-500 hover:bg-blue-300">
                  Dashboard
                </Button>
              </Link>
              <Button className="w-full md:w-auto font-semibold mt-5 md:mt-0" onClick={() => signOut()}>Logout</Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-0 md:space-x-5 mt-4 md:mt-0 p-4 md:p-0 w-full md:w-auto">
              <Link href="/sign-in">
                <Button className="w-full md:w-auto font-semibold mt-5 md:mt-0 bg-transparent text-black text-md hover:bg-transparent hover:text-lg p-0 mx-2 text-center">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full md:w-auto font-semibold bg-black text-white py-4 px-6 rounded-lg hover:bg-black/40">
                  SignUp
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
