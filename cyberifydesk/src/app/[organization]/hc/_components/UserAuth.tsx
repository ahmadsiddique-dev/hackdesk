"use client"

import * as React from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCustomerStore } from "@/store/customer"
import { useApi } from "@/hooks/apiClient"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Field,
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
import { IconMail, IconLock, IconUser, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { customerSignInSchema } from "@/schema/customer-signin.schema"
import { customerSignUpSchema } from "@/schema/customer-signup.schema"

interface UserAuthProps {
  organizationName: string
}

interface CustomerAuthFormValues {
  name: string
  email: string
  password: string
  confirmPassword?: string
  otp: string
}

export function UserAuth({ organizationName }: UserAuthProps) {
  const [tab, setTab] = React.useState<"signin" | "signup">("signin")
  const [step, setStep] = React.useState<1 | 2>(1)
  const [errorMsg, setErrorMsg] = React.useState("")

  const setAuth = useCustomerStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
    reset,
  } = useForm<CustomerAuthFormValues>({
    resolver: zodResolver(
      (tab === "signin" ? customerSignInSchema : customerSignUpSchema) as any
    ) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
  })

  React.useEffect(() => {
    reset()
    setErrorMsg("")
  }, [tab, reset])

  const { loading: signinLoading, execute: executeSignIn } = useApi(
    React.useCallback(
      (payload: any) =>
        api
          .post("/api/auth/agent/signin", payload, {
            headers: { "X-Role": "customer" },
          })
          .then((res) => res.data),
      []
    )
  )

  const { loading: signupLoading, execute: executeSignUp } = useApi(
    React.useCallback(
      (payload: any) =>
        api
          .post("/api/auth/agent/signup", payload, {
            headers: { "X-Role": "customer" },
          })
          .then((res) => res.data),
      []
    )
  )

  const { loading: verifyLoading, execute: executeVerify } = useApi(
    React.useCallback(
      (url: string, payload: any) =>
        api
          .patch(url, payload, {
            headers: { "X-Role": "customer" },
          })
          .then((res) => res.data),
      []
    )
  )

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const fieldsToValidate =
      tab === "signin"
        ? (["email", "password"] as const)
        : (["name", "email", "password", "confirmPassword"] as const)

    const isValid = await trigger(fieldsToValidate)
    if (!isValid) return

    const values = control._formValues

    try {
      if (tab === "signin") {
        const res = await executeSignIn({
          email: values.email,
          password: values.password,
        })
        if (res && res.success) {
          setStep(2)
        } else {
          setErrorMsg(res?.message || "Invalid credentials")
        }
      } else {
        const res = await executeSignUp({
          name: values.name,
          email: values.email,
          password: values.password,
          organizationName,
          role: "user",
        })
        if (res && res.success) {
          setStep(2)
        } else {
          setErrorMsg(res?.message || "Registration failed")
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred")
    }
  }

  const onSubmit = async (data: CustomerAuthFormValues) => {
    setErrorMsg("")
    const url =
      tab === "signin" ? "/api/auth/agent/signin" : "/api/auth/agent/signup"
    try {
      const res = await executeVerify(url, {
        email: data.email,
        otp: data.otp,
      })
      if (res && res.success) {
        setAuth(res.accessToken, res.user)
      } else {
        setErrorMsg(res?.message || "Invalid verification code")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred")
    }
  }

  return (
    <div className="mx-auto w-full max-w-md animate-in rounded-2xl border border-border/40 bg-card/30 p-6 shadow-2xl backdrop-blur-md duration-300 fade-in zoom-in sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          {step === 1 ? "Customer Authentication" : "Verify Email"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {step === 1
            ? `Connect with ${organizationName} support portal`
            : "Enter the verification code sent to your email"}
        </p>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div className="flex rounded-lg border-b border-border/40 bg-muted/30 p-0.5">
            <button
              onClick={() => {
                setTab("signin")
              }}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-semibold transition-all",
                tab === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Have Account
            </button>
            <button
              onClick={() => {
                setTab("signup")
              }}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-semibold transition-all",
                tab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              New Account
            </button>
          </div>

          <form className="flex flex-col gap-4">
            {tab === "signup" && (
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <IconUser className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    className="h-9 py-2 text-xs"
                    {...register("name")}
                  />
                </InputGroup>
                <FieldError>{errors.name?.message}</FieldError>
              </Field>
            )}

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <IconMail className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-9 py-2 text-xs"
                  {...register("email")}
                />
              </InputGroup>
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {/* {tab === "signin" && (
                  <Link
                    href="/forgot-password"
                    className="text-2 font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )} */}
              </div>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <IconLock className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-9 py-2 text-xs"
                  {...register("password")}
                />
              </InputGroup>
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            {tab === "signup" && (
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <IconLock className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-9 py-2 text-xs"
                    {...register("confirmPassword")}
                  />
                </InputGroup>
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>
            )}

            {errorMsg && (
              <div className="text-2xs rounded-xl border border-destructive/20 bg-destructive/5 p-2.5 text-destructive">
                {errorMsg}
              </div>
            )}

            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={signinLoading || signupLoading}
              className="mt-2 h-9 rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-4 text-xs font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
            >
              {signinLoading || signupLoading ? (
                <>
                  <IconLoader2 className="mr-1.5 size-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Field data-invalid={!!errors.otp}>
            <div className="flex items-center justify-start">
              <FieldLabel htmlFor="otp">Verification Code (OTP)</FieldLabel>
            </div>
            <div className="flex justify-center py-2">
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="size-9 text-xs" />
                      <InputOTPSlot index={1} className="size-9 text-xs" />
                      <InputOTPSlot index={2} className="size-9 text-xs" />
                      <InputOTPSlot index={3} className="size-9 text-xs" />
                      <InputOTPSlot index={4} className="size-9 text-xs" />
                      <InputOTPSlot index={5} className="size-9 text-xs" />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            <FieldError>{errors.otp?.message}</FieldError>
            <FieldDescription className="text-3xs text-center">
              Enter the code sent to your email (check your spam/junk folder if
              not found).
            </FieldDescription>
          </Field>

          {errorMsg && (
            <div className="text-2xs rounded-xl border border-destructive/20 bg-destructive/5 p-2.5 text-destructive">
              {errorMsg}
            </div>
          )}

          <div className="mt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(1)
                setErrorMsg("")
              }}
              className="h-9 rounded-full border-border/80 px-4 text-xs font-semibold"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={verifyLoading}
              className="h-9 grow rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-4 text-xs font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-500 hover:to-amber-400"
            >
              {verifyLoading ? (
                <>
                  <IconLoader2 className="mr-1.5 size-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Sign In</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
