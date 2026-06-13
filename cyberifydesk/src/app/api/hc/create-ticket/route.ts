// make a basic post request

import { NextRequest, NextResponse } from "next/server"
import { Ticket } from "@/models/Ticket.model"

export async function POST(request: NextRequest) {
  const {
    title,
    description, 
    priority, 
    customerId, 
    organization
  } =
    await request.json();
    
    [title, description, priority, customerId, organization].forEach((field) => {
    if (!field) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }
  })

  const ticket = new Ticket({
    title,
    description,
    priority,
    customer: customerId,
    organization,
  })
  await ticket.save()

  return NextResponse.json(
    { message: "Ticket created successfully." },
    { status: 201 }
  )
}
