"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { applyActionCode } from "firebase/auth";
import { auth } from "../utils/firebase";


export default function Page() {

  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");


  useEffect(() => {
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    async function verifyEmail() {
      try {
        await applyActionCode(auth, oobCode);

        if (auth.currentUser) {
          await auth.currentUser.reload();
        }

        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("We could not verify this link. It may have expired or already been used,");
      }
    }

    verifyEmail();

  }, [searchParams]);


  // Resent verification email function
  async function resendVerificationEmail() {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in again to resend the verification email.");
      return;
    }

    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      });
      setMessage("Verification email sent. Check your inbox and spam folder.");
    } catch (err) {
      setMessage("Could not resend the verification email. Try again later.");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
        <h1 className="text-2xl font-bold text-shimmer">Email verification</h1>

        <p className="mt-3 text-sm text-zinc-400">
          {status === "verifying" ? "Verifying your email…" : message}
        </p>

        {status === "success" && (
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-zinc-950 cursor-pointer"
          >
            Continue
          </Link>
        )}

        {status === "error" && (
          <button
            onClick={resendVerificationEmail}
            className="mt-6 inline-block rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-100 cursor-pointer"
          >
            Resend verification email
          </button>
        )}
      </div>
    </main>
  );
}


