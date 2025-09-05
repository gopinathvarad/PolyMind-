import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { AIResponse } from "@/types/ai";

export async function generateAIResponse(
  modelId: string,
  message: string
): Promise<AIResponse> {
  try {
    const result = await generateText({
      model: openrouter(modelId),
      prompt: message,
    });

    return {
      id: crypto.randomUUID(),
      modelId,
      content: result.text,
      timestamp: new Date(),
      isLoading: false,
    };
  } catch (error) {
    return {
      id: crypto.randomUUID(),
      modelId,
      content: "",
      timestamp: new Date(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function generateMultipleResponses(
  modelIds: string[],
  message: string
): Promise<AIResponse[]> {
  const promises = modelIds.map((modelId) =>
    generateAIResponse(modelId, message)
  );

  return Promise.all(promises);
}
