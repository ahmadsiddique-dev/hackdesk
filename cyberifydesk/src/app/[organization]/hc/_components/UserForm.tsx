"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IconSend, IconLoader2, IconCircleCheck } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ticketSchema, type TicketFormValues } from "@/schema/ticket.schema"
import { useCustomerStore } from "@/store/customer"
import { useApi } from "@/hooks/apiClient"
import axios from "axios"
import Link from "next/link"

type TicketPayloadType = {
  customerId: string
  organization: string | null | undefined
  description: string
  title: string
  priority: "low" | "medium" | "high"
}
export function UserForm() {
  const customer = useCustomerStore((state) => state.user)
  const organization = useCustomerStore((state) => state.user?.organization)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      description: "",
    },
  })

  const {
    data: ticketData,
    error: ticketError,
    execute: ticketExecute,
    loading: ticketLoading,
  } = useApi(
    React.useCallback(
      (payload: TicketPayloadType) =>
        axios.post("/api/hc/create-ticket", payload),
      []
    )
  )

  const onSubmit = async (data: TicketFormValues) => {
    const payload = {
      ...data,
      customerId: customer?._id,
      organization: organization,
    }
    await ticketExecute(payload)
  }

  if (ticketData) {
    return (
      <div className="flex animate-in flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-12 text-center duration-300 fade-in zoom-in">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <IconCircleCheck className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Ticket Submitted
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your support request has been received. We will get back to you
          shortly.
        </p>
        <div className="flex gap-3">
          <Link href={`/${organization}/hc/tickets`}>
            <Button
              className="mt-6 rounded-full border border-border/80 bg-background px-6 py-2 text-xs font-semibold hover:bg-muted"
              variant="secondary"
            >
              Manage Ticket
            </Button>
          </Link>
          <Link href={`/${organization}/hc/new-ticket`}>
          
          </Link>
          <Button
            onClick={() => {
              reset()
            }}
            className="mt-6 rounded-full border border-border/80 bg-background px-6 py-2 text-xs font-semibold hover:bg-muted"
            variant="outline"
          >
            Submit Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldGroup className="gap-5">
        <div className="grid gap-5 md:grid-cols-3">
          <Field className="md:col-span-2" data-invalid={!!errors.title}>
            <FieldLabel htmlFor="hc-title">Title</FieldLabel>
            <Input
              id="hc-title"
              type="text"
              placeholder="What issue are you experiencing?"
              className="h-9 text-xs dark:bg-input/30"
              {...register("title")}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.priority}>
            <FieldLabel htmlFor="hc-priority">Priority</FieldLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="hc-priority"
                    className="h-9 w-full text-xs dark:bg-input/30"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.priority?.message}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="hc-desc">Description</FieldLabel>
          <Textarea
            id="hc-desc"
            rows={5}
            placeholder="Please describe your problem in detail..."
            className="min-h-24 text-xs dark:bg-input/30"
            {...register("description")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button
        id="hc-submit-btn"
        type="submit"
        disabled={ticketLoading}
        className="mt-2 h-9 w-full rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-4 text-xs font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
      >
        {ticketLoading ? (
          <>
            <IconLoader2 className="mr-1.5 size-4 animate-spin" />
            <span>Submitting Ticket...</span>
          </>
        ) : (
          <>
            <IconSend className="mr-1.5 size-4" />
            <span>Submit Ticket</span>
          </>
        )}
      </Button>
    </form>
  )
}
