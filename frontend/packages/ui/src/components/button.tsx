import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

import { buttonVariants } from "./button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      type={asChild ? undefined : (type ?? "button")}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-not-allowed"
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-flex size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children ? (
        <span className="inline-flex items-center">{children}</span>
      ) : null}
    </Comp>
  )
}

export { Button }
