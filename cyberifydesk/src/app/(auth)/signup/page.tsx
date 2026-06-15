"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpFormValues } from "@/schema/signup.schema"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"
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
  IconUser,
  IconCircleCheck,
  IconLoader2,
  IconCheck,
  IconBuilding,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react"
import { cn, slugify } from "@/lib/utils"
import { AuthLayout } from "@/components/elements/AuthLayout"

export default function Page() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()
  const setAuth = useUserStore((state) => state.setAuth)
  const user = useUserStore((state) => state.user)
  const {
    loading: apiLoading,
    error: apiError,
    execute,
  } = useApi(
    React.useCallback(
      (
        payload: Omit<SignUpFormValues, "otp" | "confirmPassword"> & {
          role: string
          otp?: string
        }
      ) => api.post("/api/auth/agent/signup", payload).then((res) => res.data),
      []
    )
  )

  const {
    loading: verifyLoading,
    error: verifyError,
    execute: verifyExecute,
    data: verifyData,
  } = useApi(
    React.useCallback(
      (payload: { email: string; otp: string }) =>
        api.patch("/api/auth/agent/signup", payload).then((res) => res.data),
      []
    )
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema as any) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      organizationName: "",
    },
  })

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      const isValid = await trigger([
        "name",
        "email",
        "password",
        "confirmPassword",
        "organizationName",
      ])
      if (isValid) {
        const values = control._formValues
        const res = await execute({
          name: values.name,
          email: values.email,
          password: values.password,
          organizationName: values.organizationName,
          role: "agent",
        })
        if (res && res.success) {
          setCurrentStep(2)
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

  React.useEffect(() => {
    if (success) {
      const orgSlug = user?.organization
        ? slugify(user.organization)
        : "default"
      const timer = setTimeout(() => {
        router.push(`/${orgSlug}/dashboard`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, router, user?.organization])

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Submitting data:", data)
    const { email, otp } = data
    const res = await verifyExecute({ email, otp })

    if (res && res.success) {
      setAuth(res.accessToken, res.user)
      setSuccess(true)
    }
  }

  return (
    <AuthLayout backLink="/" backText="Back to Home">
      <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Cyberify Desk Logo"
            width={40}
            height={40}
            className="mb-4 size-10 object-contain"
          />
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Get started with Cyberify Desk today
          </p>
        </div>

        {!success && (
          <div className="mx-auto mb-8 w-full max-w-xs select-none">
            <div className="relative flex w-full items-center justify-between">
              <div className="absolute top-3.5 right-6 left-6 z-0 h-0.5 -translate-y-1/2">
                <div className="h-full w-full bg-border" />
                <div
                  className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: currentStep === 1 ? "0%" : "100%",
                  }}
                />
              </div>

              <div className="relative z-10 flex w-12 flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border bg-background text-xs transition-all duration-300",
                    currentStep > 1
                      ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "border-orange-500 font-bold text-orange-500 ring-2 ring-orange-500/20"
                  )}
                >
                  {currentStep > 1 ? <IconCheck className="size-4" /> : "1"}
                </div>
                <span
                  className={cn(
                    "text-2xs absolute top-8 font-semibold whitespace-nowrap transition-colors duration-300",
                    "text-foreground"
                  )}
                >
                  Details
                </span>
              </div>

              <div className="relative z-10 flex w-12 flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border bg-background text-xs transition-all duration-300",
                    currentStep === 2
                      ? "border-orange-500 font-bold text-orange-500 ring-2 ring-orange-500/20"
                      : "border-border text-muted-foreground"
                  )}
                >
                  2
                </div>
                <span
                  className={cn(
                    "text-2xs absolute top-8 font-semibold whitespace-nowrap transition-colors duration-300",
                    currentStep === 2
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Verify
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
                Registration Successful
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Welcome onboard! Your workspace is being configured. Redirecting
                to your workspace...
              </p>
            </div>
            <IconLoader2 className="mt-2 size-5 animate-spin text-orange-500" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FieldGroup className="gap-5">
              {currentStep === 1 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <IconUser className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        aria-invalid={!!errors.name}
                      />
                    </InputGroup>
                    <FieldError>{errors.name?.message}</FieldError>
                  </Field>

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
                    <FieldError>{errors.email?.message}</FieldError>
                  </Field>

                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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
                      Confirm Password
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

                  <Field data-invalid={!!errors.organizationName}>
                    <FieldLabel htmlFor="organizationName">
                      Organization Name
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <IconBuilding className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="organizationName"
                        type="text"
                        placeholder="Cyberify AI"
                        {...register("organizationName")}
                        aria-invalid={!!errors.organizationName}
                      />
                    </InputGroup>
                    <FieldError>{errors.organizationName?.message}</FieldError>
                  </Field>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.otp}>
                    <FieldLabel htmlFor="otp">
                      6-Digit Verification Code (OTP)
                    </FieldLabel>
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
            </FieldGroup>

            {apiError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                {apiError}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="rounded-full border-border/80 px-5 font-semibold"
                >
                  <IconChevronLeft className="mr-1 size-4" />
                  <span>Back</span>
                </Button>
              )}

              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={apiLoading}
                  className="grow rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-5 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
                >
                  {apiLoading ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      <span>Sending OTP...</span>
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
                  disabled={apiLoading}
                  className="grow rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-5 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
                >
                  {apiLoading ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      <span>Creating Space...</span>
                    </>
                  ) : (
                    <span>Complete Setup</span>
                  )}
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          <span>Already have an account? </span>
          <Link
            href="/signin"
            className="font-semibold text-orange-500 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
