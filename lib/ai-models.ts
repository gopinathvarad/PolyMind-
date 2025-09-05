import { AIModel } from "@/types/ai";

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "openai/gpt-5-chat",
    name: "ChatGPT 5",
    provider: "OpenAI",
    description: "Latest GPT-5 model with advanced capabilities",
    icon: "🤖",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    description: "Latest Claude Sonnet model with enhanced reasoning",
    icon: "🧠",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Google's most advanced multimodal model",
    icon: "💎",
  },
  {
    id: "deepseek/deepseek-r1-0528",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Advanced reasoning and coding capabilities",
    icon: "🔍",
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return AVAILABLE_MODELS.find((model) => model.id === id);
};
