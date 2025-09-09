'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { Session } from "next-auth";

interface ProfileFormProps {
  user: Session['user'];
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [username, setUsername] = useState(user?.username || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, bio }),
    })

    if (res.ok) {
      // Update the session with the new user data
      await update({ ...session, user: { ...session?.user, name, username, bio } })
      router.refresh()
    } else {
      // Handle error
      console.error("Failed to update profile")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}