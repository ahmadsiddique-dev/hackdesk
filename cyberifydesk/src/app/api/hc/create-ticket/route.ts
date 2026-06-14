// make a basic post request

import { NextRequest, NextResponse } from "next/server"
import { ITicket, Ticket } from "@/models/Ticket.model"
import { generateText, Output } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import dbConnect from "@/lib/dbConnection"
import { prompt as SystemPrompt } from "@/prompts/ticket_generation_prompt"
import z from "zod"

async function createGoogleAI({prompt}: {prompt: string}) {
    const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  })
  const { text } = await generateText({
    model: google('gemini-3-flash-preview'),
    prompt: prompt,
    system: SystemPrompt,
    output: Output.object({
      schema: z.object({
        summary: z.string(),
        solution: z.string(),
        rootCause: z.string(),
      })
    })
  })

  return text;
}

export async function POST(request: NextRequest) {
  await dbConnect();
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

  const aiResponse = await createGoogleAI({
    prompt: `Title: ${title}
    Description: ${description}`
  })

  const { summary, solution, rootCause } = await JSON.parse(aiResponse)

  const ticket = new Ticket({
    title,
    description,
    priority,
    customer: customerId,
    organization,
    summary,
    solution,
    rootCause
  })
  await ticket.save()

  return NextResponse.json(
    { message: "Ticket created successfully." },
    { status: 201 }
  )
}
