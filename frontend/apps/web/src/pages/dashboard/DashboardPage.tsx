import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout"

export function DashboardPage() {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    window.setTimeout(() => setIsSyncing(false), 1200)
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.2em] text-primary uppercase">
              Overview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              Dashboard
            </h2>
          </div>

          <Button
            variant="outline"
            onClick={handleSync}
            loading={isSyncing}
            disabled={isSyncing}
            className="p-4 text-sm font-medium"
          >
            Refresh overview
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Open issues</p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">128</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Community posts</p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">324</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Resolved this week</p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">43</p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}
