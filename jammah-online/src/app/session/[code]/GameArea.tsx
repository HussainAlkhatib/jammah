'use client'

import { useEffect, useState } from "react"
import Pusher from "pusher-js"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function GameArea({ gameSession }) {
  const { data: session } = useSession()
  const [pusher, setPusher] = useState(null);
  const [maskedWord, setMaskedWord] = useState("")
  const [guess, setGuess] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [winner, setWinner] = useState(null)
  const [gameEvents, setGameEvents] = useState([]);

  useEffect(() => {
    if (session?.user) {
      const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        auth: {
          params: { userId: session.user.id },
        },
      });
      setPusher(pusherInstance);

      const channelName = `private-session-${gameSession.code}`;
      const channel = pusherInstance.subscribe(channelName);

      channel.bind("new-round", ({ maskedWord }) => {
        setMaskedWord(maskedWord);
        setWinner(null);
        setGameEvents([]);
      });

      channel.bind("round-winner", ({ winnerName }) => {
        setWinner({ name: winnerName });
        // The player list will be updated by the SessionHandler component refreshing the page
      });

      channel.bind("wrong-guess", ({ userName, guess }) => {
        setGameEvents((prev) => [...prev, `${userName} guessed: ${guess}`]);
      });

      if (gameSession.players.length > 0 && gameSession.players[0].userId === session.user.id) {
        setIsHost(true)
      }
    }

    return () => {
      if (pusher) {
        pusher.disconnect();
      }
    }
  }, [session, gameSession.code, gameSession.players])

  const handleStartRound = async () => {
    await fetch("/api/game/start-round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode: gameSession.code }),
    });
  };

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode: gameSession.code, guess }),
    });
    setGuess("");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Guess the Word</h2>
      {isHost && (
        <Button onClick={handleStartRound} disabled={maskedWord !== "" && !winner}>
          Start New Round
        </Button>
      )}
      <div className="my-4">
        {maskedWord ? (
          <div>
            <p className="text-lg tracking-widest font-mono">{maskedWord}</p>
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
      {!winner && maskedWord && (
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
      <div className="mt-4 space-y-2">
        {gameEvents.map((event, i) => (
          <p key={i} className="text-sm text-muted-foreground">{event}</p>
        ))}
      </div>
    </div>
  )
}
