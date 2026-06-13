"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { UserForm } from "./UserForm"
import { UserAuth } from "./UserAuth"
import { ChatWidget } from "./ChatWidget"

interface UserContentProps {
  organizationName: string
}

export function UserContent({ organizationName }: UserContentProps) {
  const accessToken = useCustomerStore((state) => state.accessToken)
  const user = useCustomerStore((state) => state.user)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="size-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isAuthenticated = !!accessToken && !!user?._id

  if (!isAuthenticated) {
    return <UserAuth organizationName={organizationName} />
  }

  return (
    <>
      <div className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <h2 className="text-lg font-bold text-foreground mb-1">
          Submit a Support Ticket
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Provide the details of your inquiry, and our support team will respond as quickly as possible.
        </p>
        <UserForm />
      </div>
      <ChatWidget />
    </>
  )
}
