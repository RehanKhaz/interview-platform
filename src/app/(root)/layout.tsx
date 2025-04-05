import React, { ReactNode } from 'react'
import { redirect } from 'next/navigation';
import Logo from '../components/Logo'
import { isAuthenticated } from '@/lib/action/auth.action';
import { Toaster } from 'sonner';

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        redirect('/sign-up')
    }
    return (
        <div className=' px-10 py-3 max-md:px-4 max-md:py-2'>
            <header className='my-2'>
                <nav className='flex items-center justify-between w-full'>
                    <Logo />
                </nav>
            </header>
            {children}
            <Toaster />
        </div>
    )
}

export default RootLayout