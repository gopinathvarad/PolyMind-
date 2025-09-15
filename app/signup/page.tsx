"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await signUp(email, password);
      // Immediately sign in after account creation
      await signIn(email, password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-400 mb-6">Sign up to get started</p>
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-purple-500/30 text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          <input
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-purple-500/30 text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-purple-500/30 text-white"
            placeholder="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          {success && <div className="text-green-300 text-sm">{success}</div>}
          <button
            disabled={loading}
            onClick={handleSignup}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              className="text-purple-300 hover:text-purple-200"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
