export function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 shadow-lg shadow-slate-950/40">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
        <span className="text-sm font-medium tracking-wide">Loading...</span>
      </div>
    </div>
  )
}
