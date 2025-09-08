'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-10 border rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="mb-6 text-center text-gray-500">Choose a provider to sign in</p>
        <div className="flex flex-col gap-4">
          <Button onClick={() => signIn('google', { callbackUrl: '/' })}>
            Sign in with Google
          </Button>
          <p className="text-center text-sm text-gray-500">or</p>
          {/* Email sign in form can be added here later */}
          <Button variant="outline" disabled>
            Sign in with Email (coming soon)
          </Button>
        </div>
      </div>
    </div>
  )
}
