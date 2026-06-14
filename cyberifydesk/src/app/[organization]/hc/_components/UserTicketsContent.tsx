"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { UserAuth } from "./UserAuth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatDate"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { IconPlus, IconExternalLink, IconTicket, IconDots, IconPencil, IconTrash } from "@tabler/icons-react"
import { EditTicketForm } from "./EditTicketForm"
import { useApi } from "@/hooks/apiClient"
import axios from "axios"


interface UserTicketsContentProps {
  organizationName: string
}

export function UserTicketsContent({
  organizationName,
}: UserTicketsContentProps) {
  const accessToken = useCustomerStore((state) => state.accessToken)
  const [editingTicket, setEditingTicket] = React.useState<any | null>(null)
  const user = useCustomerStore((state) => state.user)
  const [mounted, setMounted] = React.useState(false)

  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.organization as string

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: ticketData, error: ticketError, execute: ticketExecute, loading: ticketLoading } = useApi(
    React.useCallback(
      (payload: { customer: string; organization: string }) =>
        axios.get("/api/hc/get-tickets", { params: payload }).then((res) => res.data.tickets),
      []
    )
  )

  const isAuthenticated = !!accessToken && !!user?._id

  React.useEffect(() => {
    if (!isAuthenticated || !user?._id || !orgSlug) return
    ticketExecute({ customer: user._id, organization: orgSlug })
  }, [isAuthenticated, user?._id, orgSlug])

  if (!mounted) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <UserAuth organizationName={organizationName} />
  }

  return (
    <div className="flex animate-in flex-col gap-6 rounded-2xl border border-border/40 bg-card/30 p-6 shadow-xl backdrop-blur-md duration-300 fade-in slide-in-from-bottom-3 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <IconTicket className="size-5 text-orange-500" />
            <span>My Support Tickets</span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Track the progress and details of your submitted requests.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/${orgSlug}/hc`)}
          className="h-9 rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
        >
          <IconPlus className="mr-1.5 size-4" />
          <span>New Ticket</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="w-25 text-xs font-semibold text-foreground">
                Ticket ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-foreground">
                Subject
              </TableHead>
              <TableHead className="w-30 text-xs font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="w-30 text-xs font-semibold text-foreground">
                Priority
              </TableHead>
              <TableHead className="w-30 text-xs font-semibold text-foreground">
                Created
              </TableHead>
              <TableHead className="w-20 text-xs font-semibold text-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketData?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-xs text-muted-foreground"
                >
                  No tickets found. Submit a ticket to get support.
                </TableCell>
              </TableRow>
            ) : (
              ticketData?.map((ticket: any) => (
                <TableRow
                  key={ticket._id}
                  className="border-b border-border/20 transition-colors hover:bg-muted/10"
                >
                  <TableCell className="font-mono align-top text-xs font-semibold text-orange-500">
                    #{ticket._id}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-semibold text-foreground">
                      {ticket.title}
                    </div>
                    <div className="text-2xs mt-1 max-w-md truncate text-muted-foreground">
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
                          ? "text-3xs rounded-full border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold tracking-wide text-amber-500 capitalize hover:bg-amber-500/10"
                          : ticket.status === "pending"
                            ? "text-3xs rounded-full border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-semibold tracking-wide text-blue-500 capitalize hover:bg-blue-500/10"
                            : "text-3xs rounded-full border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-semibold tracking-wide text-emerald-500 capitalize hover:bg-emerald-500/10"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.priority === "high" ? "destructive" : "outline"
                      }
                      className={
                        ticket.priority === "high"
                          ? "text-3xs rounded-full border-destructive/20 bg-destructive/10 px-2 py-0.5 font-semibold tracking-wide text-destructive capitalize"
                          : ticket.priority === "medium"
                            ? "text-3xs rounded-full border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold tracking-wide text-amber-500 capitalize"
                            : "text-3xs rounded-full border-border/40 bg-muted px-2 py-0.5 font-semibold tracking-wide text-muted-foreground capitalize"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full hover:bg-muted"
                        >
                          <IconDots className="size-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-1.5 flex flex-col rounded-xl border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTicket(ticket)}
                          className="w-full justify-between text-2xs h-8 px-2.5 rounded-lg text-foreground hover:bg-muted/60 font-semibold"
                        >
                          <span>Edit</span>
                          <IconPencil className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-2xs h-8 px-2.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold"
                        >
                          <span>Delete</span>
                          <IconTrash className="size-3.5" />
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!editingTicket} onOpenChange={(open) => { if (!open) setEditingTicket(null) }}>
        <SheetContent side="right" className="w-[400px] sm:max-w-md p-6 bg-card border-l border-border/40 text-foreground flex flex-col gap-6">
          <SheetHeader className="p-0 flex flex-col gap-1.5">
            <SheetTitle className="text-lg font-bold text-foreground">Edit Ticket</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Make changes to your support ticket details below.
            </SheetDescription>
          </SheetHeader>
          {editingTicket && (
            <EditTicketForm
              ticket={editingTicket}
              onClose={() => setEditingTicket(null)}
              onSuccess={() => {
                setEditingTicket(null)
                if (user?._id && orgSlug) {
                  ticketExecute({ customer: user._id, organization: orgSlug })
                }
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
