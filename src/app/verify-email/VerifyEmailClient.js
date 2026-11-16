"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../utils/firebase";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    // Normal state immediately after signup:
    // router.push("/verify-email") — no query parameters.
    if (!verified && !mode && !oobCode) {
      setStatus("awaiting-email");
      setMessage(
        "A verification email has been sent. Please check your inbox and spam folder, then click the verification link."
      );
      return;
    }

    // Firebase's default hosted action handler completed verification,
    // then redirected to /verify-email?verified=1.
    if (verified === "1") {
      let cancelled = false;

      async function finishVerification() {
        try {
          if (auth.currentUser) {
            await auth.currentUser.reload();
          }
        } catch (err) {
          console.error("Could not refresh current user:", err);
        }

        if (!cancelled) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");

          setTimeout(() => {
            router.replace("/");
          }, 2500);
        }
      }

      finishVerification();

      return () => {
        cancelled = true;
      };
    }

    // ONLY  USE THIS FOR CUSTOM FIREBASE EMAIL HANDLER ONCE SET UP
    if (mode === "verifyEmail" && !oobCode) {
      setStatus("error");
      setMessage("Invalid or incomplete verification link.");
      return;
    }

    // An unexpected Firebase action mode reached this page.
    if (mode && mode !== "verifyEmail") {
      setStatus("error");
      setMessage("This link is not an email verification link.");
      return;
    }



    let cancelled = false;

    async function finishVerification() {
      try {
        // calling action code again would fail the authentication
        // await applyActionCode(auth, oobCode);

        if (auth.currentUser) {
          await auth.currentUser.reload();
        }

        if (!cancelled) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");

          setTimeout(() => {
            router.replace("/");
          }, 2500);

        }
      } catch (err) {
        console.error("Failed to refresh verification state: ", err);


        if (!cancelled) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");

          setTimeout(() => {
            router.replace("/");
          }, 2500);
        }


        // if (!cancelled) {
        //   setStatus("error");

        //   if (err?.code === "auth/invalid-action-code") {
        //     setMessage(
        //       "This verification link is invalid, expired, or has already been used. Please request a new verification email."
        //     );
        //   } else if (err?.code === "auth/unauthorized-continue-uri") {
        //     setMessage(
        //       "This website domain is not authorized in Firebase. Contact support or try again later."
        //     );
        //   } else {
        //     setMessage(
        //       `We could not verify this link. ${err?.code || "Unknown error"}`
        //     );
        //   }
        // }        
      }
    }

    finishVerification();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  async function resendVerificationEmail() {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in again to resend the verification email.");
      return;
    }

    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email?verified=1`,
        handleCodeInApp: false,
      });

      setMessage("Verification email sent. Check your inbox and spam folder.");
    } catch (err) {
      console.error(err);
      setMessage("Could not resend the verification email. Try again later.");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
        <h1 className="text-2xl font-bold text-shimmer">Email verification</h1>

        <p className="mt-3 text-sm text-zinc-400">
          {status === "verifying" || status === "awaiting-email"
            ? status === "verifying"
              ? "Verifying your email…"
              : "Check your inbox to verify your email."
            : message}
        </p>

        {status === "success" && (
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-zinc-950 cursor-pointer"
          >
            Continue
          </Link>
        )}

        {(status === "awaiting-email" || status === "error") && (
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




