import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "@langchain/core/messages";
import { OpenAIClient } from "@langchain/openai";
import { transcript_example } from "./sample.transcript";

/** define a structure for how general summary and title is going to appear */
export const SUMMARY_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "formatSummary",
    description: "Format the general summary response",
    parameters: {
      type: "object",
      properties: {
        summary_data: {
          type: "object",
          properties: {
            summary: {
              type: "string",
            },
            general_topic: {
              type: "string",
            },
            category: {
              type: "string",
            },
          },
        },
      },
      required: ["summaries"],
    },
  },
};

export const SUMMARY_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `Take notes the following youtube transcript.
    Identify a general category this transcript can belong to.
    The goal is to give a short summary to the transcript, a befitting name for the transcript and categorize the transcript accordingly
    after reading every lines of the transcript.
    
    Rules:
    - Give a very short and precise summary of the transcript.
    - Summary shouldn't be more than a line.
    - Summerize the transcript like you wrote it yourself making it mostly your opinion.
    - Generate a typical category with a single word this transcript you've summerized can belong to.
    - Include a general but befitting name for your summerized transcript or the video.
    - The generated name should be SEO compatible, allowing me get the right result when I search for that name on youtube.
    - DO NOT respond with a summary like: "The transcript discusses XYZ." or "The presenter XYZ", instead explain what XYZ is and how it works.
    
    Respond with a JSON object with three keys: "summary", "general_topic" and "category".
    "summary" will be the specific summary you generated, general_topic will be the generated name and category will be the type of category this transcript falls into.
    Take a deep breath, and work your way through the transcript step by step.
    
    You can use the example below as a guide for the general name.

    example transcript: 
    ${transcript_example}

    generated name:
    Revolutionary GPU Programming Language: Bend
    `,
  ],
  ["human", "Transcript: {transcript}"],
]);

export type SummaryType = {
  summary: string;
  general_topic: string;
  category: string;
};

/** use the structure you defined earlier to generate a fine output */
export const summaryOutputParser = (output: BaseMessageChunk): Array<SummaryType> => {
  const toolCalls = output.additional_kwargs.tool_calls;
  if (!toolCalls || toolCalls.length == 0) {
    throw new Error("No tool calls");
  }

  const summaries: Array<SummaryType> = toolCalls
    .map(call => {
      const { summary_data } = JSON.parse(call.function.arguments);
      return summary_data;
    })
    .flat();

  return summaries;
};
