import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Add the system message to ensure simplicity and conciseness
  const systemMessage = {
    role: 'system',
    content: `Always explain things really simply, like to a 15-year-old or a beginner, in no more than 500 characters. If code is requested, provide the code in code-format. If asked to explain, divide the code into sections and explain interchangeably with explanations suitable for total beginners, in a manner that combines code-bits and explanations on new lines.`,
  };

  // Include the system message in the messages array
  const updatedMessages = [systemMessage, ...messages];

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: updatedMessages,
  });

  return result.toAIStreamResponse();
}
