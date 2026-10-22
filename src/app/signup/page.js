"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "../utils/auth";
import TermsModal from "../components/TermsModal";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState({terms: false, privacy: false});

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const [showCaptcha, setShowCaptcha] = useState(false);

  // reCAPTCHA dynamic sizing bs
  const RECAPTCHA_WIDTH = 304;
  const RECAPTCHA_HEIGHT = 78;

  const captchaContainerRef = useRef(null);
  const [captchaScale, setCaptchaScale] = useState(1);

  const captchaHeight = Math.round(RECAPTCHA_HEIGHT * captchaScale);
  

  // reCAPTCHA container fix cuz its being a piece of shit
  useEffect(() => {
    if (!showCaptcha) return;

    const container = captchaContainerRef.current;
    if (!container) return;

    function updateScale(availableWidth) {
      if (availableWidth <= 0) return;

      setCaptchaScale(
        Math.min(1, availableWidth / RECAPTCHA_WIDTH)
      );
    }

    updateScale(container.clientWidth);

    const observer = new ResizeObserver(([entry]) => {
      updateScale(entry.contentRect.width);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [showCaptcha]);


  //     Testing localhost for reCAPTCHA v3, you can use the following test keys:
  // async function getRecaptchaToken() {
  //   return new Promise((resolve, reject) => {
  //     if (!window.grecaptcha?.enterprise) {
  //       reject(new Error("reCAPTCHA is not ready. Please try again."));
  //       return;
  //     }

  //     window.grecaptcha.enterprise.ready(async () => {
  //       try {
  //         const token = await window.grecaptcha.enterprise.execute(
  //           RECAPTCHA_SITE_KEY,
  //           { action: "SIGNUP" }
  //         );
  //         resolve(token);
  //       } catch (err) {
  //         console.error("reCAPTCHA execute failed:", err);
  //         reject(new Error("reCAPTCHA verification failed. Please try again."));
  //       }
  //     });
  //   });
  // }  

  function getRecaptchaToken() {
    const token = window.grecaptcha?.enterprise?.getResponse?.();

    if (!token) {
      throw new Error("Please complete the reCAPTCHA check.");
    }

    return token;
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (pw !== pw2) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed.terms || !agreed.privacy) {
      setShowTerms(true);
      return;
    }

    try {
      const recaptchaToken = await getRecaptchaToken();
      await createAccount(recaptchaToken);
    } catch (err) {
      setError(err.message || "Sign up failed.");
    }
  }  



  async function createAccount(recaptchaToken) {
    if (!agreed.terms || !agreed.privacy) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }   

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA check.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(name, email, pw, remember, recaptchaToken);
      router.push("/");
    } catch (err) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }


  function passwordsMatch() {
    if (pw === pw2) {
      setShowCaptcha(true);
    } else {
      setShowCaptcha(false);
    }

  }


  return (
    // <main className="min-h-dvh bg-zinc-950 text-zinc-100 grid place-items-center px-6">
    <main className="grid min-h-dvh w-full min-w-0 grid-cols-1 place-items-center bg-zinc-950 px-6 py-8 text-zinc-100">
      <Script
        src="https://www.google.com/recaptcha/enterprise.js"
        strategy="afterInteractive"
      />

      {/*  Script for reCAPTCHA v3 for localhost development (score based)  */}
      {/* <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      /> */}


      {/* <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8"> */}
      <div className="box-border w-full min-w-0 max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl md:p-8">
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
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

                                  {/* className="mt-6 space-y-4" */}
        <form onSubmit={handleSubmit} className="mt-6 w-full min-w-0 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johnappleseed"
              maxLength={50}      /*   reduce to 10 digits so display name doesnt mess up nav bar and main page layout/formatting    */
              required
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              required
              autoComplete="email"
              maxLength={100}
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
              maxLength={50}
              minLength={6}
              required
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200">Confirm password</label>
            <input
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              onBlur={() => passwordsMatch()}
              type="password"
              autoComplete="new-password"
              maxLength={50}
              minLength={6}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>

          {/* Div parent to wrap the remmeber me check box and recaptcha in the same flex row on small viewports */}
          {/* <div className=" flex flex-row justify-end gap-16 max-w-max align-center sm:flex-column mb-7"></div> */}
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-yellow-500 focus:ring-yellow-500/30"
            />
            Remember me
          </label>

          {/* Old version which worked but needed better dynamic sizing */}
            {/* <div
              className={`${showCaptcha ? 'block origin-top-left w-[240px] overflow-hidden sm:w-full sm:flex sm:justify-center sm:scale-100 scale-[0.85]' : 'hidden'} g-recaptcha`}
              data-sitekey={RECAPTCHA_SITE_KEY}
              data-action="SIGNUP"
              data-theme="dark"
            /> */}

        {/* Trying a suggestion from AI */}
            <div
              ref={captchaContainerRef}
              className={`${
                showCaptcha
                  ? "mt-2 flex w-full justify-center overflow-hidden"
                  : "hidden"
              }`}
              style={{
                height: captchaHeight,
              }}
            >
              <div
                className="g-recaptcha origin-top-left"
                style={{
                  width: RECAPTCHA_WIDTH,
                  height: RECAPTCHA_HEIGHT,
                  transform: `scale(${captchaScale})`,
                }}
                data-sitekey={RECAPTCHA_SITE_KEY}
                data-action="SIGNUP"
                data-theme="dark"
              />
            </div>





          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-600 px-4 py-3 font-semibold text-zinc-950 hover:from-yellow-300 hover:to-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
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

      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        agreed={agreed}
        setAgreed={setAgreed}
        onAccept={async () => {
          setShowTerms(false);

          try {
            const recaptchaToken = getRecaptchaToken();
            await createAccount(recaptchaToken);
          } catch (err) {
            setError(err.message || "Sign up failed.");
          }
        }}

        // onAccept for local development testing with reCAPTCHA v3 (score based)
        // onAccept={async () => {
        //   setShowTerms(false);

        //   try {
        //     const recaptchaToken = await getRecaptchaToken();
        //     await createAccount(recaptchaToken);
        //   } catch (err) {
        //     setError(err.message || "Sign up failed.");
        //   }
        // }}
        
      />

    </main>
  );
}



