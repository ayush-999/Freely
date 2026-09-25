import { useState } from "react"
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { Button } from "@workspace/ui/components/button"
import { InputField } from "@/components/ui/InputField"
import { AuthPageShell } from "@/pages/auth/AuthPageShell"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { login } from "@/redux/slices/authSlice"
import { signIn } from "@/services/authService"

export function LoginLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await signIn(email, password)
      dispatch(
        login({
          user: response.user,
          token: response.token,
        })
      )
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footer={
        <>
          Need an account?{" "}
          <Link
            to="/create"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-card-foreground">
            Password
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <LockKeyhole className="h-4 w-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-input bg-background px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/forgot"
            className="font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full p-5 text-sm font-medium"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </AuthPageShell>
  )
}
