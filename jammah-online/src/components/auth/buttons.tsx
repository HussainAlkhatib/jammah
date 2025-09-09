'use client'

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"

export function SignInButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/auth/signin">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Link>
    </Button>
  )
}

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => signOut()}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
