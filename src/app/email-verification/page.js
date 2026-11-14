"use client";

import { useState } from "react";
import Link from "next/link";
import { verifyEmail } from "../utils/auth";

export default function Page() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);

    try {
      await verifyEmail(verificationCode);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not verify email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold">
          Verify your <span className="text-shimmer">email</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your verification code sent to your registered email address. If you haven't received it, check your spam folder or request a new code.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {sent && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Email verified successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Verification Code</label>
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              type="text"
              autoComplete="off"
              maxLength={8}
              placeholder="Enter verification code"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-600 hover:cursor-pointer px-4 py-3 font-semibold text-zinc-950 hover:from-yellow-300 hover:to-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Verifying…" : "Verify Email"}
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

