import * as React from "react"
import Link from "next/link"
import { IconTicket, IconInbox, IconArrowRight } from "@tabler/icons-react"

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
    <div className="flex flex-1 flex-col items-center justify-center py-2 md:py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-2xs font-semibold tracking-wide text-orange-500 uppercase">
          Help Center
        </div>
        
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Welcome to <span className="bg-linear-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">{orgName}</span> Support
        </h1>
        
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          How can we help you today? Please choose an action below to submit a new support request or manage your existing tickets.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mt-8 sm:mt-12 max-w-4xl mx-auto w-full px-4">
        <Link
          href={`/${organization}/hc/new-ticket`}
          className="group relative flex flex-col justify-between rounded-3xl border border-border/40 bg-card/30 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/[0.02] hover:-translate-y-1 hover:shadow-orange-500/[0.02]"
        >
          <div className="flex flex-col gap-5">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 text-orange-500">
              <IconTicket className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
                Create New Ticket
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Submit a new support ticket. Provide details, describe the issue, set priority, and attach files to help us resolve it quickly.
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-orange-500 transition-colors group-hover:text-orange-400">
            <span>Open a ticket</span>
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href={`/${organization}/hc/tickets`}
          className="group relative flex flex-col justify-between rounded-3xl border border-border/40 bg-card/30 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/[0.02] hover:-translate-y-1 hover:shadow-orange-500/[0.02]"
        >
          <div className="flex flex-col gap-5">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 text-amber-500">
              <IconInbox className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
                My Tickets
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                View your active and past support requests. Track statuses, check agent responses, and chat in real-time.
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-orange-500 transition-colors group-hover:text-orange-400">
            <span>View my tickets</span>
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  )
}