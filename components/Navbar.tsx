'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <a href="#" className="text-basis sm:text-xl font-bold">
          Mystery Messenger
        </a>
        {session ? (
            <>
                <span className="hidden sm:block text-3xl font-bold capitalize">
                Welcome, {user.username || user.email}
                </span>
                <Button onClick={() => signOut()} className="bg-slate-100 text-black" variant='outline'>
                    Logout
                </Button>
            </> 
        ) : (
          <Link href="/signin">
            <Button className=" bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;