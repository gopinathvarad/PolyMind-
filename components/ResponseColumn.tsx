"use client";

import { useState } from "react";
import { AIModel, AIResponse } from "@/types/ai";
import { Copy, Check, AlertCircle, Loader2 } from "lucide-react";

interface ResponseColumnProps {
  model: AIModel;
  response?: AIResponse;
  isLoading: boolean;
}

export default function ResponseColumn({
  model,
  response,
  isLoading,
}: ResponseColumnProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (response?.content) {
      try {
        await navigator.clipboard.writeText(response.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const getModelDisplayName = (modelId: string) => {
    const displayNames: Record<string, string> = {
      "openai/gpt-5-chat": "ChatGPT 5",
      "anthropic/claude-sonnet-4": "Claude Sonnet 4",
      "google/gemini-2.5-pro": "Gemini 2.5 Pro",
      "deepseek/deepseek-r1-0528": "DeepSeek R1",
    };

    return displayNames[modelId] || model.name;
  };

  const getModelIcon = (modelId: string) => {
    const customIcons: Record<string, string> = {
      "openai/gpt-5-chat": "🤖",
      "anthropic/claude-sonnet-4": "🧠",
      "google/gemini-2.5-pro": "💎",
      "deepseek/deepseek-r1-0528": "🔍",
    };

    return customIcons[modelId] || model.icon;
  };

  return (
    <div className="flex flex-col h-[500px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">{getModelIcon(model.id)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              {getModelDisplayName(model.id)}
            </h3>
            <p className="text-xs text-purple-300">{model.provider}</p>
          </div>
        </div>
        {response && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 text-xs text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-purple-300">
              <div className="relative">
                <Loader2 size={32} className="animate-spin text-purple-400" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse"></div>
              </div>
              <span className="text-sm font-medium">
                Generating response...
              </span>
            </div>
          </div>
        )}

        {response?.error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-sm text-red-300">{response.error}</span>
          </div>
        )}

        {response?.content && !response.error && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Response received</span>
            </div>
            <div className="prose prose-sm prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-100 leading-relaxed">
                {response.content}
              </div>
            </div>
          </div>
        )}

        {!response && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">{getModelIcon(model.id)}</span>
              </div>
              <p className="text-sm text-purple-300 font-medium">
                Waiting for your message...
              </p>
              <p className="text-xs text-purple-400 mt-1">
                Send a message to see {getModelDisplayName(model.id)}&apos;s
                response
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
