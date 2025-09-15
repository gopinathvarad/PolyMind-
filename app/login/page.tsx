"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">
          Sign in to PolyMind
        </h1>
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-purple-500/30 text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-purple-500/30 text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              className="text-purple-300 hover:text-purple-200"
              href="/signup"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
