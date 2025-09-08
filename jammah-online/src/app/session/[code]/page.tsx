import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { SessionHandler } from "./SessionHandler";
import { GameArea } from "./GameArea";

const prisma = new PrismaClient();

export default async function SessionPage({ params }: { params: { code: string } }) {
  const gameSession = await prisma.gameSession.findUnique({
    where: {
      code: params.code,
    },
    include: {
      players: {
        orderBy: {
          score: 'desc',
        },
        include: {
          user: true,
        },
      },
    },
  });

  if (!gameSession) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <SessionHandler gameSession={gameSession} />
      <h1 className="text-3xl font-bold mb-2">Session: {gameSession.code}</h1>
      <p className="text-muted-foreground mb-6">
        Share this code with your family to let them join.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <div className="space-y-4">
            {gameSession.players.map(({ user, score }) => (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={user.image || ""} alt={user.name || ""} className="h-10 w-10 rounded-full" />
                  <span>{user.name}</span>
                </div>
                <span className="font-bold text-lg">{score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-100 p-6 rounded-lg">
          <GameArea gameSession={gameSession} />
        </div>
      </div>
    </div>
  );
}
