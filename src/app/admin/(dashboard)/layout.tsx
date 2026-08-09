import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-pink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-400 text-sm font-bold text-white">
              NP
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Panel de administración</p>
              <Link href="/" className="text-xs text-pink-500 hover:underline">
                Ver sitio
              </Link>
            </div>
          </div>
          <LogoutButton />
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
