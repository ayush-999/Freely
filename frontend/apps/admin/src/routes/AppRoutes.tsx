import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import { useAppSelector } from "@/hooks/useAppSelector"
import {
  CreateAccountPage,
  ForgotPasswordPage,
  LoginPage,
} from "@/pages/AuthPages"
import { DashboardPage } from "@/pages/DashboardPage"
import { IssuesPage } from "@/pages/IssuesPage"
import { PostsPage } from "@/pages/PostsPage"

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateAccountPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  )
}
