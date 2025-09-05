export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export interface AIResponse {
  id: string;
  modelId: string;
  content: string;
  timestamp: Date;
  isLoading: boolean;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  modelId?: string; // Only for AI responses
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  responses: AIResponse[];
}

export interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}
