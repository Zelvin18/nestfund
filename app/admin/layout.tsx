import type { Metadata } from "next"
import AdminShell from "@/components/admin/AdminShell"

export const metadata: Metadata = {
  title: "Admin Console — NestFund",
  description: "Manage properties, construction projects, market intelligence, and site content.",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
