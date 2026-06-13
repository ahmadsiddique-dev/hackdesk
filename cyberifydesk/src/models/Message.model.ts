import mongoose, { Schema, Document } from "mongoose"

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId
  senderId?: mongoose.Types.ObjectId | null 
  senderType: "user" | "agent" | "ai"
  message: string
  createdAt: Date
}
const MessageSchema: Schema = new Schema<IMessage>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true, 
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    senderType: {
      type: String,
      enum: ["user", "agent", "ai"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)