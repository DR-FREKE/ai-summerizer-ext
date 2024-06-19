"use server";

import { type TranscriptResponse } from "youtube-transcript";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { type ChatPromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings, OpenAI, ChatOpenAI, type OpenAIClient } from "@langchain/openai";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { TIMESTAMP_PROMPT, TIMESTAMP_TOOL_SCHEMA, TimestampSummaryType, outputParser as timestampOutputParser } from "@/lib/prompt/timestamp.prompt";
import { INSIGHT_PROMPT, INSIGHT_TOOL_SCHEMA, KeyInsightType, insightOutputParser } from "@/lib/prompt/insight.prompt";
import { SUMMARY_PROMPT, SUMMARY_TOOL_SCHEMA, SummaryType, summaryOutputParser } from "@/lib/prompt/summary.prompt";
import { outputParser } from "@/lib/prompt";

const openAIApiKey = process.env.OPENAI_API_KEY; // api key for openai

// function to add formatted transcript to the database
export const addFormattedTranscript = async (transcript: TranscriptResponse[], video_id: string) => {
  const transcript_texts = transcript.map(item => item.text).join(" "); // get the texts in the transcript array

  // split transcript to chunks
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

  // create vector store
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

  // add document to database
  await vector_store.addModels(await prisma.$transaction(documents.map(doc => prisma.transcripts.create({ data: doc }))));
};

interface ConfigInterface {
  tool: OpenAIClient.ChatCompletionTool;
  prompt: ChatPromptTemplate;
  parser_type?: string;
  parser?: any;
}

/** NOTE: the config file allows you to pass a custom outputParser else it will use the default outputParser.
 * Now depending on how your schema tool was structure, the config file also let's you pass a string that gets the exact data you want...
 * this string act as the parent key to your data when it is returned.
 * If you had multiple sub keys and you don't wish to get all of them by calling the parent key (the string you passed)
 * it's advisable to create your custom outputParser and in that outputParser,
 * you can get any of the sub keys you wish to return. */

/** function to query chatGPT */
export const queryGPT = async <T>(transcript: TranscriptResponse[], configs: ConfigInterface): Promise<Array<T>> => {
  const transcript_texts = transcript.map(item => `${item.offset} ${item.text}`).join(" "); // get the texts in the transcript array

  /** run chat gpt query by first initializing gpt model */
  const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0.9,
    openAIApiKey,
  });

  // const config = type_template[type as keyof typeof type_template];

  // bind tool to model
  const modelWithTool = model.bind({
    tools: [configs.tool],
  });

  // const type_prompt = PromptTemplate.fromTemplate(type_template[type as keyof typeof type_template]);
  const chain = configs.prompt.pipe(modelWithTool).pipe(configs.parser || outputParser(configs.parser_type)); // use model or if you setup modelWithTool, use that instead to create a chain with prompt and the parser

  const res = await chain.invoke({ transcript: transcript_texts });
  return res as T[];
};

export const runGTP = async (transcript: TranscriptResponse[]) => {
  if (transcript && transcript.length !== 0) {
    // run query for timestamp summary
    const timestamp_config = { tool: TIMESTAMP_TOOL_SCHEMA, prompt: TIMESTAMP_PROMPT, parser_type: "timestamp_summary" }; // config tools
    const timestamp_summary = await queryGPT(transcript, timestamp_config);

    const insight_config = { tool: INSIGHT_TOOL_SCHEMA, prompt: INSIGHT_PROMPT, parser_type: "insights" };
    const insight = await queryGPT<KeyInsightType>(transcript, insight_config);

    const summary_config = { tool: SUMMARY_TOOL_SCHEMA, prompt: SUMMARY_PROMPT, parser: summaryOutputParser };
    const summary = await queryGPT<SummaryType>(transcript, summary_config);

    return { ...summary[0], timestamp_summary, insights: insight[0] };
  }

  throw new Error("Transcript is empty");
};
