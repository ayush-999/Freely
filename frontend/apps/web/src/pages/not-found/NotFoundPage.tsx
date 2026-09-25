import { Link } from "react-router-dom"

import { Button } from "@workspace/ui/components/button"
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          404 error
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          The page you are trying to access does not exist or may have been
          moved.
        </p>

        <div className="mt-8 flex items-center flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-card/80">
            <Home className="size-5" />
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
