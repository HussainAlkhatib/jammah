import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function generateCode() {
  let code = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    let code;
    let isCodeUnique = false;

    // Generate a unique code
    while (!isCodeUnique) {
      code = generateCode();
      const existingSession = await prisma.gameSession.findUnique({
        where: { code },
      });
      if (!existingSession) {
        isCodeUnique = true;
      }
    }

    const newSession = await prisma.gameSession.create({
      data: {
        code: code!,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Failed to create session:", error);
    return new Response("Error creating session", { status: 500 });
  }
}