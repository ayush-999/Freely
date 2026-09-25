import { api } from "@/services/api"

export async function signIn(email: string, password: string) {
  const response = await api.post("/login", { email, password })
  return response.data
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: "admin" | "moderator" | "user" = "moderator"
) {
  const response = await api.post("/register", {
    name,
    email,
    password,
    role,
  })
  return response.data
}

export async function requestPasswordReset(email: string) {
  const response = await api.post("/forgot-password", { email })
  return response.data
}

export async function getCurrentUser() {
  const response = await api.get("/me")
  return response.data
}
