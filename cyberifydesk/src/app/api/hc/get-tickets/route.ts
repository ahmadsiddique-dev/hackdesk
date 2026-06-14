import { NextRequest } from "next/server"
import dbConnect from "@/lib/dbConnection"
import { Ticket } from "@/models/Ticket.model"

export async function GET(request: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const customer = searchParams.get("customer")
  const organization = searchParams.get("organization")

  if (!customer || !organization) {
    return Response.json({ error: "Customer and organization are required." }, { status: 400 })
  }

  const tickets = await Ticket.find(
    { customer, organization },
    { _id: 1, title: 1, priority: 1, description: 1, status: 1, createdAt: 1 }
  ).sort({ createdAt: -1 })

  if (!tickets) {
    return Response.json({ error: "No tickets found for this customer." }, { status: 404 })
  }

  return Response.json({ message: "Tickets retrieved successfully.", tickets }, { status: 200 })
}
