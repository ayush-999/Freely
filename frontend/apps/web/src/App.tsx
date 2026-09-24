import { Suspense, lazy } from "react"

import { RouteLoader } from "@/components/common/RouteLoader"

const AppRouter = lazy(() =>
  import("@/app/router").then((module) => ({ default: module.AppRouter }))
)

export function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <AppRouter />
    </Suspense>
  )
}
