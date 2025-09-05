"use client";

import { useState, useEffect } from "react";
import { AIModel, AIResponse } from "@/types/ai";
import { AVAILABLE_MODELS, getModelById } from "@/lib/ai-models";
import ModelSelector from "@/components/ModelSelector";
import MessageInput from "@/components/MessageInput";
import ResponseColumn from "@/components/ResponseColumn";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, AIResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = async (message: string) => {
    if (selectedModels.length === 0) {
      alert("Please select at least one AI model");
      return;
    }

    setCurrentMessage(message);
    setIsLoading(true);

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

  const getColumnClass = () => {
    const count = selectedModels.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            PolyMind
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare responses from multiple AI models simultaneously
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Model Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select AI Models
          </h2>
          <ModelSelector
            selectedModels={selectedModels}
            onSelectionChange={setSelectedModels}
          />
        </div>

        {/* Response Columns */}
        {selectedModels.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Responses
            </h2>
            <div className={`grid ${getColumnClass()} gap-6 min-h-[400px]`}>
              {selectedModels.map((modelId) => {
                const model = getModelById(modelId);
                if (!model) return null;

                return (
                  <ResponseColumn
                    key={modelId}
                    model={model}
                    response={responses[modelId]}
                    isLoading={isLoading && responses[modelId]?.isLoading}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={selectedModels.length === 0}
            />
          </div>
        </div>

        {/* Spacer for fixed input */}
        <div className="h-24" />
      </div>
    </div>
  );
}
