"use client"

import * as React from "react"
import { useCustomerStore } from "@/store/customer"
import { UserAuth } from "./UserAuth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatDate"
import { useApi } from "@/hooks/apiClient"
import axios from "axios"
import {
  IconArrowLeft,
  IconSend,
  IconLoader,
  IconMessageCircle,
  IconUser,
  IconHeadset,
  IconCalendar,
  IconAlertCircle
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TicketChatContentProps {
  organizationName: string
  ticketId: string
}

interface MockMessage {
  _id: string
  ticketId: string
  senderType: "user" | "agent" | "ai"
  message: string
  createdAt: Date
}

export function TicketChatContent({
  organizationName,
  ticketId,
}: TicketChatContentProps) {
  const accessToken = useCustomerStore((state) => state.accessToken)
  const user = useCustomerStore((state) => state.user)
  const [mounted, setMounted] = React.useState(false)
  const [messages, setMessages] = React.useState<MockMessage[]>([])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.organization as string

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [input, adjustHeight])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: ticketData, execute: ticketExecute, loading: ticketLoading } = useApi(
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

  const ticket = React.useMemo(() => {
    if (!ticketData) return null
    return ticketData.find((t: any) => t._id === ticketId)
  }, [ticketData, ticketId])

  React.useEffect(() => {
    if (!ticket) return
    setMessages([
      {
        _id: "init-1",
        ticketId,
        senderType: "user",
        message: ticket.description || "No description provided.",
        createdAt: new Date(new Date(ticket.createdAt).getTime() - 600000),
      },
      {
        _id: "init-2",
        ticketId,
        senderType: "agent",
        message: `Hello! An agent has been assigned to your ticket "${ticket.title}". How can we help you today?`,
        createdAt: new Date(ticket.createdAt),
      }
    ])
  }, [ticket, ticketId])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

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

  if (ticketLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 gap-4 rounded-2xl border border-border/40 bg-card/30 p-8 text-center backdrop-blur-md">
        <IconAlertCircle className="size-12 text-destructive animate-pulse" />
        <h3 className="text-lg font-bold text-foreground">Ticket Not Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          We couldn't find the ticket you are looking for. It may have been deleted or belong to another customer.
        </p>
        <Button
          onClick={() => router.push(`/${orgSlug}/hc/tickets`)}
          variant="outline"
          className="rounded-full px-5 text-xs font-semibold"
        >
          Back to Tickets
        </Button>
      </div>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: MockMessage = {
      _id: Date.now().toString(),
      ticketId,
      senderType: "user",
      message: input.trim(),
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1800))

    const mockResponses = [
      "I am analyzing the details of this request. Could you please provide any logs or screenshots if available?",
      "Thank you for the update. I have logged this to our backend and marked it for high priority support.",
      "An support agent has been assigned to investigate your ticket. They will respond here shortly.",
      "Understood. We are looking into this issue and will update the status of the ticket as soon as we make progress.",
    ]

    const agentMsg: MockMessage = {
      _id: (Date.now() + 1).toString(),
      ticketId,
      senderType: "agent",
      message: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, agentMsg])
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col gap-6 animate-in duration-300 fade-in slide-in-from-bottom-3">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col h-[520px] gap-5 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="flex items-center gap-2 pb-4 border-b border-border/20">
            <Button
              onClick={() => router.push(`/${orgSlug}/hc/tickets`)}
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-muted border border-border/20 text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
            </Button>
            <Badge className="font-mono text-[9.5px] border-orange-500/20 bg-orange-500/10 text-orange-500 rounded-full hover:bg-orange-500/10 px-2 py-0.5 h-5 flex items-center whitespace-nowrap shrink-0">
              #{ticket._id}
            </Badge>
          </div>

          <div className="flex flex-col gap-3.5 text-2xs mt-1 flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Status</span>
              <span className="font-bold text-orange-500 capitalize">{ticket.status}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Priority</span>
              <span className="font-bold text-orange-500 capitalize">{ticket.priority}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <IconCalendar className="size-3.5" />
                <span>Submitted</span>
              </span>
              <span className="text-foreground font-semibold">{formatDate(ticket.createdAt)}</span>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-border/20 pt-3 flex-1 overflow-hidden">
              <span className="text-muted-foreground font-semibold">Description</span>
              <div className="text-foreground bg-muted/20 border border-border/10 p-2.5 rounded-lg leading-relaxed wrap-break-word whitespace-pre-wrap flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full text-xs">
                {ticket.description}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col h-[520px] rounded-2xl border border-border/40 bg-card/30 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/40 bg-linear-to-r from-orange-600/5 to-amber-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconMessageCircle className="size-4.5 text-orange-500" />
              <span className="text-xs font-bold text-foreground">Chat</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-xl font-bold text-foreground/5 tracking-wider uppercase">
                Ai is not in this Chat
              </span>
            </div>
            {messages.map((msg) => {
              const isUser = msg.senderType === "user"
              return (
                <div
                  key={msg._id}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm z-10",
                    isUser
                      ? "self-end bg-orange-600/90 text-white rounded-tr-none"
                      : "self-start bg-muted/80 text-foreground border border-border/40 rounded-tl-none"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75 font-semibold">
                    {isUser ? (
                      <>
                        <IconUser className="size-3" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <IconHeadset className="size-3 text-orange-500" />
                        <span className="text-orange-500">Agent</span>
                      </>
                    )}
                  </div>
                  <span className="whitespace-pre-wrap wrap-break-word">{msg.message}</span>
                  <span
                    className={cn(
                      "text-[9px] mt-1.5 self-end opacity-60 font-mono"
                    )}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}

            {isTyping && (
              <div className="self-start flex items-center gap-1.5 rounded-2xl px-4 py-3 text-2xs bg-muted/80 text-muted-foreground rounded-tl-none border border-border/40 animate-pulse z-10">
                <IconLoader className="size-3.5 animate-spin" />
                <span>Support team is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border/40 bg-card/40 flex items-end gap-3"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              rows={1}
              placeholder="Write a message regarding this ticket..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border/40 bg-background/50 text-xs focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60 resize-none max-h-36 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full"
            />
            <Button
              type="submit"
              size="icon"
              className="size-9 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-500/10"
            >
              <IconSend className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
