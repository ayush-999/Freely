import type { ReactNode } from "react"

import { DashboardFooter } from "@/layouts/dashboard/DashboardFooter"
import { DashboardHeader } from "@/layouts/dashboard/DashboardHeader"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      <DashboardFooter />
    </div>
  )
}
