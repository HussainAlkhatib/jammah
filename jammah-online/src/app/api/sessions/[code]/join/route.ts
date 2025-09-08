import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { code } = params;
    const userId = session.user.id;

    const gameSession = await prisma.gameSession.findUnique({
      where: { code },
    });

    if (!gameSession) {
      return new Response("Session not found", { status: 404 });
    }

    // Check if user is already a player
    const existingPlayer = await prisma.player.findFirst({
        where: {
            userId: userId as string,
            gameSessionId: gameSession.id,
        }
    });

    if (existingPlayer) {
        return NextResponse.json({ message: "User is already in the session" });
    }

    await prisma.player.create({
      data: {
        userId: userId as string,
        gameSessionId: gameSession.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to join session:", error);
    return new Response("Error joining session", { status: 500 });
  }
}
