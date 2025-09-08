import { getServerSession } => from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  // @ts-expect-error: session.user is possibly null
  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { userId } = params;
    const { roleIds } = await req.json();

    // First, delete all existing roles for this user
    await prisma.userRole.deleteMany({
      where: { userId: userId },
    });

    // Then, add the new roles
    const newRoles = roleIds.map((roleId: string) => ({
      userId: userId,
      roleId: roleId,
    }));

    if (newRoles.length > 0) {
      await prisma.userRole.createMany({
        data: newRoles,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update user roles:", error);
    return new Response("Error updating user roles", { status: 500 });
  }
}
