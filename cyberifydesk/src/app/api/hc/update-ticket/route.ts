import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnection"
import { Ticket } from "@/models/Ticket.model"

export async function PATCH(request: NextRequest) {
  await dbConnect()

  const { id, title, description, priority } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "Ticket ID is required." }, { status: 400 })
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    id,
    { title, description, priority },
    { new: true }
  )

  if (!updatedTicket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 })
  }

  return NextResponse.json(
    { message: "Ticket updated successfully.", ticket: updatedTicket },
    { status: 200 }
  )
}
