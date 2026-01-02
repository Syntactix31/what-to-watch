"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "../utils/auth";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (pw !== pw2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(name, email, pw, remember);
      router.push("/");
    } catch (err) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold">
          <span className="mr-2">Join</span>
          <span className="hover-container">
            <span className="text-shimmer normal-case">
              WhatToWatch
            </span>
          </span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">Create your account to start building your watchlist.</p>

        {error && (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johnappleseed"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-zinc-200">Password</label>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200">Confirm password</label>
            <input
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-zinc-300 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-yellow-500 focus:ring-yellow-500/30"
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-600 px-4 py-3 font-semibold text-zinc-950 hover:from-yellow-300 hover:to-orange-500 disabled-opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          <p className="text-sm text-zinc-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
