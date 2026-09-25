import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import { useAppSelector } from "@/hooks/useAppSelector"
import { CreateAccountLayout } from "@/layouts/auth/create-account/CreateAccountLayout"
import { ForgotPasswordLayout } from "@/layouts/auth/forgot-password/ForgotPasswordLayout"
import { LoginLayout } from "@/layouts/auth/login/LoginLayout"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { NotFoundPage } from "@/pages/not-found/NotFoundPage"

function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function AppRoutes() {
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
        <Route path="/login" element={<LoginLayout />} />
        <Route path="/create" element={<CreateAccountLayout />} />
        <Route path="/forgot" element={<ForgotPasswordLayout />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
