// TODO: Error handling and edge cases ( OTP expiration, rate limiting, and if not verified email can be used by anyone else )

import dbConnect from "@/lib/dbConnection"
import { User } from "@/models/User.model"
import { sendOtpEmail } from "@/lib/sendEmail"
import { NextResponse } from "next/server"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"
import { cookies } from "next/headers"

export const POST = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const { name, email, password, organizationName, role } = await request.json()

  if (!name || !email || !password || !organizationName || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const userExist = await User.findOne({ email })

  if (userExist) {
    return NextResponse.json({ error: "Agent already exists" }, { status: 400 })
  }
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

  const modifiedOrganizationName = organizationName
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  const user = new User({
    fullName: name,
    email: email,
    password: password,
    organization: modifiedOrganizationName,
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

  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
  }

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.otp = null
  user.isVerified = true
  user.refreshToken = refreshToken
  await user.save()

  const cookieStore = await cookies()
  const cookieName = user.role === "agent" ? "refreshToken" : "customerRefreshToken"
  cookieStore.set(cookieName, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({
    success: true,
    message: "Email verified successfully",
    accessToken: accessToken,
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organization: user.organization,
    }
  })
})
