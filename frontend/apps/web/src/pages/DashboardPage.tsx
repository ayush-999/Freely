import { AppShell } from "@/components/layout/AppShell"

export function DashboardPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm tracking-[0.2em] text-sky-400 uppercase">
            Overview
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Open issues</p>
            <p className="mt-2 text-3xl font-bold text-white">128</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Community posts</p>
            <p className="mt-2 text-3xl font-bold text-white">324</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Resolved this week</p>
            <p className="mt-2 text-3xl font-bold text-white">43</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
