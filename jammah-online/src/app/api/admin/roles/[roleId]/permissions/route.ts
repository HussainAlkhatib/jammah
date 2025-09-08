import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  const session = await getServerSession(authOptions);

  // @ts-expect-error: session.user is possibly null
  if (!session || !session.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { roleId } = params;
    const { permissionIds } = await req.json();

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
