"use client";

import { useState } from "react";
import { AIModel } from "@/types/ai";
import { AVAILABLE_MODELS } from "@/lib/ai-models";
import { Check, Plus, X } from "lucide-react";

interface ModelSelectorProps {
  selectedModels: string[];
  onSelectionChange: (modelIds: string[]) => void;
}

export default function ModelSelector({
  selectedModels,
  onSelectionChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  const selectedModelsData = selectedModels
    .map((id) => AVAILABLE_MODELS.find((model) => model.id === id))
    .filter(Boolean) as AIModel[];

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedModelsData.map((model) => (
          <div
            key={model.id}
            className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
          >
            <span>{model.icon}</span>
            <span>{model.name}</span>
            <button
              onClick={() => toggleModel(model.id)}
              className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-sm hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <Plus size={14} />
          Add Model
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[300px]">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select AI Models
          </h3>
          <div className="space-y-2">
            {AVAILABLE_MODELS.map((model) => (
              <label
                key={model.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg">{model.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {model.description}
                  </div>
                </div>
                {selectedModels.includes(model.id) && (
                  <Check size={16} className="text-blue-600" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
