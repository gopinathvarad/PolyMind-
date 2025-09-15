"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getChatSessionWithMessages,
  ChatSessionWithMessages,
} from "@/lib/database";
import { ArrowLeft, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";
import { getModelById } from "@/lib/ai-models";

interface ChatSessionPageProps {
  params: {
    sessionId: string;
  };
}

export default function ChatSessionPage({ params }: ChatSessionPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<ChatSessionWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !authLoading && params.sessionId) {
      loadSession();
    }
  }, [user, authLoading, params.sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await getChatSessionWithMessages(params.sessionId);
      setSession(data);
    } catch (err: any) {
      setError(err.message || "Failed to load chat session");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please sign in to view chat sessions
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/history"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Chat session not found
          </h1>
          <p className="text-gray-400 mb-6">
            This chat session doesn't exist or you don't have access to it
          </p>
          <Link
            href="/history"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/history"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-white">PolyMind</h1>
              <span className="text-gray-400">/ Chat</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-200"
              >
                New Chat
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {session.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Created {formatDate(session.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{session.messages.length} messages</span>
            </div>
          </div>
        </div>

        {/* Messages - sequential by timestamp */}
        <div className="space-y-6">
          {session.messages.map((message) => {
            const isUser = message.is_user;
            const model =
              !isUser && message.model_id
                ? getModelById(message.model_id)
                : null;

            return (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {model?.name.charAt(0) || "AI"}
                      </span>
                    </div>
                  </div>
                )}

                <div className={`max-w-3xl ${isUser ? "order-first" : ""}`}>
                  <div
                    className={`p-4 rounded-xl ${
                      isUser
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/30 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>

                  <div
                    className={`text-xs text-gray-400 mt-1 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {formatDate(message.timestamp)}
                    {!isUser && model && (
                      <span className="ml-2 text-purple-400">
                        • {model.name}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">U</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {session.messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500">This chat session is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
