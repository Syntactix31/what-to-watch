"use client";

import { useEffect } from "react";

export default function TermsModal({
  open,
  onClose,
  agreed,
  setAgreed,
  onAccept,
}) {

  useEffect(() => {
    if (!open) setAgreed({ terms: false, privacy: false });
  }, [open, setAgreed]);

  if (!open) return null;

  const canAccept = agreed?.terms && agreed?.privacy;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-xl font-bold">Terms and Privacy</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 custom-scrollbar">
          <p className="mb-4">
            By using WhatToWatch, you agree to these Terms and Conditions and acknowledge our Privacy Policy.
            The website provides movie discovery features, including browsing,
            search, playlists, recently viewed tracking, and related account
            features.
          </p>

          <p className="mb-4">
            We collect and use your email address and account activity (such as
            ratings, reviews, and playlists) to provide and improve the service.
            We implement commercially reasonable security measures to protect
            your data, though no system is completely secure.
          </p>

          <p className="mb-4">
            Movie data and third-party integrations may change, be delayed, or
            become temporarily unavailable. The service is provided as-is and
            as available.
          </p>

          <p>
            You must not misuse the site, attempt unauthorized access, or
            interfere with the website or its connected services.
          </p>

          <section className="mt-6">
            For full details, please refer to the official documentation below or contact support.
            <a href="mailto:whattowatch.support@gmail.com" className="text-yellow-500 hover:underline mt-4 block w-fit">
              Send Email
            </a>
            <div className="flex flex-wrap mt-2">
              <a href="/terms" className="text-yellow-500 hover:underline mt-4 block w-fit mr-4">
                Terms and Conditions
              </a>
              <a href="/privacy" className="text-yellow-500 hover:underline mt-4 block w-fit">
                Privacy Policy
              </a>
            </div> 
          </section>
        </div>

        <div className="border-t border-zinc-800 px-6 py-5 space-y-3">
          <label className="flex items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={agreed?.terms || false}
              onChange={(e) => setAgreed({ ...agreed, terms: e.target.checked })}
              className="mt-1 h-4 w-4 accent-yellow-500"
            />
            <span>
              I have read and agree to the {" "}
              <a href="/terms" className="font-bold hover:underline">
                Terms and Conditions
              </a>.
            </span>

{/* *******NOTE********* */}
{/* Add Section for Privacy Policy acknowledgement or say the following: "I have read and agree to the Terms and Conditions and Privacy Policy." */}
          </label>

          <label className="flex items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={agreed?.privacy || false}
              onChange={(e) => setAgreed({ ...agreed, privacy: e.target.checked })}
              className="mt-1 h-4 w-4 accent-yellow-500"
            />
            <span>
              I have read the {" "}
              <a href="/privacy" className="font-bold hover:underline">
                Privacy Policy
              </a> {" "}
              and understand how my data is collected, used, and protected.
            </span>
          </label>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              disabled={!canAccept}
              className="rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Accept and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 


/*      OLD PRIVACY POLICY SUMMARIZED TEXT
            We take reasonable measures to protect your data and use your
            account information only to provide and improve the service. No
            system is completely secure, but we work to safeguard your data
            using commercially reasonable practices.

*/

