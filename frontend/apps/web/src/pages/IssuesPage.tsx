import { EmptyState } from "@/components/common/EmptyState"
import { AppShell } from "@/components/layout/AppShell"

export function IssuesPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.2em] text-sky-400 uppercase">
              Reports
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Issues</h2>
          </div>
        </div>

        <EmptyState
          title="No issues yet"
          description="Add issue reporting flows, filters, and moderation controls here."
        />
      </section>
    </AppShell>
  )
}
