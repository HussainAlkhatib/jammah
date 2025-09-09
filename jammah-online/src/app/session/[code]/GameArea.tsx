'use client'

import { useEffect, useState } from "react"
import Pusher from "pusher-js"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GameSession, Player, User } from '@prisma/client';

type PlayerWithUser = Player & {
  user: User;
};

type GameSessionWithPlayers = GameSession & {
  players: PlayerWithUser[];
};

interface GameAreaProps {
  gameSession: GameSessionWithPlayers;
}

export function GameArea({ gameSession }: GameAreaProps) {
  const { data: session } = useSession()
  const [maskedWord, setMaskedWord] = useState("")
  const [guess, setGuess] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [winner, setWinner] = useState<{ name: string } | null>(null)
  const [gameEvents, setGameEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: { userId: session.user.id },
      },
    });

    const channelName = `private-session-${gameSession.code}`;
    const channel = pusherInstance.subscribe(channelName);

    const newRoundHandler = ({ maskedWord }: { maskedWord: string }) => {
      setMaskedWord(maskedWord);
      setWinner(null);
      setGameEvents([]);
    };
    channel.bind("new-round", newRoundHandler);

    const roundWinnerHandler = ({ winnerName }: { winnerName: string }) => {
      setWinner({ name: winnerName });
    };
    channel.bind("round-winner", roundWinnerHandler);

    const wrongGuessHandler = ({ userName, guess }: { userName: string, guess: string }) => {
      setGameEvents((prev) => [...prev, `${userName} guessed: ${guess}`]);
    };
    channel.bind("wrong-guess", wrongGuessHandler);

    if (gameSession.players.length > 0 && gameSession.players[0].userId === session.user.id) {
      setIsHost(true)
    }

    return () => {
      channel.unbind("new-round", newRoundHandler);
      channel.unbind("round-winner", roundWinnerHandler);
      channel.unbind("wrong-guess", wrongGuessHandler);
      pusherInstance.unsubscribe(channelName);
      pusherInstance.disconnect();
    }
  }, [session, gameSession.code, gameSession.players])

  const handleStartRound = async () => {
    await fetch("/api/game/start-round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode: gameSession.code }),
    });
  };

  const handleGuessSubmit = async (e: React.FormEvent) => {
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