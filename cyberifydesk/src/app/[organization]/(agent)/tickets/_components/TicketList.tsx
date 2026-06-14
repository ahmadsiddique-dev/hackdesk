"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconSearch, IconAdjustmentsHorizontal, IconFlag, IconExternalLink } from "@tabler/icons-react"
import { formatDate } from '@/lib/formatDate'

export interface Ticket {
  _id: string
  customer: string
  title: string
  status: string
  priority: string
  createdAt: string
}

export function TicketList({ initialTickets }: { initialTickets: Ticket[] }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [priorityFilter, setPriorityFilter] = React.useState("all")

  const filteredTickets = initialTickets.filter((ticket) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = ticket.title.toLowerCase().includes(searchLower) || ticket._id.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative w-full md:w-64">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or ID..." 
              className="pl-9 bg-background/50 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-37.5 bg-background/50">
              <div className="flex items-center">
                <IconAdjustmentsHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-37.5 bg-background/50">
              <div className="flex items-center">
                <IconFlag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Priority" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
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
            {filteredTickets.map((ticket: Ticket) => (
              <TableRow
                key={ticket._id}
                className="border-b border-border/20 hover:bg-muted/10 transition-colors"
              >
                <TableCell className="font-semibold text-amber-500 font-mono text-xs">
                  #{ticket._id}
                </TableCell>
                <TableCell className="text-xs">{ticket.customer}</TableCell>
                <TableCell className="text-xs max-w-xs truncate">
                  {ticket.title}
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
                        ? "bg-amber-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20 capitalize font-semibold tracking-wide"
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
                  {formatDate(ticket.createdAt)}
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
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tickets found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
