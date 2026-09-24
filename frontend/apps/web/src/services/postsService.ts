import { api } from "@/services/api"

export async function getPosts() {
  const response = await api.get("/posts")
  return response.data
}

export async function createPost(payload: Record<string, unknown>) {
  const response = await api.post("/posts", payload)
  return response.data
}
