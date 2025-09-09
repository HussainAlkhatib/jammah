'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ManagePermissionsDialog } from "./ManagePermissionsDialog";
import { Role, Permission } from '@prisma/client';

type RoleWithPermissions = Role & {
  permissions: {
    permission: Permission;
  }[];
};

interface RolesManagerProps {
  roles: RoleWithPermissions[];
  permissions: Permission[];
}

export function RolesManager({ roles, permissions }: RolesManagerProps) {
  const router = useRouter();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("#cccccc");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoleName, color: newRoleColor }),
    });

    setNewRoleName("");
    setNewRoleColor("#cccccc");
    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={handleCreateRole} className="mb-8 flex items-center gap-4">
        <Input
          type="text"
          placeholder="New role name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          required
        />
        <Input
          type="color"
          value={newRoleColor}
          onChange={(e) => setNewRoleColor(e.target.value)}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Role"}
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <Badge style={{ backgroundColor: role.color || '#ccc' }}>
                  {role.name}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {role.permissions.map(({ permission }) => (
                    <Badge key={permission.id} variant="secondary">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <ManagePermissionsDialog role={role} allPermissions={permissions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}