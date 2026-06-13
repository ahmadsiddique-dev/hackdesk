import mongoose from "mongoose"
import { catchAsync } from "@/hooks/catchAsync"

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

const connect = async () => {
  const db = await mongoose.connect(`${process.env.MONGODB_URI}/cyberifydesk`)
  console.log("Database connected successfully") // TODO: remove this log
  return db.connections[0].readyState
}

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return
  }

  const { data, error } = await catchAsync(connect)()
  if (error) {
    process.exit(1)
  }
  if (data !== null) {
    connection.isConnected = data
  }
}