import dbConnect from "@/lib/dbConnection"
import { User } from "@/models/User.model"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { catchAsyncRoute } from "@/lib/catchAsyncRoute"

export const POST = catchAsyncRoute(async (request: Request) => {
  await dbConnect()

  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid token format" },
      { status: 401 }
    )
  }

  const accessToken = authHeader.split(" ")[1]

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value || cookieStore.get("customerRefreshToken")?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Unauthorized: Missing refresh token" },
      { status: 401 }
    )
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || "access_token_agar_na_mila"
  const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || "refresh_token_agar_na_mila"

  try {
    const decodedAccess = jwt.verify(accessToken, accessTokenSecret) as {
      _id: string
      email: string
      fullName: string
      role: string
    }

    if (decodedAccess.role !== "agent" && decodedAccess.role !== "user") {
      return NextResponse.json(
        { error: "Access denied. Invalid role." },
        { status: 403 }
      )
    }

    const user = await User.findById(decodedAccess._id)
    if (!user || (user.role !== "agent" && user.role !== "user")) {
      return NextResponse.json(
        { error: "Access denied. User not found or incorrect role." },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organization: user.organization,
      },
    })
  } catch (err: any) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          refreshTokenSecret
        ) as {
          _id: string
        }

        const user = await User.findById(decodedRefresh._id)
        if (!user || user.refreshToken !== refreshToken || (user.role !== "agent" && user.role !== "user")) {
          return NextResponse.json(
            { error: "Session expired. Please sign in again." },
            { status: 401 }
          )
        }

        const newAccessToken = user.generateAccessToken()
        const newRefreshToken = user.generateRefreshToken()

        user.refreshToken = newRefreshToken
        await user.save()

        cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })

        return NextResponse.json({
          success: true,
          accessToken: newAccessToken,
          user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            organization: user.organization,
          },
        })
      } catch (refreshErr) {
        return NextResponse.json(
          { error: "Session expired. Please sign in again." },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: "Unauthorized: Token verification failed" },
      { status: 401 }
    )
  }
})
