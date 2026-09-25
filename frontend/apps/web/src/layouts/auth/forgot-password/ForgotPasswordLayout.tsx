import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Mail } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { InputField } from "@/components/ui/InputField"
import { AuthPageShell } from "@/pages/auth/AuthPageShell"
import { useAppSelector } from "@/hooks/useAppSelector"
import { requestPasswordReset } from "@/services/authService"

export function ForgotPasswordLayout() {
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
          Send instructions
        </Button>
      </form>
    </AuthPageShell>
  )
}
