"use client";

import { useState } from "react";
import { AIResponse, ChatMessage } from "@/types/ai";
import { getModelById } from "@/lib/ai-models";
import ModelSelector from "@/components/ModelSelector";
import MessageInput from "@/components/MessageInput";
import ResponseColumn from "@/components/ResponseColumn";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "openai/gpt-5-chat",
    "deepseek/deepseek-r1-0528",
    "google/gemini-2.5-pro",
    "anthropic/claude-sonnet-4",
  ]);
  const [responses, setResponses] = useState<Record<string, AIResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(
    {}
  );

  const handleSendMessage = async (message: string) => {
    if (selectedModels.length === 0) {
      alert("Please select at least one AI model");
      return;
    }

    setIsLoading(true);

    // Add user message to chat history for all selected models
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: message,
      timestamp: new Date(),
      isUser: true,
    };

    setChatHistory((prev) => {
      const newHistory = { ...prev };
      selectedModels.forEach((modelId) => {
        newHistory[modelId] = [...(newHistory[modelId] || []), userMessage];
      });
      return newHistory;
    });

    // Initialize loading responses
    const loadingResponses: Record<string, AIResponse> = {};
    selectedModels.forEach((modelId) => {
      loadingResponses[modelId] = {
        id: crypto.randomUUID(),
        modelId,
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };
    });
    setResponses(loadingResponses);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          modelIds: selectedModels,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get responses");
      }

      const data = await response.json();
      const newResponses: Record<string, AIResponse> = {};

      data.responses.forEach((response: AIResponse) => {
        newResponses[response.modelId] = response;

        // Add AI response to chat history
        const aiMessage: ChatMessage = {
          id: response.id,
          content: response.content,
          timestamp: response.timestamp,
          isUser: false,
          modelId: response.modelId,
        };

        setChatHistory((prev) => ({
          ...prev,
          [response.modelId]: [...(prev[response.modelId] || []), aiMessage],
        }));
      });

      setResponses(newResponses);
    } catch (error) {
      console.error("Error:", error);
      // Set error responses
      const errorResponses: Record<string, AIResponse> = {};
      selectedModels.forEach((modelId) => {
        errorResponses[modelId] = {
          id: crypto.randomUUID(),
          modelId,
          content: "",
          timestamp: new Date(),
          isLoading: false,
          error: "Failed to get response",
        };
      });
      setResponses(errorResponses);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Header with Model Selectors */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-white">PolyMind</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Model Selector Row */}
          <ModelSelector
            selectedModels={selectedModels}
            onSelectionChange={setSelectedModels}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 pb-72">
        <div className="max-w-7xl mx-auto">
          {/* Chat Boxes - Horizontal Layout */}
          {selectedModels.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {selectedModels.map((modelId) => {
                const model = getModelById(modelId);
                if (!model) return null;

                return (
                  <ResponseColumn
                    key={modelId}
                    model={model}
                    response={responses[modelId]}
                    isLoading={isLoading && responses[modelId]?.isLoading}
                    chatHistory={chatHistory[modelId] || []}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-purple-500/20 p-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={selectedModels.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
