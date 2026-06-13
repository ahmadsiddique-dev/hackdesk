import { z } from "zod"

export const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" })

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })

export const otpSchema = z
  .string()
  .length(6, { message: "OTP must be exactly 6 digits" })
  .regex(/^\d+$/, { message: "OTP must contain only digits" })

export const confirmPasswordSchema = z
  .string()
  .min(1, { message: "Confirm password is required" })
