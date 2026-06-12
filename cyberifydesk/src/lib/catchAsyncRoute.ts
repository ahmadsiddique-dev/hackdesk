import { NextResponse } from "next/server"

export function catchAsyncRoute(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error("API Route Error Details:", error)
      const message =
        error instanceof Error ? error.message : "Internal Server Error"
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}
