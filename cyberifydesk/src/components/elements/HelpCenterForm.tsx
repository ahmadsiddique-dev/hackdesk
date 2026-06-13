"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconUser,
  IconMail,
  IconSend,
  IconLoader2,
  IconCircleCheck,
} from "@tabler/icons-react"

export function HelpCenterForm() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    priority: "medium",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
          <IconCircleCheck className="size-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Ticket Submitted</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your support request has been received. We will get back to you shortly.
        </p>
        <Button
          onClick={() => {
            setSuccess(false)
            setFormData({
              name: "",
              email: "",
              subject: "",
              priority: "medium",
              description: "",
            })
          }}
          className="mt-6 rounded-full border border-border/80 bg-background hover:bg-muted text-xs font-semibold px-6 py-2"
          variant="outline"
        >
          Submit Another Ticket
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="hc-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
              <IconUser className="size-4" />
            </span>
            <input
              id="hc-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/40 bg-background/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="hc-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
              <IconMail className="size-4" />
            </span>
            <input
              id="hc-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/40 bg-background/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="hc-subject" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Subject
          </label>
          <input
            id="hc-subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="What issue are you experiencing?"
            className="w-full px-4 py-3 rounded-xl border border-border/40 bg-background/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="hc-priority" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Priority
          </label>
          <select
            id="hc-priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border/40 bg-background/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="hc-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Description
        </label>
        <textarea
          id="hc-desc"
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please describe your problem in detail..."
          className="w-full px-4 py-3 rounded-xl border border-border/40 bg-background/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-muted-foreground/60 resize-y"
        />
      </div>

      <Button
        id="hc-submit-btn"
        type="submit"
        disabled={loading}
        className="w-full mt-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 py-6 font-semibold text-white shadow-lg shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400 transition-all"
      >
        {loading ? (
          <>
            <IconLoader2 className="size-4 animate-spin mr-2" />
            <span>Submitting Ticket...</span>
          </>
        ) : (
          <>
            <IconSend className="size-4 mr-2" />
            <span>Submit Ticket</span>
          </>
        )}
      </Button>
    </form>
  )
}
