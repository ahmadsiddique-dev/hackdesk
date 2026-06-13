import { z } from "zod"
import {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  otpSchema,
} from "./common.schema"

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
