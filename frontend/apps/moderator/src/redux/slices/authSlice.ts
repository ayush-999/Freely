import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { AuthState, User } from "@/types/auth"

const storageKey = "freely-moderator-auth-state"
const tokenKey = "freely-moderator-auth-token"

const readStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  }

  const storedState = localStorage.getItem(storageKey)

  if (!storedState) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  }

  try {
    const parsedState = JSON.parse(storedState) as Partial<AuthState>

    return {
      user: parsedState.user ?? null,
      token: parsedState.token ?? null,
      isAuthenticated: Boolean(parsedState.user && parsedState.token),
    }
  } catch {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  }
}

const initialState: AuthState = readStoredAuth()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
        })
      )
      localStorage.setItem(tokenKey, action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem(storageKey)
      localStorage.removeItem(tokenKey)
    },
    hydrateAuth: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = action.payload.isAuthenticated
    },
  },
})

export const { login, logout, hydrateAuth } = authSlice.actions
export default authSlice.reducer
