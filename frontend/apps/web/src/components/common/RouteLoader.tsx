import { useTheme } from "@/components/theme-provider"

export function RouteLoader() {
  const { theme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-200">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3">
        <span
          className={`h-6 w-6 animate-spin rounded-full border-2 ${
            isDark ? "border-primary" : "border-primary"
          } border-t-transparent`}
        />
        <span className="text-sm font-medium tracking-wide">Loading...</span>
      </div>
    </div>
  )
}
