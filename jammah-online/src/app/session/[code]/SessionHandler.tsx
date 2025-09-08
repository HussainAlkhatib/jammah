'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { io } from "socket.io-client"

const socket = io("http://localhost:3001");

export function SessionHandler({ gameSession }) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      const isPlayer = gameSession.players.some(
        (player) => player.userId === session.user.id
      )

      if (!isPlayer) {
        const joinSession = async () => {
          await fetch(`/api/sessions/${gameSession.code}/join`, {
            method: "POST",
          })
          router.refresh()
        }
        joinSession()
      }

      socket.on("update-players", (updatedPlayers) => {
        router.refresh();
      });
    }

    return () => {
        socket.off("update-players");
    }
  }, [session, gameSession, router])

  return null // This component does not render anything
}
