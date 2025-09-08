import { PrismaClient } from "@prisma/client";
import { UsersTable } from "./UsersTable";

const prisma = new PrismaClient();

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
  const roles = await prisma.role.findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <UsersTable users={users} allRoles={roles} />
    </div>
  );
}
