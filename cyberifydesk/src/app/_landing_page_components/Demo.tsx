"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IconCircleCheck, IconRobot, IconSparkles } from "@tabler/icons-react"

const clientTickets = [
  {
    id: "ticket-1",
    title: "WebUSB connection drops during accelerometer read loop",
    status: "Docs Bot Solved",
    priority: "High",
    time: "2 mins ago",
    desc: "We are reading sensor data in a 60Hz loop via serial over WebUSB, but the stream hangs after about 15 seconds. Chrome console shows transfer error.",
    category: "WebUSB",
    aiSummary:
      "USB stream buffer overflow caused by high frequency polling without buffer release. Resolved by suggesting buffer flushing or adding a client-side throttle.",
    timeline: [
      {
        status: "Issue Opened",
        time: "2 mins ago",
        detail: "Hacker opened ticket under project tracker.",
      },
      {
        status: "Docs Search",
        time: "1 min ago",
        detail: "AI scanned WebUSB helper guide and identified buffer limitations.",
      },
      {
        status: "Auto-Resolved",
        time: "Just now",
        detail:
          "Suggested buffer flushing instructions. Hacker confirmed stream is stable.",
      },
    ],
  },
  {
    id: "ticket-2",
    title: "Custom manifest rules blocking Dev Server CORS requests",
    status: "Maintainer Review",
    priority: "Medium",
    time: "1 hour ago",
    desc: "Trying to test our Next.js frontend with local server backend, but getting blocked by CORS errors on our manifest endpoint.",
    category: "CORS / Manifest",
    aiSummary:
      "CORS blocks local dev server due to missing headers in next.config.js or development environment file configurations.",
    timeline: [
      {
        status: "Issue Opened",
        time: "1 hour ago",
        detail: "Submitted by hacker contributor.",
      },
      {
        status: "AI Triaged",
        time: "58 mins ago",
        detail:
          "AI assigned 'Medium' priority and flagged config folder.",
      },
      {
        status: "Draft Ready",
        time: "50 mins ago",
        detail: "Suggested CORS config rewrite ready for maintainer review.",
      },
    ],
  },
]

export function Demo() {
  const [selectedTicketId, setSelectedTicketId] = React.useState("ticket-1")

  const selectedTicket =
    clientTickets.find((t) => t.id === selectedTicketId) || clientTickets[0]

  return (
    <section id="demo" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
          Live Simulator
        </h2>
        <p className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Explore the builder workspace.
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          See the collaborative workspace built for both hackers seeking assistance
          and project maintainers triaging issues.
        </p>
      </div>

      <Tabs
        defaultValue="clients"
        className="mx-auto flex max-w-5xl flex-col gap-6"
      >
        <div className="flex justify-center">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger
              value="clients"
              className="rounded-full px-6 py-2 text-sm font-semibold"
            >
              For Hackers
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="rounded-full px-6 py-2 text-sm font-semibold"
            >
              For Maintainers
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="clients"
          className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-xl backdrop-blur-md"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-1">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Active Tickets
              </span>
              <div className="flex flex-col gap-2">
                {clientTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedTicketId === ticket.id
                        ? "border-red-500 bg-red-500/5"
                        : "border-border/40 bg-background/50 hover:border-border/80"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className={`text-2xs rounded-full px-2 py-0.5 font-bold ${
                          ticket.status.includes("Solved") || ticket.status.includes("Bot")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-2xs text-muted-foreground">
                        {ticket.time}
                      </span>
                    </div>
                    <h4 className="mb-1 truncate text-sm font-bold">
                      {ticket.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {ticket.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-xl border border-border/40 bg-background/50 p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <span className="text-2xs text-muted-foreground uppercase">
                    Ticket Viewer
                  </span>
                  <h3 className="text-base font-bold">
                    {selectedTicket.title}
                  </h3>
                </div>
                <span
                  className={`text-2xs rounded-md px-2 py-1 font-bold ${
                    selectedTicket.priority === "High"
                      ? "bg-rose-500/15 text-rose-500"
                      : "bg-amber-500/15 text-amber-500"
                  }`}
                >
                  {selectedTicket.priority} Priority
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground">
                    Issue Description
                  </span>
                  <p className="mt-1 rounded-lg border border-border/40 bg-muted/20 p-4 text-sm leading-relaxed text-foreground/80">
                    {selectedTicket.desc}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-muted-foreground">
                    Activity Timeline
                  </span>
                  <div className="flex flex-col gap-4 pl-2">
                    {selectedTicket.timeline.map((item, idx) => (
                      <div key={idx} className="relative flex gap-4">
                        {idx !== selectedTicket.timeline.length - 1 && (
                          <div className="absolute top-5 -bottom-4 left-2.5 w-px bg-border" />
                        )}
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                            item.status.includes("Solved") ||
                            item.status.includes("Triaged") ||
                            item.status.includes("Resolved")
                              ? "bg-red-600 text-white"
                              : "border border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconCircleCheck className="size-3" />
                        </div>
                        <div className="flex flex-col text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {item.status}
                            </span>
                            <span className="text-2xs text-muted-foreground">
                              {item.time}
                            </span>
                          </div>
                          <span className="mt-0.5 text-muted-foreground">
                            {item.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="agents"
          className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-xl backdrop-blur-md"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-1">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Maintainer Queue
              </span>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xs rounded-full bg-red-500/10 px-2 py-0.5 font-bold text-red-500">
                    Needs Reply
                  </span>
                  <span className="text-2xs text-muted-foreground">
                    Priority: Medium
                  </span>
                </div>
                <h4 className="mb-1 text-sm font-bold">
                  Dev Server CORS blocks manifest requests
                </h4>
                <span className="text-xs text-muted-foreground">
                  Assigned to Ahmad Siddique
                </span>
              </div>

              <div className="rounded-xl border border-border/40 bg-background/50 p-4 opacity-60">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xs rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">
                    Closed
                  </span>
                  <span className="text-2xs text-muted-foreground">
                    Priority: Low
                  </span>
                </div>
                <h4 className="mb-1 text-sm font-bold">
                  Fix typos in webusb setup documentation
                </h4>
                <span className="text-xs text-muted-foreground">
                  Self-Solved by Docs Bot
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-xl border border-border/40 bg-background/50 p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <IconRobot className="size-5 animate-bounce text-red-500" />
                  <div>
                    <span className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">
                      AI Copilot Analysis
                    </span>
                    <h3 className="text-sm font-bold text-red-500 dark:text-red-400">
                      Triaging Dev Server CORS issue
                    </h3>
                  </div>
                </div>
                <span className="text-2xs rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500 uppercase">
                  Ready to send
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                    <IconSparkles className="size-4" />
                    <span>AI Autotriage Summary</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    Front-end request is blocked by CORS due to mismatched headers in development configurations. Suggest updating origin configuration in next.config.ts to allow localhost ports.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-muted-foreground">
                    Instant Contextual AI Draft Reply
                  </span>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs leading-relaxed text-foreground">
                      Hey there! It looks like your dev server is rejecting requests due to local CORS configurations. Try updating your Next.js next.config.ts config to permit local dev endpoints, or add:{" "}
                      <code className="text-2xs rounded bg-muted px-1.5 py-0.5 font-mono">
                        Access-Control-Allow-Origin: *
                      </code>
                       to your local headers temporarily. Let us know if that works!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-full font-semibold"
                  >
                    Decline
                  </Button>
                  <Button className="rounded-full bg-red-600 font-semibold text-white shadow-md shadow-red-500/10 hover:bg-red-500">
                    Approve & Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
