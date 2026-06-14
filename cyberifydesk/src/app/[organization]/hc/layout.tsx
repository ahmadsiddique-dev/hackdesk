import * as React from "react"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import { HelpCenterHeader } from "@/app/[organization]/hc/_components/UserHeader"

export default async function HelpCenterLayout({
  children,
  params,
}: {
  children: React.ReactNode
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

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-muted-foreground text-2xs mt-auto">
        <span>Cyberify AI Support Desk built by Ahmad Siddique</span>
      </footer>
    </div>
  )
}
