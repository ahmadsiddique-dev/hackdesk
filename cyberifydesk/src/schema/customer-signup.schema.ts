import { z } from "zod"
import {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  otpSchema,
} from "./common.schema"

export const customerSignUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    otp: otpSchema.optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CustomerSignUpFormValues = z.infer<typeof customerSignUpSchema>
