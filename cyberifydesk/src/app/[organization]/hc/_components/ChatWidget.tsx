"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconMessageCircle,
  IconX,
  IconSend,
  IconLoader,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: string
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "initial",
      text: "Hello! Welcome to Cyberify Desk Live Support. How can we help you today?",
      sender: "agent",
      timestamp: "Just now",
    },
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInput("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1800))

    const mockResponses = [
      "Thanks for reaching out! One of our agents will review your message shortly.",
      "We've logged your query. Can you please tell us if you've already created a ticket for this issue?",
      "I appreciate your patience. Our agents are currently assisting other users, but someone will reply to you as soon as they become free.",
      "Got it. Please feel free to describe any error codes or share details here while we connect you to an expert.",
    ]

    const agentMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      sender: "agent",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, agentMsg])
    setIsTyping(false)
  }

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <Button
        id="chat-bubble-btn"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-xl hover:from-orange-500 hover:to-amber-400 hover:scale-105 transition-all duration-300",
          open && "rotate-90 scale-90"
        )}
      >
        {open ? <IconX className="size-6" /> : <IconMessageCircle className="size-6" />}
      </Button>

      {open && (
        <div
          id="chat-window"
          className="absolute bottom-16 right-0 w-80 sm:w-96 h-112.5 flex flex-col rounded-2xl border border-border/40 bg-card/95 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-linear-to-r from-orange-600/10 to-amber-500/10 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Cyberify Desk Support</span>
                <span className="text-[10px] text-muted-foreground">Agents are active</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconX className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full scrollbar-thin [scrollbar-color:rgba(0,0,0,0.1)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.1)_transparent]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[80%] rounded-2xl px-3 py-2 text-xs",
                  msg.sender === "user"
                    ? "self-end bg-orange-600/90 text-white rounded-tr-none"
                    : "self-start bg-muted/80 text-foreground rounded-tl-none border border-border/40"
                )}
              >
                <span>{msg.text}</span>
                <span
                  className={cn(
                    "text-[8px] mt-1 self-end",
                    msg.sender === "user" ? "text-orange-100" : "text-muted-foreground"
                  )}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="self-start flex items-center gap-1.5 rounded-2xl px-3 py-2 text-2xs bg-muted/80 text-muted-foreground rounded-tl-none border border-border/40 animate-pulse">
                <IconLoader className="size-3.5 animate-spin" />
                <span>Agent is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 border-t border-border/40 flex items-center gap-2"
          >
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask us a question..."
              className="flex-1 px-3 py-2 rounded-lg border border-border/40 bg-background/50 text-xs focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60"
            />
            <Button
              type="submit"
              size="icon"
              className="size-8 rounded-lg bg-linear-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400"
            >
              <IconSend className="size-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
