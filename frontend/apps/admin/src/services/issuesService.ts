import { api } from "@/services/api"

export async function getIssues() {
  const response = await api.get("/issues")
  return response.data
}

export async function createIssue(payload: Record<string, unknown>) {
  const response = await api.post("/issues", payload)
  return response.data
}
