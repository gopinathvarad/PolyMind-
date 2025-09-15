"use client";

import { useState, useEffect } from "react";
import { AIResponse, ChatMessage } from "@/types/ai";
import { getModelById } from "@/lib/ai-models";
import ModelSelector from "@/components/ModelSelector";
import MessageInput from "@/components/MessageInput";
import ResponseColumn from "@/components/ResponseColumn";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  createChatSession,
  addMultipleMessages,
  getMessages,
} from "@/lib/database";
import Link from "next/link";

export default function Home() {
  const { user, signOut } = useAuth();
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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Load existing session on mount if present
  useEffect(() => {
    const loadExistingSession = async () => {
      const savedId =
        typeof window !== "undefined"
          ? localStorage.getItem("currentSessionId")
          : null;
      if (!savedId || !user) return;

      try {
        setCurrentSessionId(savedId);
        const messages = await getMessages(savedId);

        // Reconstruct chatHistory per selected model
        const initialHistory: Record<string, ChatMessage[]> = {};
        selectedModels.forEach((m) => {
          initialHistory[m] = [];
        });

        messages.forEach((msg) => {
          if (msg.is_user) {
            const userMsg: ChatMessage = {
              id: msg.id,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              isUser: true,
            };
            selectedModels.forEach((modelId) => {
              initialHistory[modelId] = [
                ...(initialHistory[modelId] || []),
                userMsg,
              ];
            });
          } else if (msg.model_id) {
            const aiMsg: ChatMessage = {
              id: msg.id,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              isUser: false,
              modelId: msg.model_id,
            };
            // Only place AI message under its model id if it's currently selected
            if (selectedModels.includes(msg.model_id)) {
              initialHistory[msg.model_id] = [
                ...(initialHistory[msg.model_id] || []),
                aiMsg,
              ];
            } else {
              // If the model isn't currently selected, ensure key exists but don't render since not selected
              initialHistory[msg.model_id] = [
                ...(initialHistory[msg.model_id] || []),
                aiMsg,
              ];
            }
          }
        });

        setChatHistory(initialHistory);
      } catch (e) {
        console.error("Failed to load existing session messages", e);
      }
    };

    loadExistingSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setChatHistory({});
    setResponses({});
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentSessionId");
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedModels.length === 0) {
      alert("Please select at least one AI model");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    // Create a new chat session if this is the first message
    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        const session = await createChatSession(
          message.slice(0, 50) + (message.length > 50 ? "..." : "")
        );
        sessionId = session.id;
        setCurrentSessionId(sessionId);
        if (typeof window !== "undefined") {
          localStorage.setItem("currentSessionId", sessionId);
        }
      } catch (error) {
        console.error("Failed to create chat session:", error);
        // Continue without saving to database
      }
    }

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

    // Save user message to database
    if (sessionId) {
      try {
        await addMultipleMessages(sessionId, [
          { content: message, isUser: true },
        ]);
      } catch (error) {
        console.error("Failed to save user message:", error);
      }
    }

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
      const messagesToSave: Array<{
        content: string;
        isUser: boolean;
        modelId?: string;
      }> = [];

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

        // Prepare message for database
        messagesToSave.push({
          content: response.content,
          isUser: false,
          modelId: response.modelId,
        });
      });

      setResponses(newResponses);

      // Save AI responses to database
      if (sessionId && messagesToSave.length > 0) {
        try {
          await addMultipleMessages(sessionId, messagesToSave);
        } catch (error) {
          console.error("Failed to save AI messages:", error);
        }
      }
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
              {user ? (
                <>
                  <button
                    onClick={handleNewChat}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    New Chat
                  </button>
                  <Link
                    href="/history"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-200"
                  >
                    History
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{user.email}</span>
                    <button
                      onClick={signOut}
                      className="px-3 py-1 text-sm bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:text-white hover:bg-red-500/30 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}
