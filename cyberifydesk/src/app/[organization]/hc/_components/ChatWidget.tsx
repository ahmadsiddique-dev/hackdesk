"use client"

import * as React from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
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
      text: "Hello! Welcome to HackDesk Help Center. How can we help you today?",
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

    const userQueryText = input.trim()
    const newMsg: Message = {
      id: Date.now().toString(),
      text: userQueryText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInput("")
    setIsTyping(true)

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DESKRAG_URI}/chat`, {
        params: { userQuery: userQueryText },
      })
      const replyText =
        res.data.result.text || "Sorry, I couldn't generate a response."
      const agentMsg: Message = {
        id: Date.now().toString(),
        text: replyText,
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, agentMsg])
    } catch (err) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: "Sorry, there was an error connecting to the support server.",
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="fixed right-6 bottom-6 z-50 font-sans">
      <Button
        id="chat-bubble-btn"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-linear-to-r from-red-500 to-rose-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-700",
          open && "scale-90 rotate-90"
        )}
      >
        {open ? (
          <IconX className="size-6" />
        ) : (
          <IconMessageCircle className="size-6" />
        )}
      </Button>

      {open && (
        <div
          id="chat-window"
          className="absolute right-0 bottom-16 flex h-112.5 w-80 animate-in flex-col rounded-2xl border border-border/40 bg-card/95 shadow-2xl backdrop-blur-md duration-300 slide-in-from-bottom-5 sm:w-96"
        >
          <div className="flex items-center justify-between rounded-t-2xl border-b border-border/40 bg-linear-to-r from-red-500/10 to-rose-600/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  HackDesk Support
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Agents are active
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconX className="size-4" />
            </button>
          </div>

          <div className="flex flex-1 scrollbar-thin [scrollbar-color:rgba(0,0,0,0.1)_transparent] flex-col gap-3 overflow-y-auto p-4 dark:[scrollbar-color:rgba(255,255,255,0.1)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-track]:bg-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex max-w-[80%] flex-col rounded-2xl px-3 py-2 text-xs",
                  msg.sender === "user"
                    ? "self-end rounded-tr-none bg-red-600/90 text-white"
                    : "self-start rounded-tl-none border border-border/40 bg-muted/80 text-foreground"
                )}
              >
                <div className="wrap-break-word">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="m-0" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <span
                  className={cn(
                    "mt-1 self-end text-[8px]",
                    msg.sender === "user"
                      ? "text-red-100"
                      : "text-muted-foreground"
                  )}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="text-2xs flex animate-pulse items-center gap-1.5 self-start rounded-2xl rounded-tl-none border border-border/40 bg-muted/80 px-3 py-2 text-muted-foreground">
                <IconLoader className="size-3.5 animate-spin" />
                <span>Generating response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-border/40 p-3"
          >
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask us a question..."
              className="flex-1 rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-xs transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
            />
            <Button
              type="submit"
              size="icon"
              className="size-8 rounded-lg bg-linear-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
            >
              <IconSend className="size-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
