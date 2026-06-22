"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SubscribeForm() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <div className="flex flex-col gap-4 md:items-end">
      <div className="md:text-right">
        <h3 className="text-sm font-bold text-foreground">
          Deploy Your HackDesk
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your email to spin up your custom hacker workspace.
        </p>
      </div>

      {submitted ? (
        <div className="text-xs font-semibold text-red-500 md:text-right">
          We are not accepting requests right now.
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="flex w-full max-w-md gap-3 md:justify-end"
        >
          <Input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="rounded-full border-border/80 bg-background/70 px-4 py-5 text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-red-500/50"
          />
          <Button
            type="submit"
            className="rounded-full bg-linear-to-r from-red-500 to-rose-600 px-6 py-5 text-xs font-semibold text-white shadow-md shadow-red-500/10 hover:from-red-600 hover:to-rose-700"
          >
            Deploy
          </Button>
        </form>
      )}
    </div>
  )
}
