import { type ReactNode, useState } from "react"
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserPlus,
} from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { Button } from "@workspace/ui/components/button"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { login } from "@/redux/slices/authSlice"
import { requestPasswordReset, signIn, signUp } from "@/services/authService"

interface AuthPageShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

function AuthPageShell({
  title,
  subtitle,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  type?: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  autoComplete?: string
  icon: ReactNode
}

function AuthField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-card-foreground">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-input bg-background px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>
    </label>
  )
}

export function LoginPage() {
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
        <AuthField
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
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </AuthPageShell>
  )
}

export function CreateAccountPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await signUp(name, email, password)
      setMessage(response.message)
      window.setTimeout(() => navigate("/login", { replace: true }), 800)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell
      title="Create account"
      subtitle="Set up your team workspace and get started."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          label="Full name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Alex Morgan"
          autoComplete="name"
          icon={<UserPlus className="h-4 w-4" />}
        />

        <AuthField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
        />

        <AuthField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
          icon={<LockKeyhole className="h-4 w-4" />}
        />

        <AuthField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          icon={<LockKeyhole className="h-4 w-4" />}
        />

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>
    </AuthPageShell>
  )
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await requestPasswordReset(email)
      setMessage(response.message)
      window.setTimeout(() => navigate("/login", { replace: true }), 1000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password right now."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell
      title="Recover access"
      subtitle="Enter your email and we will send reset instructions."
      footer={
        <>
          Back to{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
        />

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Send instructions
        </Button>
      </form>
    </AuthPageShell>
  )
}
