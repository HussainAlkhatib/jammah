'use client'

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001")

export function GameArea({ gameSession }) {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState(null)
  const [guess, setGuess] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    if (session?.user) {
      socket.emit("join-session", gameSession.code)

      if (gameSession.players.length > 0 && gameSession.players[0].userId === session.user.id) {
        setIsHost(true)
      }

      socket.on("game-state", (state) => {
        setGameState(state)
        setWinner(null)
      })

      socket.on("new-round", (state) => {
        setGameState(state)
        setWinner(null)
      })

      socket.on("round-winner", ({ winnerId }) => {
        const winnerPlayer = gameSession.players.find(p => p.userId === winnerId)
        setWinner(winnerPlayer?.user)
      })

      socket.on("wrong-guess", () => {
        // Maybe show a message to the user who guessed wrong
      })
    }

    return () => {
      socket.off("game-state")
      socket.off("new-round")
      socket.off("round-winner")
      socket.off("wrong-guess")
    }
  }, [session, gameSession])

  const handleStartRound = () => {
    socket.emit("start-round", gameSession.code)
  }

  const handleGuessSubmit = (e) => {
    e.preventDefault()
    socket.emit("guess", { sessionCode: gameSession.code, guess, userId: session.user.id })
    setGuess("")
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Guess the Word</h2>
      {isHost && (
        <Button onClick={handleStartRound} disabled={gameState?.currentWord}>
          Start New Round
        </Button>
      )}
      <div className="my-4">
        {gameState?.currentWord ? (
          <div>
            <p className="text-lg tracking-widest font-mono">
              {isHost ? gameState.currentWord : gameState.maskedWord}
            </p>
            {winner && (
              <p className="text-green-500 font-bold mt-2">
                {winner.name} guessed correctly!
              </p>
            )}
          </div>
        ) : (
          <p>Waiting for the host to start a new round...</p>
        )}
      </div>
      {!winner && gameState?.currentWord && (
        <form onSubmit={handleGuessSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your guess"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isHost}
          />
          <Button type="submit" disabled={isHost}>Guess</Button>
        </form>
      )}
    </div>
  )
}
