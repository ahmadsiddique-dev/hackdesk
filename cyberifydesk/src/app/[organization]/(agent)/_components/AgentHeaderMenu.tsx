"use client"

import * as React from "react"
import { useUserStore } from "@/store/user"
import { useRouter } from "next/navigation"
import { ThemeSwitch } from "@/components/elements/ThemeSwitch"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconLogout, IconUser } from "@tabler/icons-react"

interface AgentHeaderMenuProps {
  fullName: string
  role: string
}

export function AgentHeaderMenu({ fullName, role }: AgentHeaderMenuProps) {
  const clearAuth = useUserStore((state) => state.clearAuth)
  const router = useRouter()
  const [showConfirm, setShowConfirm] = React.useState(false)

  const { execute: executeLogout } = useApi(
    React.useCallback(
      () => api.post("/api/auth/logout").then((res) => res.data),
      []
    )
  )

  const handleLogout = async () => {
    clearAuth()
    await executeLogout()
    router.push("/signin")
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs">
        <IconUser className="size-3.5 text-muted-foreground" />
        <span className="font-semibold text-foreground">{fullName}</span>
        <span className="text-muted-foreground text-3xs capitalize px-1.5 py-0.5 rounded-full bg-muted">
          {role}
        </span>
      </div>
      <ThemeSwitch />
      <Popover open={showConfirm} onOpenChange={setShowConfirm}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-border/80 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          >
            <IconLogout className="mr-1.5 size-3.5" />
            <span>Logout</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-foreground">Confirm Logout</span>
            <span className="text-muted-foreground">Are you sure you want to log out?</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => setShowConfirm(false)}
              variant="ghost"
              size="sm"
              className="rounded-full text-2xs font-semibold h-7 px-3 hover:bg-muted"
            >
              No
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="rounded-full text-2xs font-semibold h-7 px-3"
            >
              Yes
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
