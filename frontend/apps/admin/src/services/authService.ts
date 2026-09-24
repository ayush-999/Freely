import { api } from "@/services/api"

const appPrefix = "freely-admin"
const DEMO_USERS_KEY = `${appPrefix}-demo-users`

function getDemoUsers() {
  const saved = localStorage.getItem(DEMO_USERS_KEY)

  if (saved) {
    return JSON.parse(saved) as Array<{
      id: string
      name: string
      email: string
      password: string
      role: "admin" | "moderator" | "user"
    }>
  }

  const defaultUsers = [
    {
      id: "demo-user-1",
      name: "Freely User",
      email: "user@freely.test",
      password: "admin123",
      role: "user" as const,
    },
    {
      id: "demo-admin-1",
      name: "Freely Admin",
      email: "admin@freely.test",
      password: "admin123",
      role: "admin" as const,
    },
    {
      id: "demo-moderator-1",
      name: "Freely Moderator",
      email: "mod@freely.test",
      password: "admin123",
      role: "moderator" as const,
    },
  ]

  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

function saveDemoUsers(users: ReturnType<typeof getDemoUsers>) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

async function withApiFallback<T>(
  request: () => Promise<T>,
  fallback: () => T,
  errorMessage: string
): Promise<T> {
  try {
    return await request()
  } catch (error) {
    const fallbackValue = fallback()

    if (fallbackValue) {
      return fallbackValue
    }

    const message = error instanceof Error ? error.message : errorMessage
    throw new Error(message)
  }
}

export async function signIn(email: string, password: string) {
  return withApiFallback(
    async () => {
      const response = await api.post("/login", { email, password })
      return response.data
    },
    () => {
      const user = getDemoUsers().find(
        (demoUser) =>
          demoUser.email.toLowerCase() === email.toLowerCase() &&
          demoUser.password === password
      )

      if (!user) {
        throw new Error("Invalid email or password.")
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: `demo-token-${user.id}`,
        message: "Signed in successfully.",
      }

      localStorage.setItem(`${appPrefix}-auth-token`, payload.token)
      return payload
    },
    "Unable to sign in. Please try again."
  )
}

export async function signUp(name: string, email: string, password: string) {
  return withApiFallback(
    async () => {
      const response = await api.post("/register", {
        name,
        email,
        password,
      })
      return response.data
    },
    () => {
      const users = getDemoUsers()
      const exists = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      )

      if (exists) {
        throw new Error("An account with this email already exists.")
      }

      const newUser = {
        id: `demo-user-${Date.now()}`,
        name,
        email,
        password,
        role: "user" as const,
      }

      users.push(newUser)
      saveDemoUsers(users)

      return {
        message: "Account created successfully. You can now sign in.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      }
    },
    "Unable to create your account."
  )
}

export async function requestPasswordReset(email: string) {
  return withApiFallback(
    async () => {
      const response = await api.post("/forgot-password", { email })
      return response.data
    },
    () => ({
      message: `Reset instructions were sent to ${email}.`,
    }),
    "Unable to process your password reset request."
  )
}

export async function getCurrentUser() {
  const response = await api.get("/me")
  return response.data
}
