import { PrismaClient } from "@prisma/client";
import { RolesManager } from "./RolesManager";

const prisma = new PrismaClient();

export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  const permissions = await prisma.permission.findMany();


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Roles</h1>
      <RolesManager roles={roles} permissions={permissions} />
    </div>
  );
}
