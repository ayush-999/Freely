import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { LockKeyhole, Mail, UserPlus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { InputField } from "@/components/ui/InputField"
import { AuthPageShell } from "@/pages/auth/AuthPageShell"
import { useAppSelector } from "@/hooks/useAppSelector"
import { signUp } from "@/services/authService"

export function CreateAccountLayout() {
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
        <InputField
          label="Full name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Alex Morgan"
          autoComplete="name"
          icon={<UserPlus className="h-4 w-4" />}
        />

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

        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
          icon={<LockKeyhole className="h-4 w-4" />}
        />

        <InputField
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
          className="w-full p-5 text-sm font-medium"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>
    </AuthPageShell>
  )
}
