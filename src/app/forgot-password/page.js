"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../utils/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8">
        <h1 className="text-2xl font-extrabold">
          Reset your <span className="text-yellow-500">password</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your email and we’ll send you a reset link.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            {error}
          </div>
        )}

        {sent && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Reset email sent. Check your inbox (and spam).
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-zinc-950 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          <p className="text-sm text-zinc-400 text-center">
            Back to{" "}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
