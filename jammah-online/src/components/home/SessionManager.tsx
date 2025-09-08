'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SessionManager() {
  const router = useRouter()
  const [sessionCode, setSessionCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const handleCreateSession = async () => {
    setIsCreating(true)
    const res = await fetch("/api/sessions", { method: "POST" })
    const { code } = await res.json()
    router.push(`/session/${code}`)
    setIsCreating(false)
  }

  const handleJoinSession = (e) => {
    e.preventDefault()
    setIsJoining(true)
    router.push(`/session/${sessionCode}`)
    setIsJoining(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <Button
        size="lg"
        className="font-semibold text-lg px-8 py-6"
        onClick={handleCreateSession}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Session"}
      </Button>
      <form onSubmit={handleJoinSession} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter session code"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          className="w-48"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={isJoining || !sessionCode}
        >
          {isJoining ? "Joining..." : "Find Session"}
        </Button>
      </form>
    </div>
  )
}
