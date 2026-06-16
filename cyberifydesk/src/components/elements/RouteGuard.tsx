"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import { BackgroundBlur } from "./BackgroundBlur"
import { IconLoader2 } from "@tabler/icons-react"
import { slugify } from "@/lib/utils"
import { useCustomerStore } from "@/store/customer"

interface RouteGuardProps {
  children: React.ReactNode
}

const authRoutes = ["/signin", "/signup", "/forgot-password"]

export function RouteGuard({ children }: RouteGuardProps) {
  const accessToken = useUserStore((state) => state.accessToken)
  const user = useUserStore((state) => state.user)
  const setAuth = useUserStore((state) => state.setAuth)
  const clearAuth = useUserStore((state) => state.clearAuth)

  const customerAccessToken = useCustomerStore((state) => state.accessToken)
  const customerUser = useCustomerStore((state) => state.user)
  const setCustomerAuth = useCustomerStore((state) => state.setAuth)
  const clearCustomerAuth = useCustomerStore((state) => state.clearAuth)

  const router = useRouter()
  const pathname = usePathname()

  const [hydrated, setHydrated] = React.useState(false)
  const [verifying, setVerifying] = React.useState(true)
  const verifiedRef = React.useRef(false)

  const { execute: verifySession } = useApi(
    React.useCallback(
      () =>
        api
          .post("/api/auth/agent/verify")
          .then((res) => res.data),
      []
    )
  )

  const { execute: verifyCustomerSession } = useApi(
    React.useCallback(
      () =>
        api
          .post("/api/auth/agent/verify", null, {
            headers: { "X-Role": "customer" },
          })
          .then((res) => res.data),
      []
    )
  )

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return

    const checkAuth = async () => {
      const pathParts = pathname.split("/").filter(Boolean)
      const isProtectedRoute =
        pathParts.length >= 2 &&
        ["dashboard", "tickets", "knowledge-base"].includes(pathParts[1])
      const isCustomerRoute = pathParts.length >= 2 && pathParts[1] === "hc"
      const isAuthRoute = authRoutes.includes(pathname)

      if (!isAuthRoute && !isProtectedRoute && !isCustomerRoute) {
        setVerifying(false)
        return
      }

      if (isCustomerRoute) {
        if (!customerAccessToken) {
          setVerifying(false)
          return
        }
        const res = await verifyCustomerSession()
        if (res && res.success) {
          setCustomerAuth(res.accessToken || customerAccessToken, res.user)
        } else {
          clearCustomerAuth()
        }
        setVerifying(false)
        return
      }

      if (isProtectedRoute || isAuthRoute) {
        if (!accessToken) {
          verifiedRef.current = false
          if (isProtectedRoute) {
            clearAuth()
            router.push("/signin")
          } else {
            setVerifying(false)
          }
          return
        }

        if (verifiedRef.current) {
          if (isProtectedRoute && user && user.role !== "agent") {
            const orgSlug = user.organization ? slugify(user.organization) : "default"
            router.push(`/${orgSlug}/hc`)
            return
          }

          if (isAuthRoute) {
            const orgSlug = user?.organization ? slugify(user.organization) : "default"
            if (user?.role === "agent") {
              router.push(`/${orgSlug}/dashboard`)
            } else {
              router.push(`/${orgSlug}/hc`)
            }
          } else {
            setVerifying(false)
          }
          return
        }

        const res = await verifySession()
        if (res && res.success) {
          const newAccessToken = res.accessToken || accessToken
          setAuth(newAccessToken, res.user)
          verifiedRef.current = true

          if (isProtectedRoute && res.user && res.user.role !== "agent") {
            const orgSlug = res.user.organization ? slugify(res.user.organization) : "default"
            router.push(`/${orgSlug}/hc`)
            return
          }

          if (isAuthRoute) {
            const orgSlug = res.user?.organization ? slugify(res.user.organization) : "default"
            if (res.user?.role === "agent") {
              router.push(`/${orgSlug}/dashboard`)
            } else {
              router.push(`/${orgSlug}/hc`)
            }
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
      }
    }

    setVerifying(true)
    checkAuth()
  }, [pathname, accessToken, customerAccessToken, hydrated, verifySession, verifyCustomerSession, clearAuth, clearCustomerAuth, setAuth, setCustomerAuth, router, user?.organization, customerUser?.organization])

  if (!hydrated) {
    return null
  }

  const isAuthRoute = authRoutes.includes(pathname)
  const pathParts = pathname.split("/").filter(Boolean)
  const isProtectedRoute =
    pathParts.length >= 2 &&
    ["dashboard", "tickets", "knowledge-base"].includes(pathParts[1])

  if (verifying && (isProtectedRoute || (isAuthRoute && accessToken))) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
        <BackgroundBlur />
        <div className="z-10 flex flex-col items-center gap-4 py-8 px-12 rounded-2xl border border-border/40 bg-card/30 p-8 shadow-2xl backdrop-blur-md">
          <IconLoader2 className="size-8 animate-spin text-orange-500" />
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
