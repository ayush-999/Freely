import { MoonStar, SunMedium } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useTheme } from "@/components/theme-provider"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { logout } from "@/redux/slices/authSlice"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const currentUser = useAppSelector((state) => state.auth.user)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleAccessPortal = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login")
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login", { replace: true })
  }

  return (
    <header className="border-b border-border bg-background/80 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.2em] text-primary uppercase">
            Governance OS
          </p>
          <h1 className="text-xl font-semibold">
            Issue Reporting & Microblogging
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <>
              <div className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
                User: <span className="text-primary">{currentUser.name}</span>
              </div>
              <div className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
                Email: <span className="text-primary">{currentUser.email}</span>
              </div>
              <div className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                Role: {currentUser.role}
              </div>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleAccessPortal}
            className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {isAuthenticated ? "Dashboard" : "Access portal"}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-destructive-foreground inline-flex items-center rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive"
            >
              Logout
            </button>
          ) : null}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card p-3 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <SunMedium className="h-5 w-5" />
            ) : (
              <MoonStar className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
