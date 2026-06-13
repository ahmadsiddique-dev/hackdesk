import { checkAgentAuth } from "@/lib/auth-check"
import { DashboardHeader } from "@/components/elements/DashboardHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconPlus, IconExternalLink } from "@tabler/icons-react"

export default async function TicketsPage() {
  const user = await checkAgentAuth()

  const mockTickets = [
    {
      id: "TC-3024",
      customer: "Alex Rivera",
      subject: "Cannot access workspace API",
      status: "open",
      priority: "high",
      date: "2 hours ago",
    },
    {
      id: "TC-3023",
      customer: "Sarah Chen",
      subject: "Billing mismatch in monthly invoice",
      status: "pending",
      priority: "medium",
      date: "5 hours ago",
    },
    {
      id: "TC-3022",
      customer: "Marcus Vance",
      subject: "Integrations fail during webhook post",
      status: "open",
      priority: "high",
      date: "1 day ago",
    },
    {
      id: "TC-3021",
      customer: "Elena Rostova",
      subject: "Requesting custom domain setup",
      status: "closed",
      priority: "low",
      date: "2 days ago",
    },
    {
      id: "TC-3020",
      customer: "David Kim",
      subject: "Password reset link email delayed",
      status: "closed",
      priority: "low",
      date: "3 days ago",
    },
  ]

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
      <BackgroundBlur />
      <DashboardHeader title="Tickets Queue" user={user} />

      <main className="px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Support Tickets Queue
              </h3>
              <p className="text-xs text-muted-foreground">
                Overview of all active customer tickets and their current status.
              </p>
            </div>
            <Button className="rounded-full bg-linear-to-r from-orange-600 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400">
              <IconPlus className="mr-1.5 size-4" />
              <span>Create Ticket</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/40 hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">Ticket ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Customer</TableHead>
                  <TableHead className="font-semibold text-foreground">Subject</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Priority</TableHead>
                  <TableHead className="font-semibold text-foreground">Created</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                  >
                    <TableCell className="font-semibold font-mono text-xs">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="text-xs">{ticket.customer}</TableCell>
                    <TableCell className="text-xs max-w-xs truncate">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "default"
                            : ticket.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          ticket.status === "open"
                            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20 capitalize font-semibold tracking-wide"
                            : ticket.status === "pending"
                            ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20 capitalize font-semibold tracking-wide"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 capitalize font-semibold tracking-wide"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === "high"
                            ? "destructive"
                            : "outline"
                        }
                        className="capitalize font-semibold tracking-wide"
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ticket.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full size-8"
                      >
                        <IconExternalLink className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 mt-auto py-6 text-center text-muted-foreground text-2xs">
        <span>Cyberify AI Support Desk built by Ahmad Siddique</span>
      </footer>
    </div>
  )
}
