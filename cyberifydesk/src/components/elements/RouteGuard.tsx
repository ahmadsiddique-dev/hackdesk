"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "../../store/user"
import axios from "axios"
import { IconLoader2 } from "@tabler/icons-react"

interface RouteGuardProps {
  children: React.ReactNode
}

const authRoutes = ["/signin", "/signup", "/forgot-password"]
const protectedPrefixes = ["/dashboard"]

export function RouteGuard({ children }: RouteGuardProps) {
  const accessToken = useUserStore((state) => state.accessToken)
  const setAuth = useUserStore((state) => state.setAuth)
  const clearAuth = useUserStore((state) => state.clearAuth)
  const router = useRouter()
  const pathname = usePathname()

  const [hydrated, setHydrated] = React.useState(false)
  const [verifying, setVerifying] = React.useState(true)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return

    const checkAuth = async () => {
      const isAuthRoute = authRoutes.includes(pathname)
      const isProtectedRoute = protectedPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      )

      if (!isAuthRoute && !isProtectedRoute) {
        setVerifying(false)
        return
      }

      if (!accessToken) {
        if (isProtectedRoute) {
          clearAuth()
          router.push("/signin")
        } else {
          setVerifying(false)
        }
        return
      }

      try {
        const response = await axios.post(
          "/api/auth/agent/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (response.data.success) {
          const newAccessToken = response.data.accessToken || accessToken
          setAuth(newAccessToken, response.data.user)

          if (isAuthRoute) {
            router.push("/dashboard")
          } else {
            setVerifying(false)
          }
        } else {
          clearAuth()
          if (isProtectedRoute) {
            router.push("/signin")
          } else {
            setVerifying(false)
          }
        }
      } catch (err) {
        clearAuth()
        if (isProtectedRoute) {
          router.push("/signin")
        } else {
          setVerifying(false)
        }
      }
    }

    setVerifying(true)
    checkAuth()
  }, [pathname, accessToken, hydrated, clearAuth, setAuth, router])

  if (!hydrated) {
    return null
  }

  const isAuthRoute = authRoutes.includes(pathname)
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (verifying && (isProtectedRoute || (isAuthRoute && accessToken))) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
        <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-full max-w-7xl -translate-x-1/2 overflow-hidden">
          <div className="absolute -top-50 left-1/4 h-150 w-150 rounded-full bg-orange-600/10 blur-[150px] dark:bg-orange-600/15" />
          <div className="absolute -top-25 right-1/4 h-125 w-125 rounded-full bg-amber-500/10 blur-[130px] dark:bg-amber-500/15" />
        </div>
        <div className="z-10 flex flex-col items-center gap-4 py-8 px-12 rounded-2xl border border-border/40 bg-card/30 p-8 shadow-2xl backdrop-blur-md">
          <IconLoader2 className="size-8 animate-spin text-orange-500" />
          <p className="text-xs text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
