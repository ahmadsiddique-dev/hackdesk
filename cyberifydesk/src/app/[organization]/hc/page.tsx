import * as React from "react"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import { HelpCenterContent } from "@/components/elements/HelpCenterContent"
import { HelpCenterHeader } from "@/components/elements/HelpCenterHeader"

export default async function HelpCenterPage({
  params,
}: {
  params: Promise<{ organization: string }>
}) {
  const { organization } = await params
  
  const orgName = organization
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
      <BackgroundBlur />

      <HelpCenterHeader organizationName={orgName} />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8 justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {orgName} Help Center
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Welcome to our support portal. If you need help with our services, please submit a ticket below for agent support or chat with our AI assistant.
          </p>
        </div>

        <HelpCenterContent organizationName={orgName} />
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-muted-foreground text-2xs mt-auto">
        <span>Cyberify AI Support Desk built by Ahmad Siddique</span>
      </footer>
    </div>
  )
}
