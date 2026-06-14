'use server'

import dbConnect from "@/lib/dbConnection"
import { Ticket } from "@/models/Ticket.model"

export default async function fetchStats(organizationId: string) {
  await dbConnect()

  const totalTickets = await Ticket.find({ organization: organizationId }, { _id: 0, status: 1 }).lean()
  
  return totalTickets
}

