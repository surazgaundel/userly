import { Button } from './button';
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '@/public/logo.svg';

import { UserPlus } from "lucide-react";
export default function NavBar() {
  return (
    <header className="border-b pb-3 bg-slate-300">
      <div className="container flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/users" className="text-xl font-bold">
            <Image src={LogoImage} width={180} height={180} alt='logo image' className='min-w-[100]'/>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/users" >
            <Button variant="ghost" className='hover:cursor-pointer'>Users</Button>
          </Link>
          <Link href="/users/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
