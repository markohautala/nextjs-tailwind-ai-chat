import { Configuration, OpenAIApi } from "openai-edge";
import { createStreamableValue } from "ai/rsc";
import { StreamingTextResponse } from "ai";

// provides optimal infrastructure for api routes
export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// Import the necessary functions from the API in localhost3000/api/chat
export async function POST(request: Request) {
  const { messages } = await request.json();

  // get the response from the AI

  // create a stream of data from the AI

  // send the stream of data to the client/frontend
}