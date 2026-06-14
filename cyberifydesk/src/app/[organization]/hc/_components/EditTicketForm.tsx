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
import { IconLoader2 } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ticketSchema, type TicketFormValues } from "@/schema/ticket.schema"
import { useApi } from "@/hooks/apiClient"
import axios from "axios"

interface EditTicketFormProps {
  ticket: {
    _id: string
    title: string
    priority: "low" | "medium" | "high"
    description: string
  }
  onClose: () => void
  onSuccess: () => void
}

export function EditTicketForm({ ticket, onClose, onSuccess }: EditTicketFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket.title,
      priority: ticket.priority,
      description: ticket.description,
    },
  })

  const { execute: updateExecute, loading: updateLoading, error: updateError } = useApi(
    React.useCallback(
      (payload: { id: string; title: string; priority: string; description: string }) =>
        axios.patch("/api/hc/update-ticket", payload),
      []
    )
  )

  const onSubmit = async (data: TicketFormValues) => {
    const res = await updateExecute({
      id: ticket._id,
      ...data,
    })
    if (res) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 h-full">
      <FieldGroup className="gap-5">
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="edit-title">Title</FieldLabel>
          <Input
            id="edit-title"
            type="text"
            className="h-9 text-xs dark:bg-input/30"
            {...register("title")}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.priority}>
          <FieldLabel htmlFor="edit-priority">Priority</FieldLabel>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="edit-priority"
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

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="edit-desc">Description</FieldLabel>
          <Textarea
            id="edit-desc"
            rows={8}
            className="min-h-32 text-xs dark:bg-input/30"
            {...register("description")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      {updateError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-2.5 text-2xs text-destructive">
          {updateError}
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-6 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-full px-5 text-xs font-semibold h-9"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateLoading}
          className="grow rounded-full bg-linear-to-r from-orange-600 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400 text-xs h-9"
        >
          {updateLoading ? (
            <>
              <IconLoader2 className="size-4 animate-spin mr-1.5" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </Button>
      </div>
    </form>
  )
}
