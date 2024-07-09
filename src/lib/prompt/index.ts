import { BaseMessageChunk } from "@langchain/core/messages";

export * from "./timestamp.prompt";

/** use the structure you defined earlier to generate a fine output */
export const outputParser = (type?: string) => (output: BaseMessageChunk) => {
  const toolCalls = output.additional_kwargs.tool_calls || [];
  if (!toolCalls || toolCalls.length == 0) {
    throw new Error(`error occured getting ${type}`);
  }

  const summaries = toolCalls
    .map(call => {
      const summary = JSON.parse(call.function.arguments);
      return type ? summary[type] : summary;
    })
    .flat();

  return summaries;
};
