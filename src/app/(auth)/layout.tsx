import { isAuthenticated } from '@/lib/action/auth.action'
import { redirect } from 'next/navigation'

import React, { ReactNode } from 'react'
import { Toaster } from 'sonner'

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) {
   redirect('/')
  }
  return (
    <div className='min-h-screen w-screen flex-center'>
      {children}
      <Toaster />
    </div>
  )
}

export default AuthLayout