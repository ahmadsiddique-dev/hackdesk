"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schema/forgot-password.schema"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/apiClient"
import axios from "axios"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  IconMail,
  IconLock,
  IconCircleCheck,
  IconLoader2,
  IconCheck,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { AuthLayout } from "@/components/elements/AuthLayout"

export default function Page() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [success, setSuccess] = React.useState(false)

  const {
    loading: requestOtpLoading,
    error: requestOtpError,
    execute: executeRequestOtp,
  } = useApi(
    React.useCallback(
      (payload: { email: string }) =>
        axios
          .post("/api/auth/forgot-password/new", payload)
          .then((res) => res.data),
      []
    )
  )

  const {
    loading: verifyOtpLoading,
    error: verifyOtpError,
    execute: executeVerifyOtp,
  } = useApi(
    React.useCallback(
      (payload: { email: string; otp: string }) =>
        axios
          .post("/api/auth/forgot-password/verify", payload)
          .then((res) => res.data),
      []
    )
  )

  const {
    loading: resetPasswordLoading,
    error: resetPasswordError,
    execute: executeResetPassword,
  } = useApi(
    React.useCallback(
      (payload: { email: string; password: string }) =>
        axios
          .patch("/api/auth/forgot-password/new", payload)
          .then((res) => res.data),
      []
    )
  )

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema as any) as any,
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      const isValid = await trigger("email")
      if (isValid) {
        const values = control._formValues
        const res = await executeRequestOtp({ email: values.email })
        if (res && res.success) {
          setCurrentStep(2)
        }
      }
    } else if (currentStep === 2) {
      const isValid = await trigger("otp")
      if (isValid) {
        const values = control._formValues
        const res = await executeVerifyOtp({
          email: values.email,
          otp: values.otp,
        })
        if (res && res.success) {
          setCurrentStep(3)
        }
      }
    }
  }

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const res = await executeResetPassword({
      email: data.email,
      password: data.password,
    })
    if (res && res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/signin")
      }, 1000)
    }
  }

  const activeError = requestOtpError || verifyOtpError || resetPasswordError
  const isSubmitting =
    requestOtpLoading || verifyOtpLoading || resetPasswordLoading

  return (
    <AuthLayout backLink="/signin" backText="Back to Sign In">
      <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src="https://assets.hackclub.com/flag-standalone.svg"
            alt="HackDesk Logo"
            className="mb-4 h-10 object-contain"
          />
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Recover your HackDesk account password
          </p>
        </div>

        {!success && (
          <div className="mx-auto mb-8 w-full max-w-xs select-none">
            <div className="relative flex w-full items-center justify-between">
              <div className="absolute top-3.5 right-6 left-6 z-0 h-0.5 -translate-y-1/2">
                <div className="h-full w-full bg-border" />
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-500"
                  style={{
                    width:
                      currentStep === 1
                        ? "0%"
                        : currentStep === 2
                          ? "50%"
                          : "100%",
                  }}
                />
              </div>

              <div className="relative z-10 flex w-12 flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border bg-background text-xs transition-all duration-300",
                    currentStep > 1
                      ? "border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20"
                      : currentStep === 1
                        ? "border-red-500 font-bold text-red-500 ring-2 ring-red-500/20"
                        : "border-border text-muted-foreground"
                  )}
                >
                  {currentStep > 1 ? <IconCheck className="size-4" /> : "1"}
                </div>
                <span
                  className={cn(
                    "text-2xs absolute top-8 font-semibold whitespace-nowrap transition-colors duration-300",
                    currentStep >= 1
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Email
                </span>
              </div>

              <div className="relative z-10 flex w-12 flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border bg-background text-xs transition-all duration-300",
                    currentStep > 2
                      ? "border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20"
                      : currentStep === 2
                        ? "border-red-500 font-bold text-red-500 ring-2 ring-red-500/20"
                        : "border-border text-muted-foreground"
                  )}
                >
                  {currentStep > 2 ? <IconCheck className="size-4" /> : "2"}
                </div>
                <span
                  className={cn(
                    "text-2xs absolute top-8 font-semibold whitespace-nowrap transition-colors duration-300",
                    currentStep >= 2
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Verify
                </span>
              </div>

              <div className="relative z-10 flex w-12 flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border bg-background text-xs transition-all duration-300",
                    currentStep === 3
                      ? "border-red-500 font-bold text-red-500 ring-2 ring-red-500/20"
                      : "border-border text-muted-foreground"
                  )}
                >
                  3
                </div>
                <span
                  className={cn(
                    "text-2xs absolute top-8 font-semibold whitespace-nowrap transition-colors duration-300",
                    currentStep === 3
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  New Password
                </span>
              </div>
            </div>
            <div className="h-10" />
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <IconCircleCheck className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Password Reset Successfully
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Your password has been updated. Redirecting to the Sign In
                workspace...
              </p>
            </div>
            <IconLoader2 className="mt-2 size-5 animate-spin text-red-500" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FieldGroup className="gap-5">
              {currentStep === 1 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <IconMail className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                      />
                    </InputGroup>
                    <FieldDescription>
                      Enter the email address associated with your account.
                    </FieldDescription>
                    <FieldError>{errors.email?.message}</FieldError>
                  </Field>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.otp}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <FieldLabel htmlFor="otp">
                        6-Digit Verification Code (OTP)
                      </FieldLabel>
                    </div>
                    <Controller
                      control={control}
                      name="otp"
                      render={({ field }) => (
                        <div className="flex justify-center py-2">
                          <InputOTP
                            id="otp"
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={!!errors.otp}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      )}
                    />
                    <FieldDescription>
                      Enter the code sent to your email (check your spam/junk
                      folder if not found).
                    </FieldDescription>
                    <FieldError>{errors.otp?.message}</FieldError>
                  </Field>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <IconLock className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        aria-invalid={!!errors.password}
                      />
                    </InputGroup>
                    <FieldError>{errors.password?.message}</FieldError>
                  </Field>

                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm New Password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <IconLock className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        aria-invalid={!!errors.confirmPassword}
                      />
                    </InputGroup>
                    <FieldError>{errors.confirmPassword?.message}</FieldError>
                  </Field>
                </div>
              )}
            </FieldGroup>

            {activeError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                {activeError}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="rounded-full border-border/80 px-5 font-semibold"
                >
                  <IconChevronLeft className="mr-1 size-4" />
                  <span>Back</span>
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="grow rounded-full bg-linear-to-r from-red-500 to-rose-600 py-5 font-semibold text-white shadow-md shadow-red-500/10 hover:from-red-600 hover:to-rose-700"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <IconChevronRight className="ml-1 size-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="grow rounded-full bg-linear-to-r from-red-500 to-rose-600 py-5 font-semibold text-white shadow-md shadow-red-500/10 hover:from-red-600 hover:to-rose-700"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
