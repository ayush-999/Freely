import { Suspense, lazy } from "react"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"

import { RouteLoader } from "@/components/common/RouteLoader"
import { useAppSelector } from "@/hooks/useAppSelector"

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

const LoginPage = lazy(() =>
  import("@/pages/AuthPages").then((module) => ({
    default: module.LoginPage,
  }))
)

const CreateAccountPage = lazy(() =>
  import("@/pages/AuthPages").then((module) => ({
    default: module.CreateAccountPage,
  }))
)

const ForgotPasswordPage = lazy(() =>
  import("@/pages/AuthPages").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
)

const NotFoundPage = lazy(() =>
  import("@/pages/not-found/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
)

function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateAccountPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter basename="/moderator">
      <Suspense fallback={<RouteLoader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}
