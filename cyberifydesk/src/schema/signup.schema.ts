import { z } from "zod"
import {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  otpSchema,
} from "./common.schema"

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    otp: otpSchema,
    organizationName: z
      .string()
      .min(2, { message: "Organization name must be at least 2 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>
