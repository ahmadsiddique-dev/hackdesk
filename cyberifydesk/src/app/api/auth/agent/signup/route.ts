// TODO: Error handling and edge cases ( OTP expiration, rate limiting, and if not verified email can be used by anyone else )

import dbConnect from "@/hooks/dbConnection"
import { Signup } from "@/schemas/Signup.schema"
import { hashPassword } from "@/lib/bcrypt"
import { sendOtpEmail } from "@/lib/sendEmail"
import { NextResponse } from "next/server"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"

export const POST = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const { name, email, password, organizationName, role } =
    await request.json()

  if (!name || !email || !password || !organizationName || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }


  const userExist = await Signup.findOne({ email })

  if (userExist) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    )
  }
  const hashedPassword = await hashPassword(password)
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

  const user = new Signup({
    fullName: name,
    email: email,
    password: hashedPassword,
    organization: organizationName,
    role: role || "agent",
    otp: generatedOtp,
  })

  await user.save()

  await sendOtpEmail(email, name, generatedOtp)

  return NextResponse.json({
    success: true,
    message: "OTP sent to your email",
  })
  
})

export const PATCH = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const { email, otp } = await request.json()

  if (!email || !otp) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const user = await Signup.findOne({ email })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  if (user.otp !== otp) {
    return NextResponse.json(
      { error: "Invalid OTP" },
      { status: 400 }
    )
  }

  user.otp = null
  user.isVerified = true
  await user.save()

  return NextResponse.json({
    success: true,
    message: "Email verified successfully",
  })
})