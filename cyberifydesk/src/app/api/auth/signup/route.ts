// TODO: Error handling and edge cases ( OTP expiration, rate limiting, and if not verified email can be used by anyone else )

// BTW FYI please go through this code keeping in mind both "Clinet" and "Agnet" signup
import dbConnect from "@/lib/dbConnection"
import { User } from "@/models/User.model"
import { sendOtpEmail } from "@/lib/sendEmail"
import { NextResponse } from "next/server"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"
import { cookies } from "next/headers"
import { slugify } from "@/lib/utils"

export interface ISignupResponse {
  name: string
  email: string
  password: string
  organizationName: string
  role: string
}

export const POST = catchAsyncRoute(async (request: Request) => {
  
  const { name, email, password, organizationName, role } = await request.json() as ISignupResponse // If we don't anotate it give error I don't know why
  
  [name, email, password, organizationName, role].forEach((field) => {
    if (!field) {
      return NextResponse.json({ error: "All Fields are required!" }, { status: 400 })
    }
  })
  
  await dbConnect()
  
  const userExist = await User.findOne({ email })


  // If User Exists but is unverified then this email can be used by someone else
  if (userExist) {
    if (userExist.isVerified) {
      return NextResponse.json({ error: "Agent already exists" }, { status: 400 })
    }
    await User.deleteOne({ email })
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

  const user = new User({
    fullName: name,
    email: email,
    password: password,
    organization: slugify(organizationName) ,
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

  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()

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
    maxAge: 60 * 60 * 24 * 7, //  Seven days is enough ig
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
