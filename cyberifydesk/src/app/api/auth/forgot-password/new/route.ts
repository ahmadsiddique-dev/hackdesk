import dbConnect from "@/lib/dbConnection"
import { User } from "@/models/User.model"
import { sendOtpEmail } from "@/lib/sendEmail"
import { NextResponse } from "next/server"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"

export const POST = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
  user.otp = generatedOtp
  await user.save()

  await sendOtpEmail(email, user.fullName, generatedOtp)

  return NextResponse.json({
    success: true,
    message: "OTP sent to your email",
  })
})

export const PATCH = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  user.password = password
  user.otp = null
  await user.save()

  return NextResponse.json({
    success: true,
    message: "Password reset successfully",
  })
})
