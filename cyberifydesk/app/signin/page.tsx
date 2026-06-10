"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton
} from "@/components/ui/input-group"
import {
  IconMail,
  IconLock,
  IconArrowLeft,
  IconSparkles,
  IconSun,
  IconMoon,
  IconCircleCheck,
  IconLoader2
} from "@tabler/icons-react"

export default function Page() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [generatedOtp, setGeneratedOtp] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [loginSuccess, setLoginSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema as any) as any,
    defaultValues: {
      email: "",
      password: "",
      otp: ""
    }
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleGenerateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setValue("otp", code, { shouldValidate: true })
  }

  const onSubmit = (data: SignInFormValues) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setLoginSuccess(true)
    }, 1500)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col justify-center items-center px-4 selection:bg-primary/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/4 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[150px] dark:bg-orange-600/15" />
        <div className="absolute top-[-100px] right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] dark:bg-amber-500/15" />
      </div>

      <header className="absolute top-0 w-full max-w-7xl h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <IconArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-muted"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <IconSun className="size-5 text-yellow-400" />
            ) : (
              <IconMoon className="size-5 text-orange-950" />
            )}
          </Button>
        )}
      </header>

      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-8 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20 mb-4">
            <IconSparkles className="size-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your Cyberify Desk helpdesk
          </p>
        </div>

        {loginSuccess ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <IconCircleCheck className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Workspace Authenticated</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Verification succeeded. Redirecting to Ahmad Siddique&apos;s workspace...
              </p>
            </div>
            <IconLoader2 className="size-5 animate-spin text-orange-500 mt-2" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FieldGroup className="gap-5">
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
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="/forgot-password" className="text-2xs text-orange-500 hover:underline">
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

              <Field data-invalid={!!errors.otp}>
                <FieldLabel htmlFor="otp">6-Digit Verification Code (OTP)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    {...register("otp")}
                    aria-invalid={!!errors.otp}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="secondary"
                      size="xs"
                      onClick={handleGenerateOtp}
                      className="rounded px-2.5 py-1 bg-orange-600/10 text-orange-500 hover:bg-orange-600/20 font-semibold"
                    >
                      Generate
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Click Generate to receive a mock verification code for testing.
                </FieldDescription>
                <FieldError>{errors.otp?.message}</FieldError>
              </Field>

              {generatedOtp && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-500 flex items-center gap-2">
                  <IconCircleCheck className="size-4 shrink-0" />
                  <span>
                    Mock OTP generated: <strong className="font-mono tracking-widest">{generatedOtp}</strong> (Auto-filled)
                  </span>
                </div>
              )}
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 rounded-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold shadow-md shadow-orange-500/10 py-5"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  <span>Verifying Workspace...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border/40 pt-6">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-orange-500 font-semibold hover:underline">
            Get Started
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center text-2xs text-muted-foreground py-6">
        <span>Cyberify AI Support Desk built by Ahmad Siddique</span>
      </footer>

      {/* TODO: Connect sign-in verification payload to session endpoint */}
      {/* TODO: Replace mock OTP generation with actual SMS/email authentication service */}
    </div>
  )
}