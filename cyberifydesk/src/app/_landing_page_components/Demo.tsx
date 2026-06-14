"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IconCircleCheck, IconRobot, IconSparkles } from "@tabler/icons-react"

const clientTickets = [
  {
    id: "ticket-1",
    title: "RAG Knowledge Base failed to parse custom PDF manual",
    status: "RAG Self-Solved",
    priority: "High",
    time: "2 mins ago",
    desc: "Uploaded our 200-page service manual in PDF format, but queries about Section 4 return empty answers.",
    category: "Integration",
    aiSummary:
      "The RAG pipeline failed to parse a 200-page PDF document due to size constraints. The AI model successfully recommended chunking the document into sections.",
    timeline: [
      {
        status: "Ticket Created",
        time: "2 mins ago",
        detail: "Ticket submitted by client via portal.",
      },
      {
        status: "RAG Analysis",
        time: "1 min ago",
        detail: "AI searched 'kb_manual_v2.db' and identified section overlap.",
      },
      {
        status: "Self-Solved",
        time: "Just now",
        detail:
          "RAG recommended Section 4 table-extraction fix. Client marked as resolved.",
      },
    ],
  },
  {
    id: "ticket-2",
    title: "Unable to set up custom webhook for Slack notifications",
    status: "Agent Review",
    priority: "Medium",
    time: "1 hour ago",
    desc: "Webhooks fail validation test when executing Slack app payload rules. Need help debugging headers.",
    category: "Webhooks",
    aiSummary:
      "Slack webhooks are failing with a 400 Bad Request error. Root cause is likely missing Content-Type header in the validation packet.",
    timeline: [
      {
        status: "Ticket Created",
        time: "1 hour ago",
        detail: "Submitted via API endpoint.",
      },
      {
        status: "AI Autotriage",
        time: "58 mins ago",
        detail:
          "AI assigned 'Medium' priority and flagged Slack integration team.",
      },
      {
        status: "Agent Draft Ready",
        time: "50 mins ago",
        detail: "One-Click AI Reply generated and awaiting agent review.",
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
        <h2 className="mb-3 text-xs font-bold tracking-widest text-orange-600 uppercase dark:text-orange-400">
          Live Simulation
        </h2>
        <p className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Explore your new workspace.
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          See the exact workspace built specifically for both sides of your
          customer support ecosystem.
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
              For Clients
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="rounded-full px-6 py-2 text-sm font-semibold"
            >
              For Agents
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
                        ? "border-orange-500 bg-orange-500/5"
                        : "border-border/40 bg-background/50 hover:border-border/80"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className={`text-2xs rounded-full px-2 py-0.5 font-bold ${
                          ticket.status.includes("Solved")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
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
                            item.status.includes("Autotriage")
                              ? "bg-orange-600 text-white"
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
                Agent Queue
              </span>
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xs rounded-full bg-amber-500/10 px-2 py-0.5 font-bold text-amber-500">
                    Needs Reply
                  </span>
                  <span className="text-2xs text-muted-foreground">
                    Priority: High
                  </span>
                </div>
                <h4 className="mb-1 text-sm font-bold">
                  Slack notifications webhook header error
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
                  Billing query about annual tier conversion
                </h4>
                <span className="text-xs text-muted-foreground">
                  Self-Solved by RAG Bot
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-xl border border-border/40 bg-background/50 p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <IconRobot className="size-5 animate-bounce text-orange-500" />
                  <div>
                    <span className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">
                      AI Copilot Analysis
                    </span>
                    <h3 className="text-sm font-bold text-orange-500 dark:text-orange-400">
                      Autocompleting Slack webhook ticket
                    </h3>
                  </div>
                </div>
                <span className="text-2xs rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500 uppercase">
                  Ready to send
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <IconSparkles className="size-4" />
                    <span>AI Autotriage Summary</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    Webhook call fails due to invalid JSON payload header
                    definitions. Recommend instructing user to inject
                    Content-Type headers explicitly before payload transmission.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-muted-foreground">
                    Instant Contextual AI Draft Reply
                  </span>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs leading-relaxed text-foreground">
                      Hello Ahmad, it looks like your webhook POST request is
                      missing the standard payload parameters. Please make sure
                      that you pass the Header parameter:{" "}
                      <code className="text-2xs rounded bg-muted px-1.5 py-0.5 font-mono">
                        Content-Type: application/json
                      </code>
                      . Let me know if that resolves it!
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
                  <Button className="rounded-full bg-orange-600 font-semibold text-white shadow-md shadow-orange-500/10 hover:bg-orange-500">
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
