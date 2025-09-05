"use client";

import { AVAILABLE_MODELS } from "@/lib/ai-models";

interface ModelSelectorProps {
  selectedModels: string[];
  onSelectionChange: (modelIds: string[]) => void;
}

export default function ModelSelector({
  selectedModels,
  onSelectionChange,
}: ModelSelectorProps) {
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  const getModelDisplayName = (modelId: string) => {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
    if (!model) return modelId;

    // Custom display names to match the latest models
    const displayNames: Record<string, string> = {
      "openai/gpt-5-chat": "ChatGPT 5",
      "anthropic/claude-sonnet-4": "Claude Sonnet 4",
      "google/gemini-2.5-pro": "Gemini 2.5 Pro",
      "deepseek/deepseek-r1-0528": "DeepSeek R1",
    };

    return displayNames[modelId] || model.name;
  };

  const getModelIcon = (modelId: string) => {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
    if (!model) return "🤖";

    // Custom icons for the latest models
    const customIcons: Record<string, string> = {
      "openai/gpt-5-chat": "🤖",
      "anthropic/claude-sonnet-4": "🧠",
      "google/gemini-2.5-pro": "💎",
      "deepseek/deepseek-r1-0528": "🔍",
    };

    return customIcons[modelId] || model.icon;
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {AVAILABLE_MODELS.map((model) => {
        const isSelected = selectedModels.includes(model.id);
        return (
          <div key={model.id} className="flex items-center gap-3 min-w-fit">
            {/* Model Icon and Name */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{getModelIcon(model.id)}</span>
              <span className="text-white font-medium text-sm whitespace-nowrap">
                {getModelDisplayName(model.id)}
              </span>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Toggle Switch */}
            <button
              onClick={() => toggleModel(model.id)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isSelected
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isSelected ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
