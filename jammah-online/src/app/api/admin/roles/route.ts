import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, color } = body;

    const newRole = await prisma.role.create({
      data: {
        name,
        color,
      },
    });

    return NextResponse.json(newRole);
  } catch (error) {
    console.error("Failed to create role:", error);
    return new Response("Error creating role", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return new Response("Error fetching roles", { status: 500 });
  }
}