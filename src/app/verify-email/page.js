import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center bg-zinc-950 px-6 text-zinc-100">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <h1 className="text-2xl font-bold text-shimmer">Email verification</h1>
            <p className="mt-3 text-sm text-zinc-400">Verifying your email…</p>
          </div>
        </main>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
