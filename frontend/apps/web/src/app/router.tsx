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
  import("@/pages/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
)

const LoginPage = lazy(() =>
  import("@/layouts/auth/login/LoginLayout").then((module) => ({
    default: module.LoginLayout,
  }))
)

const CreateAccountPage = lazy(() =>
  import("@/layouts/auth/create-account/CreateAccountLayout").then(
    (module) => ({
      default: module.CreateAccountLayout,
    })
  )
)

const ForgotPasswordPage = lazy(() =>
  import("@/layouts/auth/forgot-password/ForgotPasswordLayout").then(
    (module) => ({
      default: module.ForgotPasswordLayout,
    })
  )
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
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}
