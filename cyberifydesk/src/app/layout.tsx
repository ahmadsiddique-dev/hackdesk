import { Geist, Geist_Mono, Lora, Public_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/elements/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RouteGuard } from "@/components/elements/RouteGuard"
import { cn } from "@/lib/utils"

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" })

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        "font-sans",
        lora.variable,
        publicSansHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <RouteGuard>{children}</RouteGuard>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
