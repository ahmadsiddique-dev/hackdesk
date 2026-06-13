import { z } from "zod"
import { emailSchema, passwordSchema, otpSchema } from "./common.schema"

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
})

export type SignInFormValues = z.infer<typeof signInSchema>
