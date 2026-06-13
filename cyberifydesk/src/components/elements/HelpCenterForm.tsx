"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  IconSend,
  IconLoader2,
  IconCircleCheck,
} from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ticketSchema, type TicketFormValues } from "@/lib/validations/auth"

export function HelpCenterForm() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

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

  const onSubmit = async (data: TicketFormValues) => {
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
            reset()
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldGroup className="gap-5">
        <div className="grid gap-5 md:grid-cols-3">
          <Field className="md:col-span-2" data-invalid={!!errors.title}>
            <FieldLabel htmlFor="hc-title">Title</FieldLabel>
            <Input
              id="hc-title"
              type="text"
              placeholder="What issue are you experiencing?"
              className="text-xs h-9 dark:bg-input/30"
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="hc-priority"
                    className="w-full text-xs h-9 dark:bg-input/30"
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
            className="text-xs min-h-24 dark:bg-input/30"
            {...register("description")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button
        id="hc-submit-btn"
        type="submit"
        disabled={loading}
        className="w-full mt-2 rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-4 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400 text-xs h-9"
      >
        {loading ? (
          <>
            <IconLoader2 className="size-4 animate-spin mr-1.5" />
            <span>Submitting Ticket...</span>
          </>
        ) : (
          <>
            <IconSend className="size-4 mr-1.5" />
            <span>Submit Ticket</span>
          </>
        )}
      </Button>
    </form>
  )
}



