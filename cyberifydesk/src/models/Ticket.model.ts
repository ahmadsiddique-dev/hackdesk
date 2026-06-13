import mongoose, { Schema, Document } from "mongoose"

export interface ITicket extends Document {
  title: string
  priority: "low" | "medium" | "high"
  description: string
  status: "open" | "close" | "pending"
  customer: mongoose.Types.ObjectId
  organization: string,
  summary?: string,
  solution?: string,
  rootCause?: string,
  createdAt: Date
  updatedAt: Date
}

const TicketSchema: Schema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "close", "pending"],
      default: "open",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    solution: {
      type: String,
    },
    rootCause: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema)
