import { pusher } from "@/lib/pusher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { sessionCode, guess } = await request.json();
    const userId = session.user.id;

    const gameSession = await prisma.gameSession.findUnique({
      where: { code: sessionCode },
    });

    if (!gameSession || !gameSession.currentWord) {
      return new Response("Game not in progress", { status: 400 });
    }

    if (guess.toLowerCase() === gameSession.currentWord.toLowerCase()) {
      const player = await prisma.player.findFirst({
        where: { userId, gameSessionId: gameSession.id },
      });

      if (player) {
        await prisma.player.update({
          where: { id: player.id },
          data: { score: { increment: 10 } },
        });
      }

      await prisma.gameSession.update({
        where: { code: sessionCode },
        data: { currentWord: null }, // End the round
      });

      const updatedPlayers = await prisma.player.findMany({
        where: { gameSessionId: gameSession.id },
        include: { user: true },
        orderBy: { score: "desc" },
      });

      await pusher.trigger(`private-session-${sessionCode}`, "round-winner", {
        winnerId: userId,
        winnerName: session.user.name,
        players: updatedPlayers,
      });

      return NextResponse.json({ correct: true });
    } else {
      await pusher.trigger(`private-session-${sessionCode}`, "wrong-guess", {
        userId,
        userName: session.user.name,
        guess,
      });
      return NextResponse.json({ correct: false });
    }
  } catch (error) {
    console.error("Failed to process guess:", error);
    return new Response("Error processing guess", { status: 500 });
  }
}