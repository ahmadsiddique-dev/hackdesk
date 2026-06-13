"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { UserAuth } from "./UserAuth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconPlus, IconExternalLink, IconTicket } from "@tabler/icons-react"

interface UserTicketsContentProps {
  organizationName: string
}

export function UserTicketsContent({
  organizationName,
}: UserTicketsContentProps) {
  const accessToken = useCustomerStore((state) => state.accessToken)
  const user = useCustomerStore((state) => state.user)
  const [mounted, setMounted] = React.useState(false)

  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.organization as string

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

  const mockTickets = [
    {
      _id: "TC-5281",
      title: "Unable to access API endpoint from client integration",
      priority: "high" as const,
      description: "We are getting a 403 Forbidden error whenever we try to make an API request using the new client client-token. This is blocking our integration phase.",
      status: "open" as const,
      createdAt: "2 hours ago",
    },
    {
      _id: "TC-4927",
      title: "Payment processed but account is still on trial tier",
      priority: "medium" as const,
      description: "I upgraded to the Business tier and the invoice says paid, but our workspace limits and features still reflect the free/trial tier options.",
      status: "pending" as const,
      createdAt: "5 hours ago",
    },
    {
      _id: "TC-3819",
      title: "Requesting guidance on configuring customized agent webhook",
      priority: "low" as const,
      description: "Is there any detailed documentation on custom webhook endpoints? We need to map custom payloads to your internal CRM structure.",
      status: "close" as const,
      createdAt: "2 days ago",
    }
  ]

  return (
    <div className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <IconTicket className="size-5 text-orange-500" />
            <span>My Support Tickets</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Track the progress and details of your submitted requests.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/${orgSlug}/hc`)}
          className="rounded-full bg-linear-to-r from-orange-600 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400 text-xs px-4 h-9"
        >
          <IconPlus className="mr-1.5 size-4" />
          <span>New Ticket</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-foreground text-xs w-25">Ticket ID</TableHead>
              <TableHead className="font-semibold text-foreground text-xs">Subject</TableHead>
              <TableHead className="font-semibold text-foreground text-xs w-30">Status</TableHead>
              <TableHead className="font-semibold text-foreground text-xs w-30">Priority</TableHead>
              <TableHead className="font-semibold text-foreground text-xs w-30">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                  No tickets found. Submit a ticket to get support.
                </TableCell>
              </TableRow>
            ) : (
              mockTickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-semibold font-mono text-xs text-orange-500">
                    #{ticket._id}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-semibold text-foreground">{ticket.title}</div>
                    <div className="text-muted-foreground mt-1 max-w-md truncate text-2xs">
                      {ticket.description}
                    </div>
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
                          ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
                          : ticket.status === "pending"
                          ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
                          : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
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
                      className={
                        ticket.priority === "high"
                          ? "bg-destructive/10 text-destructive border-destructive/20 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
                          : ticket.priority === "medium"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
                          : "bg-muted text-muted-foreground border-border/40 capitalize font-semibold tracking-wide text-3xs px-2 py-0.5 rounded-full"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ticket.createdAt}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
