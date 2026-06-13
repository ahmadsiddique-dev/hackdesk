"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconLogout, IconUser } from "@tabler/icons-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface HelpCenterHeaderProps {
  organizationName: string
}

export function HelpCenterHeader({ organizationName }: HelpCenterHeaderProps) {
  const customerUser = useCustomerStore((state) => state.user)
  const customerAccessToken = useCustomerStore((state) => state.accessToken)
  const clearCustomerAuth = useCustomerStore((state) => state.clearAuth)
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { execute: executeLogout } = useApi(
    React.useCallback(
      () =>
        api.post("/api/auth/agent/logout", null, {
          headers: { "X-Role": "customer" },
        }).then((res) => res.data),
      []
    )
  )

  const handleLogout = async () => {
    clearCustomerAuth()
    await executeLogout()
  }

  const isLoggedIn = mounted && !!customerAccessToken && !!customerUser?._id

  return (
    <header className="border-b border-border/40 bg-card/25 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Cyberify Desk Logo"
            width={24}
            height={24}
            className="size-6 object-contain"
          />
          <span className="font-extrabold text-sm tracking-tight text-foreground">
            Cyberify Desk
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs">
                <IconUser className="size-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {customerUser.fullName}
                </span>
                <span className="text-muted-foreground text-3xs capitalize px-1.5 py-0.5 rounded-full bg-muted">
                  Customer
                </span>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border/80 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 h-8 px-4"
                  >
                    <IconLogout className="mr-1.5 size-3.5" />
                    <span>Logout</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 flex flex-col gap-3 rounded-xl border border-border/40 bg-card/90 backdrop-blur-md shadow-2xl animate-in fade-in duration-200" align="end">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-foreground">Confirm Logout</p>
                    <p className="text-3xs text-muted-foreground">Are you sure you want to log out of your session?</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="h-7 text-3xs px-2.5 rounded-md border-border/60 hover:bg-muted font-medium"
                    >
                      No
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpen(false)
                        handleLogout()
                      }}
                      className="h-7 text-3xs px-2.5 rounded-md bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 font-semibold text-white shadow-sm"
                    >
                      Yes
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Link
              href="/signin"
              className="text-xs font-semibold text-muted-foreground hover:text-orange-500 transition-colors"
            >
              Agent Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
