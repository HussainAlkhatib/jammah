'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ManageUserRolesDialog } from "./ManageUserRolesDialog"
import { User, Role } from '@prisma/client';

type UserWithRoles = User & {
  roles: {
    role: Role;
  }[];
};

interface UsersTableProps {
  users: UserWithRoles[];
  allRoles: Role[];
}

export function UsersTable({ users, allRoles }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.name}
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>@{user.username || "N/A"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {user.roles.map(({ role }) => (
                  <Badge key={role.id} style={{ backgroundColor: role.color || '#ccc' }}>
                    {role.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <ManageUserRolesDialog user={user} allRoles={allRoles} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}