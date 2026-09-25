import type { ReactNode } from "react"

interface InputFieldProps {
  label: string
  type?: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  autoComplete?: string
  icon: ReactNode
}

export function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
}: InputFieldProps) {
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
