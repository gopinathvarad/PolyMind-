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

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{model.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {model.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {model.provider}
            </p>
          </div>
        </div>
        {response && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span>Generating response...</span>
            </div>
          </div>
        )}

        {response?.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {response.error}
            </span>
          </div>
        )}

        {response?.content && !response.error && (
          <div className="space-y-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimestamp(response.timestamp)}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                {response.content}
              </div>
            </div>
          </div>
        )}

        {!response && !isLoading && (
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">{model.icon}</div>
              <p className="text-sm">Waiting for your message...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
