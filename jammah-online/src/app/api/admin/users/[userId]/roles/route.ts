import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { userId: string } }
): Promise<Response | NextResponse> {
  const { userId } = context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    
    const { roleIds } = await request.json();

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