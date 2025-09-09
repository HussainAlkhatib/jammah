'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Pusher from "pusher-js"
import { GameSession, Player, User } from '@prisma/client';

type PlayerWithUser = Player & {
  user: User;
};

type GameSessionWithPlayers = GameSession & {
  players: PlayerWithUser[];
};

interface SessionHandlerProps {
  gameSession: GameSessionWithPlayers;
}

export function SessionHandler({ gameSession }: SessionHandlerProps) {
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

      const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
      });

      const channel = pusherInstance.subscribe(`private-session-${gameSession.code}`);

      channel.bind("round-winner", () => {
        router.refresh();
      });

      return () => {
        pusherInstance.disconnect();
      }
    }
  }, [session, gameSession, router])

  return null
}