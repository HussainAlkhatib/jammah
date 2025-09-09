import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { roleId: string } }
): Promise<Response | NextResponse> {
  const { roleId } = context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    
    const { permissionIds } = await request.json();

    // First, delete all existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: roleId },
    });

    // Then, add the new permissions
    const newPermissions = permissionIds.map((permissionId: string) => ({
      roleId: roleId,
      permissionId: permissionId,
    }));

    if (newPermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: newPermissions,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update permissions:", error);
    return new Response("Error updating permissions", { status: 500 });
  }
}