import { pusher } from "@/lib/pusher";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const words = ["apple", "banana", "orange", "grape", "strawberry"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { sessionCode } = await req.json();
    const word = words[Math.floor(Math.random() * words.length)];

    await prisma.gameSession.update({
      where: { code: sessionCode },
      data: { currentWord: word },
    });

    const maskedWord = "_ ".repeat(word.length);

    await pusher.trigger(`private-session-${sessionCode}`, "new-round", {
      maskedWord,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to start round:", error);
    return new Response("Error starting round", { status: 500 });
  }
}
