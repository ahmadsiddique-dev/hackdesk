import dbConnect from "@/lib/dbConnection"
import { User } from "@/models/User.model"
import { NextResponse } from "next/server"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"

export const POST = catchAsyncRoute(async (request: Request) => {
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

  return NextResponse.json({
    success: true,
    message: "OTP verified successfully",
  })
})
