import { EmptyState } from "@/components/common/EmptyState"
import { AppShell } from "@/components/layout/AppShell"

export function PostsPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm tracking-[0.2em] text-sky-400 uppercase">
            Community
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            Microblogging
          </h2>
        </div>

        <EmptyState
          title="No posts yet"
          description="Add quick updates, announcements, and community discussions here."
        />
      </section>
    </AppShell>
  )
}
