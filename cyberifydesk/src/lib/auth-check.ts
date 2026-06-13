import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import dbConnect from "./dbConnection"
import { User } from "@/models/User.model"
import { cache } from "react"

export const checkAgentAuth = cache(async () => {
  await dbConnect()

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    redirect("/signin")
  }

  const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || "refresh_token_agar_na_mila"

  let user = null
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as {
      _id: string
    }
    user = await User.findById(decoded._id)
  } catch (err) {
    redirect("/signin")
  }

  if (!user || user.refreshToken !== refreshToken || user.role !== "agent") {
    redirect("/signin")
  }

  return user
})

