"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInFormValues } from "@/schema/signin.schema"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
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
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react"
import { cn, slugify } from "@/lib/utils"
import { AuthLayout } from "@/components/elements/AuthLayout"

export default function Page() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loginSuccess, setLoginSuccess] = React.useState(false)
  const [generatedOtp, setGeneratedOtp] = React.useState("")
  const router = useRouter()
  const setAuth = useUserStore((state) => state.setAuth)
  const user = useUserStore((state) => state.user)

  const {
    loading: apiLoading,
    error: apiError,
    execute: executeSignIn,
  } = useApi(
    React.useCallback(
      (payload: { email: string; password: string }) =>
        api.post("/api/auth/agent/signin", payload).then((res) => res.data),
      []
    )
  )

  const {
    loading: verifyLoading,
    error: verifyError,
    execute: executeVerifyOtp,
  } = useApi(
    React.useCallback(
      (payload: { email: string; otp: string }) =>
        api.patch("/api/auth/agent/signin", payload).then((res) => res.data),
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
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema as any) as any,
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  })

  React.useEffect(() => {
    if (loginSuccess) {
      const orgSlug = user?.organization ? slugify(user.organization) : "default"
      const timer = setTimeout(() => {
        router.push(`/${orgSlug}/dashboard`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loginSuccess, router, user?.organization])

  const handleGenerateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setValue("otp", code, { shouldValidate: true })
  }

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      const isValid = await trigger(["email", "password"])
      if (isValid) {
        const values = control._formValues
        const res = await executeSignIn({
          email: values.email,
          password: values.password,
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

  const onSubmit = async (data: SignInFormValues) => {
    const res = await executeVerifyOtp({
      email: data.email,
      otp: data.otp,
    })
    if (res && res.success) {
      setAuth(res.accessToken, res.user)
      setLoginSuccess(true)
    }
  }

  const activeError = apiError || verifyError
  const isSubmitting = apiLoading || verifyLoading

  return (
    <AuthLayout backLink="/" backText="Back to Home">
      <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Cyberify Desk Logo"
            width={40}
            height={40}
            className="mb-4 size-10 object-contain"
          />
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your Cyberify Desk helpdesk
          </p>
        </div>

        {loginSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <IconCircleCheck className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Workspace Authenticated
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Verification succeeded. Redirecting to your workspace...
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
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-2xs text-orange-500 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
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
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex animate-in flex-col gap-5 duration-300 fade-in slide-in-from-bottom-2">
                  <Field data-invalid={!!errors.otp}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <FieldLabel htmlFor="otp">
                        6-Digit Verification Code (OTP)
                      </FieldLabel>
                      <button
                        type="button"
                        onClick={handleGenerateOtp}
                        className="text-2xs font-semibold text-orange-500 hover:underline"
                      >
                        Generate OTP
                      </button>
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
                      Enter the verification code. You can click Generate OTP for a
                      mock code.
                    </FieldDescription>
                    <FieldError>{errors.otp?.message}</FieldError>
                  </Field>

                  {generatedOtp && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-500">
                      <IconCircleCheck className="size-4 shrink-0" />
                      <span>
                        Mock OTP generated:{" "}
                        <strong className="font-mono tracking-widest">
                          {generatedOtp}
                        </strong>{" "}
                        (Auto-filled)
                      </span>
                    </div>
                  )}
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

              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="grow rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-5 font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
                >
                  {verifyLoading ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="font-semibold text-orange-500 hover:underline"
          >
            Get Started
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
