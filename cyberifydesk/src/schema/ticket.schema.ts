import { z } from "zod"

export const ticketSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

export type TicketFormValues = z.infer<typeof ticketSchema>
