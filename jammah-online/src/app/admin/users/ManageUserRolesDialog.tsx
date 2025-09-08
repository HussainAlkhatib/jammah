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

export function ManageUserRolesDialog({ user, allRoles }) {
  const router = useRouter()
  const [selectedRoles, setSelectedRoles] = useState(
    user.roles.map(({ role }) => role.id)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    await fetch(`/api/admin/users/${user.id}/roles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleIds: selectedRoles }),
    })

    router.refresh()
    setIsSubmitting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Roles</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles for {user.name}</DialogTitle>
          <DialogDescription>
            Select the roles for this user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {allRoles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => handleRoleToggle(role.id)}
              />
              <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
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
