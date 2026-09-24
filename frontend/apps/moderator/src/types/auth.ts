export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "user"
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
