import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "@langchain/core/messages";
import { OpenAIClient } from "@langchain/openai";
import { transcript_example } from "./sample.transcript";

/** define a structure for how timestamp summary is going to appear */
export const TIMESTAMP_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "formatTimestamp",
    description: "Format the timestamp summary response",
    parameters: {
      type: "object",
      properties: {
        timestamp_summary: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key_ideas: {
                type: "string",
                description: "The timestamp summary",
              },
              icon: {
                type: "string",
              },
              tldr: {
                type: "string",
              },
              start_time: {
                type: "number",
              },
            },
          },
        },
      },
      required: ["timestamp_summary"],
    },
  },
};

/** timestamp summary prompt */
export const TIMESTAMP_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `Generate timestamp summary of the following youtube video transcript.
    Identify the category this transcript can belong to.
    The goal is to be able to generate a well detailed timestamp summary of the transcript 
    after reading every lines of the transcript also adding the time offset of the generated summary.
    Follow the format and style demonstrated below:

    example transcript: 
    ${transcript_example}

    generated timestamp summary:
    🚀 00:00 A new programming language promises parallel computing without needing to know about Cuda, blocks, locks, mutexes, or regex's.
    🚀 00:42 Write high-level python-like code and let the magic happen.
    💡 00:49 Your code runs on a single thread, but you can modify it to take advantage of multiple threads for increased performance, despite the added complexity and potential issues.
    💡 01:24 Bend is a new programming language for GPUs that runs things in parallel by default, simplifying complex computations.
    💡 01:52 Computation elements are structured into a graph called interaction combinators, which rewrite the computation in parallel and merge the results back into the function's expression.
    💡 02:21 A new programming language for GPUs, implemented in Rust with syntax similar to Python, has been developed to interface with the Hbm virtual machine.
    💡 02:47 Bend programming language uses folds instead of loops, allowing for parallel consumption of recursive data types, and can be used for algorithms that require loops.
    🚀 03:25 Running code on GPU with new programming language drastically reduces computation time, from 10 minutes on a single thread to 1.5 seconds on Nvidia RTX 490.

    Rules:
    - Highlight key ideas and include specific quotes in your detailed summary.
    - Respond with as many timestamp summary as it might take to cover the entire transcript, going through every line of the transcript.
    - Go into as much detail as you can, while keeping each timestamp summary on a very specific part of the transcript.
    - For every new paragraph of a new summary, always include the time offset of your summary.
    - For every new paragraph of a new summary, always include the right emoji for your summary.
    - Use befitting emojis that are easy to integrate to a frontend application.
    - DO NOT add the emoji and offset to the generated summary or tldr.
    - DO NOT respond with timestamp summary like: "The host introduces XYZ." or "The video discusses" or "The video opens by XYZ", instead explain XYZ and how it works.
    - DO NOT make it "what they were talking about" instead fine grain it.

    Respond with a JSON array with four keys: "key_ideas", "tldr", "start_time" and "icon".
    "key_ideas" will be an array of string that contains different key ideas you could get from the transcript, "tldr" will be the specific timestamp summary, "start_time" will be the offset time of your generated summary and "icon" will be your generated emoji or set it to an empty string.
    Take a deep breath, and work your way through the transcript step by step.`,
  ],
  ["human", "Transcript: {transcript}"],
]);

export type TimestampSummaryType = {
  key_ideas: string[];
  tldr: string;
  start_time: number;
  icon: string;
};

/** use the structure you defined earlier to generate a fine output */
export const outputParser = (output: BaseMessageChunk): Array<TimestampSummaryType> => {
  const toolCalls = output.additional_kwargs.tool_calls;
  if (!toolCalls || toolCalls.length == 0) {
    throw new Error("No tool calls");
  }

  const summaries = toolCalls
    .map(call => {
      const { timestamp_summary } = JSON.parse(call.function.arguments);
      return timestamp_summary;
    })
    .flat();

  return summaries;
};
