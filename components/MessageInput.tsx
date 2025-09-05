"use client";

import { useState, useRef } from "react";
import { Send, Image, Paperclip, Mic, Star } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  isLoading,
  disabled,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-200">
          <Image size={16} />
          <span className="text-sm font-medium">Generate Image</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-200">
          <Paperclip size={16} />
          <span className="text-sm font-medium">Attach Files</span>
        </button>
      </div>

      {/* Main Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading || disabled}
            className="w-full resize-none bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-4 pr-20 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ minHeight: "60px", maxHeight: "120px" }}
          />

          {/* Right Side Icons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200"
            >
              <Mic size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200"
            >
              <Star size={18} />
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* Helper Text */}
      <div className="text-xs text-purple-400 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
