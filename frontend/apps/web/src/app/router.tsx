import { Suspense, lazy } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { RouteLoader } from "@/components/common/RouteLoader"

const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
)

const IssuesPage = lazy(() =>
  import("@/pages/IssuesPage").then((module) => ({
    default: module.IssuesPage,
  }))
)

const PostsPage = lazy(() =>
  import("@/pages/PostsPage").then((module) => ({
    default: module.PostsPage,
  }))
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/posts" element={<PostsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
