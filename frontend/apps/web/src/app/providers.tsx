import type { PropsWithChildren } from "react"
import { Provider } from "react-redux"

import { ThemeProvider } from "@/components/theme-provider"
import { store } from "@/redux/store"

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  )
}
