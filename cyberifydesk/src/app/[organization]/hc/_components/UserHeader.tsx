"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconLogout, IconUser, IconMenu2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ThemeSwitch } from "@/components/elements/ThemeSwitch"

interface HelpCenterHeaderProps {
  organizationName: string
}

export function HelpCenterHeader({ organizationName }: HelpCenterHeaderProps) {
  const customerUser = useCustomerStore((state) => state.user)
  const customerAccessToken = useCustomerStore((state) => state.accessToken)
  const clearCustomerAuth = useCustomerStore((state) => state.clearAuth)
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const params = useParams()
  const pathname = usePathname()
  const orgSlug = params?.organization as string

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
        <div className="flex items-center gap-6">
          <Link
            href={`/${orgSlug}/hc`}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Cyberify Desk Logo"
              width={24}
              height={24}
              className="size-6 object-contain"
            />
            <span className="font-extrabold text-sm tracking-tight text-foreground mr-4 hidden min-[400px]:inline-block">
              Cyberify Desk
            </span>
          </Link>

          {isLoggedIn && (
            <>
              <nav className="hidden sm:flex items-center gap-4">
                <Link
                  href={`/${orgSlug}/hc/new-ticket`}
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    pathname === `/${orgSlug}/hc/new-ticket`
                      ? "text-orange-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  New Ticket
                </Link>
                <Link
                  href={`/${orgSlug}/hc/tickets`}
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    pathname === `/${orgSlug}/hc/tickets`
                      ? "text-orange-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  My Tickets
                </Link>
              </nav>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full hover:bg-muted border border-border/20 text-muted-foreground hover:text-foreground sm:hidden"
                  >
                    <IconMenu2 className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1.5 flex flex-col rounded-xl border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200" align="start">
                  <Link
                    href={`/${orgSlug}/hc/new-ticket`}
                    className={cn(
                      "flex items-center text-2xs h-8 px-2.5 rounded-lg font-semibold transition-colors",
                      pathname === `/${orgSlug}/hc/new-ticket`
                        ? "bg-orange-500/10 text-orange-500 font-bold"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    New Ticket
                  </Link>
                  <Link
                    href={`/${orgSlug}/hc/tickets`}
                    className={cn(
                      "flex items-center text-2xs h-8 px-2.5 rounded-lg font-semibold transition-colors mt-0.5",
                      pathname === `/${orgSlug}/hc/tickets`
                        ? "bg-orange-500/10 text-orange-500 font-bold"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    My Tickets
                  </Link>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border/40 bg-background/50 p-1.5 min-[480px]:gap-2 min-[480px]:px-3 min-[480px]:py-1 text-xs">
                <IconUser className="size-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground hidden min-[480px]:inline">
                  {customerUser.fullName}
                </span>
                <span className="text-muted-foreground text-3xs capitalize px-1.5 py-0.5 rounded-full bg-muted hidden min-[580px]:inline">
                  Customer
                </span>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border/80 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 h-8 w-8 p-0 min-[480px]:w-auto min-[480px]:px-4"
                  >
                    <IconLogout className="size-3.5 min-[480px]:mr-1.5" />
                    <span className="hidden min-[480px]:inline">Logout</span>
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
          )}
        </div>
      </div>
    </header>
  )
}
