import { Navigate, Route, Routes } from "react-router-dom"

import { DashboardPage } from "@/pages/DashboardPage"
import { IssuesPage } from "@/pages/IssuesPage"
import { PostsPage } from "@/pages/PostsPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/issues" element={<IssuesPage />} />
      <Route path="/posts" element={<PostsPage />} />
    </Routes>
  )
}
