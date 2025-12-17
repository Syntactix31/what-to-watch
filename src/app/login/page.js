"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "../utils/auth";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password, remember);
      router.replace("/");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(remember);
      router.replace("/");
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Background glow (diagonal red like screenshot) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute -top-32 -right-32 h-[900px] w-[900px] rotate-12 bg-red-600/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24 min-h-screen flex items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Left text block */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-red-500 drop-shadow">
              What To Watch
            </h1>
            <p className="mt-4 text-zinc-200">
              Sign in to save watchlists, rate movies, and get recommendations.
            </p>
          </div>

          {/* Right card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)] p-8">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Log in to continue to{" "}
                <span className="text-red-400">What To Watch</span>.
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-200">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-200">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 pr-16 text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-300 hover:text-zinc-100 px-2 py-1 rounded-lg hover:bg-zinc-800/40 whitespace-nowrap"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-zinc-200 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-200 hover:text-zinc-100"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-red-500 py-3 font-semibold text-zinc-950 hover:bg-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <div className="text-xs text-zinc-500">OR</div>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-800 bg-transparent py-3 font-semibold text-zinc-100 hover:bg-zinc-900/40 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  Continue with Google
                </button>

                <p className="pt-2 text-center text-sm text-zinc-500">
                  New here?{" "}
                  <Link
                    href="/signup"
                    className="text-red-400 hover:text-red-300 font-semibold"
                  >
                    Create an account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
