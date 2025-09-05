import { AIModel } from "@/types/ai";

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable GPT-4 model",
    icon: "🤖",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Latest Claude model with enhanced capabilities",
    icon: "🧠",
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Google's latest multimodal model",
    icon: "💎",
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    description: "Advanced reasoning and coding capabilities",
    icon: "🔍",
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return AVAILABLE_MODELS.find((model) => model.id === id);
};
