import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = session.user?.id
  if (!userId) {
    return new Response("User not found in session", { status: 400 });
  }

  try {
    const body = await req.json()
    const { name, username, bio } = body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Failed to update profile:", error)
    return new Response("Error updating profile", { status: 500 })
  }
}
