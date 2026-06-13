import * as React from "react"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import { HelpCenterForm } from "@/components/elements/HelpCenterForm"
import { ChatWidget } from "@/components/elements/ChatWidget"
import Image from "next/image"
import Link from "next/link"

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
          <Link
            href="/signin"
            className="text-xs font-semibold text-muted-foreground hover:text-orange-500 transition-colors"
          >
            Agent Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {orgName} Help Center
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Welcome to our support portal. If you need help with our services, please submit a ticket below or chat with our live agents.
          </p>
        </div>

        <div className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Submit a Support Ticket
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Provide the details of your inquiry, and our support team will respond as quickly as possible.
          </p>
          <HelpCenterForm />
        </div>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-muted-foreground text-2xs mt-auto">
        <span>Cyberify AI Support Desk built by Ahmad Siddique</span>
      </footer>

      <ChatWidget />
    </div>
  )
}
