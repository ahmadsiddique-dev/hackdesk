import { z } from "zod"
import { emailSchema, passwordSchema, otpSchema } from "./common.schema"

export const customerSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema.optional().or(z.literal("")),
})

export type CustomerSignInFormValues = z.infer<typeof customerSignInSchema>
