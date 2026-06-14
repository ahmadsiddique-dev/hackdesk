"use server"

import dbConnect from "@/lib/dbConnection"
import { Ticket } from "@/models/Ticket.model"

export async function fetchTickets(organizationId: string) {
  await dbConnect()

  const data = await Ticket.find(
    { organization: organizationId },
    { _id: 1, customer: 1, title: 1, status: 1, priority: 1, createdAt: 1 }
  )
  .populate("customer", "fullName -_id") 
  .lean()

  const result = data.map(ticket => ({
  ...ticket,
  customer: ticket.customer?.fullName || ""
}));

  return result
}

// Ya mangta ham ko
// {
//       id: "TC-3024",
//       customer: "Alex Rivera",
//       subject: "Cannot access workspace API",
//       status: "open",
//       priority: "high",
//       date: "2 hours ago",
//     },