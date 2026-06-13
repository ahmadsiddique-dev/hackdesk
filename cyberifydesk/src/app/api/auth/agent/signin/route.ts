import dbConnect from "@/lib/dbConnection"
import { sendOtpEmail } from "@/lib/sendEmail"
import { User } from "@/models/User.model"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  console.log("Received SignIn Request", { email, password })
  await dbConnect()

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    )
  }

  const user = await User.findOne({ email })

  console.log("User Found", user)
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    )
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { success: false, message: "Agent not verified" },
      { status: 400 }
    )
  }

  const isMatch = await user.isPasswordCorrect(password)

  console.log("Password Match", isMatch)
  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    )
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

  user.otp = generatedOtp
  await user.save()

  await sendOtpEmail(user.email, user.fullName, generatedOtp)

  console.log("Generated OTP", generatedOtp)
  return NextResponse.json({
    success: true,
    message: "OTP sent to your email",
    otp: generatedOtp,
  })
}

export async function PATCH(request: Request) {
  const { email, otp } = await request.json()

  await dbConnect()

  if (!email || !otp) {
    return NextResponse.json(
      { success: false, message: "Email and OTP are required" },
      { status: 400 }
    )
  }

  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or OTP" },
      { status: 401 }
    )
  }

  if (user.otp !== otp) {
    return NextResponse.json(
      { success: false, message: "Invalid email or OTP" },
      { status: 401 }
    )
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
    },
  })
}
