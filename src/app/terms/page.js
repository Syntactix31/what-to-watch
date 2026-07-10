"use client";

import Link from "next/link";

export default function Page() {



  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 px-6 pt-12 pb-16">
      <div className="max-w-2xl mx-auto border-2 border-zinc-800 rounded-2xl bg-zinc-900/20 p-6">
        <h1 className="text-3xl text-shimmer font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-6">
          Effective Date: May 25, 2026<br />
          Website Name: WhatToWatch<br />
          Contact: <span className="font-bold hover:underline"><a href="mailto:whattowatch.support@gmail.com">whattowatch.support@gmail.com</a></span>
        </p>
        <p className="mb-8">These Terms and Conditions govern your use of the WhatToWatch website and services. By accessing or using the website, you agree to these Terms. If you do not agree, you should not use the website.</p>

        <h2 className="text-xl font-bold mb-4">1. Services Provided</h2>
        <p className="mb-4">WhatToWatch provides movie discovery features, including search, browsing, movie suggestions, playlists, recently viewed tracking, and related account features. The website may also provide login, profile, and playlist functionality for authenticated users.</p>
        <p className="mb-8">We strive to keep the service available and accurate, but we do not guarantee that all movie data, availability, or descriptions will always be complete, current, or error-free. Movie information may be sourced from third-party services and can change without notice.</p>

        <h2 className="text-xl font-bold mb-4">2. User Accounts</h2>
        <p className="mb-8">Some features may require a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
        You agree to provide accurate and current information and to notify us if you believe your account has been compromised. We may suspend or terminate access if we believe account activity violates these Terms or poses a security risk.</p>

        <h2 className="text-xl font-bold mb-4">3. Acceptable Use</h2>
        <p className="mb-8">You agree not to misuse the website, attempt to interfere with its operation, or use it for unlawful purposes. You must not attempt to access data or systems that you are not authorized to use.
        You also agree not to scrape, copy, redistribute, or commercially exploit the website or its content except as permitted by law or by written permission.</p>

        <h2 className="text-xl font-bold mb-4">4. Data and Privacy</h2>
        <p className="mb-4">We take reasonable measures to protect your data and use commercially acceptable security practices to help safeguard it. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
        <p className="mb-8">Any personal information you provide is used to operate the service, maintain your account, and improve user experience. For more details on how data is collected, used, and protected, please review our Privacy Policy.</p>

        <h2 className="text-xl font-bold mb-4">5. Third-Party Services</h2>
        <p className="mb-8">The website may integrate with third-party services, including authentication providers, movie data APIs, or other external platforms. We are not responsible for the content, availability, or practices of third-party services, and their use may be subject to separate terms and privacy policies.</p>


        <h2 className="text-xl font-bold mb-4">6. Intellectual Property</h2>
        <p className="mb-8">All original website design, branding, text, code, and features remain the property of the website owner unless otherwise stated. Third-party movie images, titles, metadata, and related content belong to their respective owners and are used subject to applicable licenses or permissions.
        Nothing in these Terms grants you ownership rights in the website or its content beyond the limited right to use the service for personal, non-commercial purposes, unless explicitly authorized otherwise.</p>


        <h2 className="text-xl font-bold mb-4">7. Disclaimer</h2>
        <p className="mb-8">The website is provided on an “as is” and “as available” basis. We make no warranties that the service will be uninterrupted, secure, or error-free, or that any content will be accurate for every use case.
        To the fullest extent permitted by law, we are not liable for indirect, incidental, special, or consequential damages arising from your use of the website.</p>

        <h2 className="text-xl font-bold mb-4">8. Changes to the Service</h2>
        <p className="mb-8">We may update, modify, suspend, or discontinue any part of the website at any time without prior notice. We may also update these Terms from time to time, and continued use of the site means you accept the revised Terms.</p>

        <h2 className="text-xl font-bold mb-4">9. Termination</h2>
        <p className="mb-8">We may restrict or terminate access to the website at our discretion if we believe you have violated these Terms or if necessary to protect the service, our users, or our systems.</p>

        <h2 className="text-xl font-bold mb-4">10. Governing Law</h2>
        <p className="mb-8">These Terms will be governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein without regard to conflict-of-law rules. Any disputes will be handled in the courts or legal venue applicable in that jurisdiction.</p>

        <h2 className="text-xl font-bold mb-4">11. Contact</h2>
        <p>If you have questions about these Terms, contact us at:</p>
        <h3 className="font-bold mb-10 hover:underline"><a href="mailto:whattowatch.support@gmail.com">whattowatch.support@gmail.com</a></h3>


        <p>By using WhatToWatch, you agree to our Terms and Conditions and acknowledge that your data is handled in accordance with our Privacy Policy. </p>
              
      </div>
      <div>
          <Link 
            href="/" 
            className="flex items-center justify-center p-4 gap-2 text-yellow-400 hover:text-yellow-300 mb-6 group transition-transform"
          > {/* Removed active:scale-95 because it didn't look good */}
            <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
      </div>

    </main>
  );
  

}