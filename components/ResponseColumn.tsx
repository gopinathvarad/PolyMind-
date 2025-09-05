"use client";

import { AIModel, AIResponse, ChatMessage } from "@/types/ai";
import { AlertCircle, Loader2 } from "lucide-react";

interface ResponseColumnProps {
  model: AIModel;
  response?: AIResponse;
  isLoading: boolean;
  chatHistory: ChatMessage[];
}

export default function ResponseColumn({
  model,
  response,
  isLoading,
  chatHistory,
}: ResponseColumnProps) {
  const getModelDisplayName = (modelId: string) => {
    const displayNames: Record<string, string> = {
      "openai/gpt-5-chat": "ChatGPT 5",
      "anthropic/claude-sonnet-4": "Claude Sonnet 4",
      "google/gemini-2.5-pro": "Gemini 2.5 Pro",
      "deepseek/deepseek-r1-0528": "DeepSeek R1",
    };

    return displayNames[modelId] || model.name;
  };

  const getHeaderColor = () => {
    const colors: Record<string, string> = {
      "openai/gpt-5-chat": "bg-green-500",
      "anthropic/claude-sonnet-4": "bg-orange-500",
      "google/gemini-2.5-pro": "bg-blue-500",
      "deepseek/deepseek-r1-0528": "bg-purple-500",
    };
    return colors[model.id] || "bg-gray-500";
  };

  const getAvatarColor = () => {
    const colors: Record<string, string> = {
      "openai/gpt-5-chat": "bg-green-500",
      "anthropic/claude-sonnet-4": "bg-orange-500",
      "google/gemini-2.5-pro": "bg-blue-500",
      "deepseek/deepseek-r1-0528": "bg-purple-500",
    };
    return colors[model.id] || "bg-gray-500";
  };

  return (
    <div className="flex flex-col h-[500px] bg-black border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className={`${getHeaderColor()} rounded-lg p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {getModelDisplayName(model.id)}
              </h3>
              <p className="text-sm text-white/80">{model.provider}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/20 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-white/20 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-black p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Show initial greeting if no chat history */}
          {chatHistory.length === 0 && !isLoading && (
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 ${getAvatarColor()} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded-lg max-w-[80%]">
                <div className="text-gray-300">
                  {model.id === "openai/gpt-5-chat" && "Hey! How's it going?"}
                  {model.id === "anthropic/claude-sonnet-4" &&
                    "Hello! How are you doing today? Is there anything I can help you with?"}
                  {model.id === "google/gemini-2.5-pro" &&
                    "Hello! How can I help you today?"}
                  {model.id === "deepseek/deepseek-r1-0528" &&
                    "Hi there! 👋 How can I help you today? Whether you have a question, need advice, or just want to chat—I'm here for it! 😊 What's on your mind?"}
                </div>
              </div>
            </div>
          )}

          {/* Display chat history */}
          {chatHistory.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              {message.isUser ? (
                // User message
                <>
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[80%] ml-auto">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </>
              ) : (
                // AI message
                <>
                  <div
                    className={`w-8 h-8 ${getAvatarColor()} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-gray-800 text-white p-3 rounded-lg max-w-[80%]">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Show loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 ${getAvatarColor()} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Generating response...</span>
                </div>
              </div>
            </div>
          )}

          {/* Show error if any */}
          {response?.error && (
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 ${getAvatarColor()} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span className="text-sm">{response.error}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
