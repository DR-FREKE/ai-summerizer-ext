"use server";

import { type TranscriptResponse } from "youtube-transcript";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { type ChatPromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings, OpenAI, ChatOpenAI, type OpenAIClient } from "@langchain/openai";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { TIMESTAMP_PROMPT, TIMESTAMP_TOOL_SCHEMA, TimestampSummaryType, outputParser } from "@/lib/prompt/timestamp.prompt";
import { INSIGHT_PROMPT, INSIGHT_TOOL_SCHEMA, KeyInsightType, insightOutputParser } from "@/lib/prompt/insight.prompt";
import { SUMMARY_PROMPT, SUMMARY_TOOL_SCHEMA, SummaryType, summaryOutputParser } from "@/lib/prompt/summary.prompt";

const openAIApiKey = process.env.OPENAI_API_KEY; // api key for openai

export const addFormattedTranscript = async (transcript: TranscriptResponse[], video_id: string) => {
  const transcript_texts = transcript.map(item => item.text).join(" "); // get the texts in the transcript array
  // run query
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });
  const chunks = await splitter.createDocuments([transcript_texts]);

  // let currentTime = 0.0;

  // const output = chunks.map(chunk => {
  //   const startTime: number = currentTime;
  //   currentTime += chunk.pageContent.split(" ").length * (transcript.reduce((acc, segment) => acc + segment.duration, 0) / transcript_texts.split(" ").length);
  //   return { ...chunk, startTime };
  // });

  const document_as_string = formatDocumentsAsString(chunks);

  const vector_store = PrismaVectorStore.withModel(prisma).create(new OpenAIEmbeddings({ openAIApiKey }), {
    prisma: Prisma,
    tableName: "Transcripts",
    vectorColumnName: "vector",
    columns: { id: PrismaVectorStore.IdColumn, content: PrismaVectorStore.ContentColumn },
  });

  const documents = chunks.map(chunk => ({
    content: chunk.pageContent,
    metadata: chunk.metadata,
    video_id,
  }));

  await vector_store.addModels(await prisma.$transaction(documents.map(doc => prisma.transcripts.create({ data: doc }))));
};

interface ConfigInterface {
  tool: OpenAIClient.ChatCompletionTool;
  prompt: ChatPromptTemplate;
  parser: any;
}

export const queryGPT = async <T>(transcript: TranscriptResponse[], type: string, configs: ConfigInterface): Promise<Array<T>> => {
  const transcript_texts = transcript.map(item => `${item.offset} ${item.text}`).join(" "); // get the texts in the transcript array

  /** run chat gpt query */
  const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0.9,
    openAIApiKey,
  });

  let modelWithTool;

  // const config = type_template[type as keyof typeof type_template];

  modelWithTool = model.bind({
    tools: [configs.tool],
  });

  // const type_prompt = PromptTemplate.fromTemplate(type_template[type as keyof typeof type_template]);
  const chain = configs.prompt.pipe(modelWithTool).pipe(configs.parser); // use model or if you setup modelWithTool, use that instead

  const res = await chain.invoke({ transcript: transcript_texts });
  return res as T[];
};

export const runGTP = async (transcript: TranscriptResponse[]) => {
  if (transcript && transcript.length !== 0) {
    // run query for timestamp summary
    const timestamp_config = { tool: TIMESTAMP_TOOL_SCHEMA, prompt: TIMESTAMP_PROMPT, parser: outputParser }; // config tools
    const timestamp_summary = await queryGPT(transcript, "timestamp_summary", timestamp_config);

    const insight_config = { tool: INSIGHT_TOOL_SCHEMA, prompt: INSIGHT_PROMPT, parser: insightOutputParser };
    const insight = await queryGPT<KeyInsightType>(transcript, "insights", insight_config);

    const summary_config = { tool: SUMMARY_TOOL_SCHEMA, prompt: SUMMARY_PROMPT, parser: summaryOutputParser };
    const summary = await queryGPT<SummaryType>(transcript, "summary", summary_config);

    return { ...summary[0], timestamp_summary, insights: insight[0] };
  }

  throw new Error("Transcript is empty");
};
