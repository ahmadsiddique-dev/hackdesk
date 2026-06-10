"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  IconBrain,
  IconMessage2,
  IconDatabase,
  IconGitCommit,
  IconSun,
  IconMoon,
  IconCircleCheck,
  IconArrowRight,
  IconSend,
  IconRobot,
  IconFileText,
  IconChecks,
  IconSparkles
} from "@tabler/icons-react"

export default function Page() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [selectedTicketId, setSelectedTicketId] = React.useState("ticket-1")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // TODO: Connect deployment trigger logic to backend database API and spin up workspace
      setSubmitted(true)
      setEmail("")
    }
  }

  const clientTickets = [
    {
      id: "ticket-1",
      title: "RAG Knowledge Base failed to parse custom PDF manual",
      status: "RAG Self-Solved",
      priority: "High",
      time: "2 mins ago",
      desc: "Uploaded our 200-page service manual in PDF format, but queries about Section 4 return empty answers.",
      category: "Integration",
      aiSummary: "The RAG pipeline failed to parse a 200-page PDF document due to size constraints. The AI model successfully recommended chunking the document into sections.",
      timeline: [
        { status: "Ticket Created", time: "2 mins ago", detail: "Ticket submitted by client via portal." },
        { status: "RAG Analysis", time: "1 min ago", detail: "AI searched 'kb_manual_v2.db' and identified section overlap." },
        { status: "Self-Solved", time: "Just now", detail: "RAG recommended Section 4 table-extraction fix. Client marked as resolved." }
      ]
    },
    {
      id: "ticket-2",
      title: "Unable to set up custom webhook for Slack notifications",
      status: "Agent Review",
      priority: "Medium",
      time: "1 hour ago",
      desc: "Webhooks fail validation test when executing Slack app payload rules. Need help debugging headers.",
      category: "Webhooks",
      aiSummary: "Slack webhooks are failing with a 400 Bad Request error. Root cause is likely missing Content-Type header in the validation packet.",
      timeline: [
        { status: "Ticket Created", time: "1 hour ago", detail: "Submitted via API endpoint." },
        { status: "AI Autotriage", time: "58 mins ago", detail: "AI assigned 'Medium' priority and flagged Slack integration team." },
        { status: "Agent Draft Ready", time: "50 mins ago", detail: "One-Click AI Reply generated and awaiting agent review." }
      ]
    }
  ]

  const selectedTicket = clientTickets.find(t => t.id === selectedTicketId) || clientTickets[0]

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/4 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[150px] dark:bg-orange-600/15" />
        <div className="absolute top-[-100px] right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] dark:bg-amber-500/15" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20">
              <IconSparkles className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
              Cyberify Desk
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            {mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="rounded-full hover:bg-muted"
                    aria-label="Toggle theme"
                  >
                    {resolvedTheme === "dark" ? (
                      <IconSun className="size-5 text-yellow-400" />
                    ) : (
                      <IconMoon className="size-5 text-orange-950" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Press <kbd className="font-sans font-bold bg-muted/20 px-1 py-0.5 rounded text-2xs">D</kbd> to toggle theme
                </TooltipContent>
              </Tooltip>
            )}

            <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full text-sm font-semibold">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-500/10 font-semibold px-5">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-6 backdrop-blur-sm animate-pulse">
            <IconSparkles className="size-3.5" />
            <span>Introducing Agent Autopilot 2.0</span>
          </div>

          <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground mb-6">
            Customer Support, <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Supercharged by AI.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed mb-10">
            A SaaS-style helpdesk that automates ticket summarization, drafts instant agent replies, and self-solves issues using RAG knowledge bases.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center">
            <Button size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold shadow-lg shadow-orange-500/20 px-8 py-6 text-base">
              Get Started For Free
              <IconArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-border/80 px-8 py-6 text-base font-semibold hover:bg-muted bg-background/50">
              Watch 5m Demo
            </Button>
          </div>

          <div className="w-full max-w-5xl rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-2 shadow-2xl">
            <div className="rounded-xl border border-border/50 bg-background/90 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 text-left">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-500" />
                    <span className="size-3 rounded-full bg-amber-500" />
                    <span className="size-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Client Portal</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl border border-border/40 bg-card/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-orange-500 uppercase">New Support Ticket</span>
                      <span className="text-xs text-muted-foreground">ID: #4092</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">RAG Knowledge Base failed to parse custom PDF manual</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Uploaded our 200-page service manual in PDF format, but queries about Section 4 return empty answers.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">RAG Knowledge Attachment</span>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border/60 bg-muted/20">
                      <div className="flex items-center gap-2">
                        <IconFileText className="size-5 text-orange-500" />
                        <span className="text-xs font-medium">kb_manual_v2.pdf</span>
                      </div>
                      <span className="text-2xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Uploaded</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <span>Priority: Urgent</span>
                    <span>Status: Auto-Deflecting...</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 bg-muted/5">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <IconRobot className="size-4.5 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cyberify AI Copilot</span>
                  </div>
                  <span className="text-2xs bg-orange-500/15 text-orange-500 px-2.5 py-0.5 rounded-full font-bold">Active</span>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                      <IconBrain className="size-4" />
                      <span>AI Ticket Summary</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      Client is experiencing zero-response RAG queries on Section 4 of document. Identified mismatch in parsing chunk overlaps.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/40 bg-card/60">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <div className="flex items-center gap-1">
                        <IconMessage2 className="size-4 text-orange-500" />
                        <span>Suggested Reply Draft</span>
                      </div>
                      <span className="text-2xs text-muted-foreground">98% confidence</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      Hello Ahmad, it looked like your PDF parsing failed due to overlapping layout boundaries. We recommend re-indexing with layout-aware configurations.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button size="xs" variant="outline" className="text-2xs font-semibold rounded-full">Refine</Button>
                      <Button size="xs" className="text-2xs font-semibold rounded-full bg-orange-600 text-white hover:bg-orange-500">Insert Draft</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 border-t border-border/40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">Enterprise Power</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Everything you need to automate support.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base">
              Say goodbye to manual categorization, typing boilerplate answers, and searching folders. Cyberify automates it all instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-5 group-hover:scale-110 transition-transform">
                <IconBrain />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Ticket Assistant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatically generates summaries, priority flags, and root cause analysis the second a ticket is made.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-5 group-hover:scale-110 transition-transform">
                <IconMessage2 />
              </div>
              <h3 className="text-lg font-bold mb-2">One-Click AI Replies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowers support agents to draft contextual, hyper-professional responses instantly.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-5 group-hover:scale-110 transition-transform">
                <IconDatabase />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant RAG Knowledge Base</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deflects incoming tickets by answering user questions directly from uploaded PDF/TXT manuals.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-5 group-hover:scale-110 transition-transform">
                <IconGitCommit />
              </div>
              <h3 className="text-lg font-bold mb-2">Transparent Ticket Timelines</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Complete activity logging tracking everything from creation to ultimate resolution.
              </p>
            </div>
          </div>
        </section>

        <section id="demo" className="py-20 md:py-28 border-t border-border/40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">Live Simulation</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Explore your new workspace.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base">
              See the exact workspace built specifically for both sides of your customer support ecosystem.
            </p>
          </div>

          <Tabs defaultValue="clients" className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex justify-center">
              <TabsList className="bg-muted p-1 rounded-full">
                <TabsTrigger value="clients" className="rounded-full px-6 py-2 text-sm font-semibold">For Clients</TabsTrigger>
                <TabsTrigger value="agents" className="rounded-full px-6 py-2 text-sm font-semibold">For Agents</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="clients" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-6 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Tickets</span>
                  <div className="flex flex-col gap-2">
                    {clientTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedTicketId === ticket.id
                            ? "border-orange-500 bg-orange-500/5"
                            : "border-border/40 hover:border-border/80 bg-background/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            ticket.status.includes("Solved")
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {ticket.status}
                          </span>
                          <span className="text-2xs text-muted-foreground">{ticket.time}</span>
                        </div>
                        <h4 className="text-sm font-bold truncate mb-1">{ticket.title}</h4>
                        <span className="text-xs text-muted-foreground">{ticket.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6 p-6 rounded-xl border border-border/40 bg-background/50">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div>
                      <span className="text-2xs text-muted-foreground uppercase">Ticket Viewer</span>
                      <h3 className="text-base font-bold">{selectedTicket.title}</h3>
                    </div>
                    <span className={`text-2xs font-bold px-2 py-1 rounded-md ${
                      selectedTicket.priority === "High" ? "bg-rose-500/15 text-rose-500" : "bg-amber-500/15 text-amber-500"
                    }`}>
                      {selectedTicket.priority} Priority
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground">Issue Description</span>
                      <p className="text-sm mt-1 text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/40">
                        {selectedTicket.desc}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-muted-foreground">Activity Timeline</span>
                      <div className="flex flex-col gap-4 pl-2">
                        {selectedTicket.timeline.map((item, idx) => (
                          <div key={idx} className="flex gap-4 relative">
                            {idx !== selectedTicket.timeline.length - 1 && (
                              <div className="absolute top-5 left-2.5 bottom-[-16px] w-[1px] bg-border" />
                            )}
                            <div className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                              item.status.includes("Solved") || item.status.includes("Autotriage")
                                ? "bg-orange-600 text-white"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}>
                              <IconCircleCheck className="size-3" />
                            </div>
                            <div className="flex flex-col text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{item.status}</span>
                                <span className="text-2xs text-muted-foreground">{item.time}</span>
                              </div>
                              <span className="text-muted-foreground mt-0.5">{item.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-6 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Agent Queue</span>
                  <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">Needs Reply</span>
                      <span className="text-2xs text-muted-foreground">Priority: High</span>
                    </div>
                    <h4 className="text-sm font-bold mb-1">Slack notifications webhook header error</h4>
                    <span className="text-xs text-muted-foreground">Assigned to Ahmad Siddique</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/40 bg-background/50 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Closed</span>
                      <span className="text-2xs text-muted-foreground">Priority: Low</span>
                    </div>
                    <h4 className="text-sm font-bold mb-1">Billing query about annual tier conversion</h4>
                    <span className="text-xs text-muted-foreground">Self-Solved by RAG Bot</span>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6 p-6 rounded-xl border border-border/40 bg-background/50">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-2">
                      <IconRobot className="size-5 text-orange-500 animate-bounce" />
                      <div>
                        <span className="text-2xs text-muted-foreground uppercase font-bold tracking-wider">AI Copilot Analysis</span>
                        <h3 className="text-sm font-bold text-orange-500 dark:text-orange-400">Autocompleting Slack webhook ticket</h3>
                      </div>
                    </div>
                    <span className="text-2xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-bold uppercase">Ready to send</span>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="p-4 rounded-xl border border-orange-500/10 bg-orange-500/5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                        <IconSparkles className="size-4" />
                        <span>AI Autotriage Summary</span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        Webhook call fails due to invalid JSON payload header definitions. Recommend instructing user to inject Content-Type headers explicitly before payload transmission.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-muted-foreground">Instant Contextual AI Draft Reply</span>
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <p className="text-xs text-foreground leading-relaxed">
                          Hello Ahmad, it looks like your webhook POST request is missing the standard payload parameters. Please make sure that you pass the Header parameter: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-2xs">Content-Type: application/json</code>. Let me know if that resolves it!
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="outline" className="rounded-full font-semibold">Decline</Button>
                      <Button className="rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/10">
                        Approve & Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section id="pricing" className="py-20 md:py-28 border-t border-border/40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">Simple Pricing</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Transparent scaling for teams of all sizes.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start free, unlock advanced AI RAG storage and custom domains as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border/40 bg-card/30 p-8 flex flex-col gap-6 justify-between hover:border-orange-500/20 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-muted-foreground">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Perfect for side projects and individual developers getting started.
                </p>
                <div className="mt-6 border-t border-border/40 pt-6 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>100 AI Summaries / mo</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>1 RAG PDF Manual (Up to 5MB)</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>1 Helpdesk Agent Seat</span></div>
                </div>
              </div>
              {/* TODO: Link Starter tier checkout redirect to Stripe checkout configuration */}
              <Button variant="outline" className="w-full rounded-full font-semibold">Start Free</Button>
            </div>

            <div className="relative rounded-2xl border-2 border-orange-500 bg-orange-500/5 p-8 flex flex-col gap-6 justify-between shadow-xl shadow-orange-500/5">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold">Growth Team</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">$49</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Ideal for growing support operations looking to automate deflection.
                </p>
                <div className="mt-6 border-t border-border/40 pt-6 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-orange-500" /><span>Unlimited AI Summaries & Drafts</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-orange-500" /><span>10 RAG Manuals (No limit)</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-orange-500" /><span>5 Helpdesk Agent Seats included</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-orange-500" /><span>Slack & Email Integrations</span></div>
                </div>
              </div>
              <Button className="w-full rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/10">Upgrade to Growth</Button>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/30 p-8 flex flex-col gap-6 justify-between hover:border-orange-500/20 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-muted-foreground">Scale</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">$149</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  For large businesses requiring enterprise SLAs and custom LLMs.
                </p>
                <div className="mt-6 border-t border-border/40 pt-6 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>Everything in Growth Team</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>Custom LLM tuning & integrations</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>Unlimited Agent Seats</span></div>
                  <div className="flex items-center gap-2"><IconChecks className="size-4 text-emerald-500" /><span>24/7 Dedicated Support & Uptime SLA</span></div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full font-semibold">Contact Sales</Button>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="relative rounded-3xl border border-border/40 bg-card/30 overflow-hidden px-8 py-16 text-center max-w-5xl mx-auto flex flex-col items-center shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 relative">
              Ready to scale your support operations?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-10 relative">
              Join teams deflection-tuning their ticket lifecycles today. Set up your AI desk in under five minutes.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-500 text-sm font-semibold flex items-center gap-2 relative">
                <IconCircleCheck className="size-5" />
                <span>Thank you! Your Cyberify AI workspace is spinning up.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md relative">
                <Input
                  type="email"
                  required
                  placeholder="Enter your work email" // TODO: Implement Email logic
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full border-border/80 bg-background/70 px-5 py-6 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-orange-500/50"
                />
                <Button type="submit" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold px-7 py-6 text-sm shadow-md shadow-orange-500/10">
                  Deploy Your Desk
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-16 bg-muted/5 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Cyberify Desk</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Built with Next.js, Tailwind & Shadcn UI by</span>
            <span className="font-semibold text-foreground underline decoration-orange-500/50 underline-offset-4">Ahmad Siddique</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
