import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "@langchain/core/messages";
import { OpenAIClient } from "@langchain/openai";
import { transcript_example } from "./sample.transcript";

/** define a structure for how timestamp summary is going to appear */
export const INSIGHT_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "formatKeyInsight",
    description: "Format the key insight response",
    parameters: {
      type: "object",
      properties: {
        insights: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "The key insight summary",
                  },
                  icon: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      required: ["summaries"],
    },
  },
};

/** timestamp summary prompt */
export const INSIGHT_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `Give key insights of the following youtube video transcript.
    Identify the category this transcript can belong to.
    The goal is to be able to generate well detailed key insights of the transcript 
    after reading every lines of the transcript and identifying key points of the summary.
    Follow the format and style demonstrated below:

    example transcript: 
    ${transcript_example}

    generated insights:
    💡 Bend offers Hope by promising that everything that can run in parallel will run in parallel, without needing to know anything about Cuda, blocks, locks, mutexes, or regex's.
    🧙‍♂️ The language is described as "Magic" and is set to revolutionize the way we write code for GPUs.
    🤯 Your code running on a single thread is like going to a KFC with only one employee doing everything.
    🤯 The promise of Bend is a language that just knows how to run things in parallel by default, revolutionizing GPU programming.
    🤯 The concept of interaction combinators and parallel computation is mind-bending and could revolutionize GPU programming.
    🌟 The language's ability to execute code sequentially using the rust interpreter opens up new possibilities for GPU programming.
    🤯 Bend has something entirely different called a fold that works like a search and replace for data types and any algorithm that requires a loop can be replaced with a fold.

    Rules:
    - Highlight key ideas and include specific quotes in your detailed summary.
    - Respond with as many key insights as it might take to cover the entire transcript.
    - Go into as much detail as you can, while keeping each key insight on a very specific part of the transcript.
    - For every new paragraph of a new summary, include the right icons for your summary.
    - DO NOT respond with key insights like: "The host introduces XYZ." or "The video introduces XYZ" or "The video discusses" or "The video opens by XYZ", instead explain XYZ and how it works or behave.
    - DO NOT make it "what they were talking about" instead fine grain it to match another individual's opinion.

    Respond with a JSON object with two keys: "name", and "points".
    "name" will always default to "Key Insights" except if you can come up with the right name for it (name should be very brief if you decide to generate one), "points" will be a JSON array with two keys: "title" and "icon".
    In the points array, "title" will be the specific key insight you generated, and "icon" will be the generated icon.
    Take a deep breath, and work your way through the transcript step by step.`,
  ],
  ["human", "Transcript: {transcript}"],
]);

export type KeyInsightType = {
  name: string;
  points: {
    title: string;
    icon: string;
  };
};

/** use the structure you defined earlier to generate a fine output */
export const insightOutputParser = (output: BaseMessageChunk): Array<KeyInsightType> => {
  const toolCalls = output.additional_kwargs.tool_calls;
  if (!toolCalls || toolCalls.length == 0) {
    throw new Error("No tool calls");
  }

  const summaries: Array<KeyInsightType> = toolCalls
    .map(call => {
      const { insights } = JSON.parse(call.function.arguments);
      return insights;
    })
    .flat();

  return summaries;
};
