import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-6">
        <nav className="space-y-4">
          <Link href="/admin" className="block font-semibold">Dashboard</Link>
          <Link href="/admin/users" className="block">Users</Link>
          <Link href="/admin/roles" className="block">Roles</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
