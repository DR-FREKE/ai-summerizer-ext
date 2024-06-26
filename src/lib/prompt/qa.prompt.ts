import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "@langchain/core/messages";
import type { OpenAIClient } from "@langchain/openai";

export const QA_TRANSCRIPT_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `You are the owner of a youtube video with its transcript helping subscribers understand a topic.
    there's a possibility that subscribers will have some questions regarding the video but you want 
    to be ahead of them and come up with the possible frequently asked questions.
    Here is the transcript of the video for your reference:
    {transcript}
    
    Generate at least five frequently asked questions in the context of the transcript 
    and give answers to the generated questions.
    Take a deep breath, and think through your reply carefully, step by step.`,
  ],
  ["human", "Transcript: {transcript}"],
]);

export const QA_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "questionAnswer",
    description: "generating question and answers for the transcript",
    parameters: {
      type: "object",
      properties: {
        question_answer: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: {
                type: "string",
              },
              answer: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

export const answerQuestionParser = (output: BaseMessageChunk): Array<{ question: string; answer: string }> => {
  const toolCalls = output.additional_kwargs.tool_calls;

  if (!toolCalls) {
    throw new Error("Missing 'tool_calls' in question_answer output");
  }

  const questions = toolCalls
    .map(calls => {
      const { question_answer } = JSON.parse(calls.function.arguments);
      return question_answer;
    })
    .flat();

  return questions;
};
