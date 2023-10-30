// app/api/chat/route.ts

import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const fireworks = new OpenAI({baseURL: 'https://api.fireworks.ai/inference/v1',apiKey: process.env.FIREWORKS_API_KEY!})

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Request the Fireworks API for the response based on the prompt
  const response = await fireworks.chat.completions.create({
    model: 'accounts/fireworks/models/mistral-7b-instruct-4k',
    stream: true,
    messages: messages,
    max_tokens: 1000,
    temperature: 0.75,
    top_p: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
