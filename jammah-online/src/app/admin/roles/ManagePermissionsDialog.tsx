'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Role, Permission } from '@prisma/client';

type RoleWithPermissions = Role & {
  permissions: {
    permission: Permission;
  }[];
};

interface ManagePermissionsDialogProps {
  role: RoleWithPermissions;
  allPermissions: Permission[];
}

export function ManagePermissionsDialog({ role, allPermissions }: ManagePermissionsDialogProps) {
  const router = useRouter()
  const [selectedPermissions, setSelectedPermissions] = useState(
    role.permissions.map(({ permission }) => permission.id)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    await fetch(`/api/admin/roles/${role.id}/permissions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissionIds: selectedPermissions }),
    })

    router.refresh()
    setIsSubmitting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Permissions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Permissions for {role.name}</DialogTitle>
          <DialogDescription>
            Select the permissions for this role.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {allPermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={`perm-${permission.id}`}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => handlePermissionToggle(permission.id)}
              />
              <Label htmlFor={`perm-${permission.id}`}>{permission.name}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}