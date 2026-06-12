import mongoose, { Schema, Document } from "mongoose"

export interface ISignup extends Document {
  fullName: string
  email: string
  password: string
  isVerified: boolean
  organization?: string | null
  role: "user" | "agent"
  otp?: string | null
}

const SignupSchema: Schema = new Schema<ISignup>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true    
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const Signup =
  mongoose.models.Signup || mongoose.model<ISignup>("Signup", SignupSchema)
