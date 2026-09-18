"use client";

import Link from "next/link";

export default function Page() {

  
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 px-6 pt-12 pb-16">
      <div className="max-w-2xl mx-auto border-2 border-zinc-800 rounded-2xl bg-zinc-900/20 p-6">
        <h1 className="text-3xl text-shimmer font-bold mb-6">Privacy Policy</h1>
        <p className="mb-6">
          Effective Date: May 25, 2026<br />
          Website Name: WhatToWatch<br />
          Contact: <span className="font-bold hover:underline"><a href="mailto:whattowatch.support@gmail.com">whattowatch.support@gmail.com</a></span>
        </p>
        <p className="mb-8">
          This Privacy Policy describes how WhatToWatch ("we," "us," or "our") collects, uses, discloses, and protects your personal information when you use the WhatToWatch website and services. 
          We are committed to safeguarding your privacy and complying with applicable Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and Alberta's Personal Information Protection Act (PIPA). 
          By accessing or using the website, you consent to the practices described in this policy.
        </p>

        <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
        <p className="mb-4">We collect the following categories of personal information:</p>
        
        <h3 className="font-bold mb-2 mt-4">1.1 Information You Provide Directly</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Account Information:</strong> Email address, password (stored in encrypted form), and any profile information you choose to provide when creating an account.</li>
          <li><strong>User-Generated Content:</strong> Movie ratings, reviews, comments, playlist names, and playlist contents you create on the website.</li>
          <li><strong>Communications:</strong> Information you provide when contacting us for support or feedback.</li>
        </ul>

        <h3 className="font-bold mb-2 mt-4">1.2 Information Collected Automatically</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Usage Data:</strong> Pages visited, movies viewed, search queries, time spent on pages, features used, and interaction with the website.</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and referring URLs.</li>
          <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings through your browser, but disabling cookies may limit certain website functionality.</li>
        </ul>

        <h3 className="font-bold mb-2 mt-4">1.3 Information from Third Parties</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Movie Data:</strong> Movie titles, descriptions, images, ratings, and metadata sourced from third-party movie data APIs (e.g., TMDB, IMDb). This information is not personal data but may be associated with your activity on the site.</li>
        </ul>

        <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use your personal information for the following purposes:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To create and manage your user account and authenticate your login.</li>
          <li>To enable core features such as creating playlists, rating movies, writing reviews, and tracking recently viewed movies.</li>
          <li>To personalize your experience, including movie recommendations and suggestions based on your activity.</li>
          <li>To communicate with you about service updates, security notices, and support responses.</li>
          <li>To monitor and analyze usage trends, improve website functionality, and enhance user experience.</li>
          <li>To detect, prevent, and address technical issues, fraud, security breaches, or violations of our Terms and Conditions.</li>
          <li>To comply with legal obligations and enforce our rights.</li>
        </ul>
        <p className="mb-8">We will not use your personal information for purposes other than those identified above without obtaining your additional consent.</p>

        <h2 className="text-xl font-bold mb-4">3. How We Share Your Information</h2>
        <p className="mb-4">We do not sell, rent, or trade your personal information. We may share your information in the following circumstances:</p>
        
        <h3 className="font-bold mb-2 mt-4">3.1 Publicly Visible Information</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Reviews and Ratings:</strong> Movie reviews, ratings, and comments you submit may be publicly visible to other users of the website.</li>
          <li><strong>Playlists:</strong> Playlist names and contents may be visible to other users depending on your privacy settings (if applicable).</li>
          <li><strong>Profile Information:</strong> Any profile details you choose to make public will be visible to other users.</li>
        </ul>
        <p className="mb-4">Please exercise caution when deciding what information to include in your reviews, comments, or profile, as this content may be accessible to the public.</p>

        <h3 className="font-bold mb-2 mt-4">3.2 Service Providers</h3>
        <p className="mb-4">We may share your information with trusted third-party service providers who assist us in operating the website, including:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Hosting and infrastructure providers (e.g., Vercel, AWS, Azure).</li>
          <li>Database providers (e.g., Neon, PostgreSQL hosting services).</li>
          <li>Authentication and security services.</li>
          <li>Analytics providers (e.g., Google Analytics).</li>
          <li>Email delivery services for transactional communications.</li>
        </ul>
        <p className="mb-4">These providers are contractually obligated to protect your information and use it only for the purposes we specify.</p>

        <h3 className="font-bold mb-2 mt-4">3.3 Legal Requirements</h3>
        <p className="mb-8">We may disclose your information if required by law, court order, or governmental request, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others, or to investigate fraud or security issues.</p>

        <h2 className="text-xl font-bold mb-4">4. Data Retention</h2>
        <p className="mb-4">We retain your personal information only for as long as necessary to fulfill the purposes identified in this policy, unless a longer retention period is required by law.</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Account Information:</strong> Retained while your account is active. You may request account deletion at any time by contacting us.</li>
          <li><strong>User-Generated Content:</strong> Reviews, ratings, and playlists are retained as long as your account remains active or until you delete them.</li>
          <li><strong>Usage and Analytics Data:</strong> Retained for up to 24 months for analytical and security purposes, then aggregated or deleted.</li>
        </ul>
        <p className="mb-8">When personal information is no longer needed, we will securely delete or anonymize it in accordance with applicable legal requirements.</p>

        <h2 className="text-xl font-bold mb-4">5. Data Security</h2>
        <p className="mb-4">We implement commercially reasonable technical, physical, and organizational measures to protect your personal information, including:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Encryption of data in transit using HTTPS/TLS.</li>
          <li>Secure password storage using industry-standard hashing algorithms.</li>
          <li>Access controls and authentication mechanisms to restrict access to personal information.</li>
          <li>Regular security monitoring and vulnerability assessments.</li>
          <li>Secure development practices and code reviews.</li>
        </ul>
        <p className="mb-8">However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security, and you use the website at your own risk.</p>

        <h2 className="text-xl font-bold mb-4">6. Your Privacy Rights</h2>
        <p className="mb-4">Under PIPEDA and Alberta PIPA, you have the following rights regarding your personal information:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Access:</strong> You may request access to the personal information we hold about you. We will respond within 30 days as required by law.</li>
          <li><strong>Correction:</strong> You may request correction of inaccurate or incomplete personal information.</li>
          <li><strong>Withdrawal of Consent:</strong> You may withdraw consent for certain uses of your information, subject to legal and contractual restrictions. Note that withdrawing consent may limit your ability to use certain features of the website.</li>
          <li><strong>Account Deletion:</strong> You may request deletion of your account and associated personal information by contacting us. We will delete your data unless retention is required by law or necessary for legitimate business purposes (e.g., fraud prevention).</li>
          <li><strong>Complaint:</strong> You may file a complaint with our privacy contact (see Section 10) or with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.</li>
        </ul>
        <p className="mb-8">To exercise any of these rights, please contact us at <span className="font-bold hover:underline"><a href="mailto:whattowatch.support@gmail.com">whattowatch.support@gmail.com</a></span>. We may need to verify your identity before processing your request.</p>

        <h2 className="text-xl font-bold mb-4">7. Children's Privacy</h2>
        <p className="mb-8">The website is not intended for children under the age of 13 (or the age of digital consent in your jurisdiction, if higher). We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided personal information to us, please contact us, and we will take steps to delete such information.</p>

        <h2 className="text-xl font-bold mb-4">8. Third-Party Links and Services</h2>
        <p className="mb-8">The website may contain links to third-party websites or integrate with third-party services (e.g., movie data APIs, social media platforms). This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any third-party sites or services you access. We are not responsible for the content or privacy practices of third-party services.</p>

        <h2 className="text-xl font-bold mb-4">9. International Data Transfers</h2>
        <p className="mb-8">Your personal information may be transferred to, stored, and processed in countries outside of Canada, including the United States, where our hosting and service providers operate. These countries may have data protection laws that differ from Canadian laws. By using the website, you consent to such transfers. We take reasonable steps to ensure that your information is protected in accordance with this Privacy Policy and applicable laws.</p>

        <h2 className="text-xl font-bold mb-4">10. Privacy Contact</h2>
        <p className="mb-4">We have designated a privacy contact responsible for ensuring compliance with this Privacy Policy and applicable privacy laws. If you have questions, concerns, or requests regarding your personal information, please contact:</p>
        <p className="mb-8">
          <strong>Privacy Contact:</strong> WhatToWatch Support<br />
          <strong>Email:</strong> <span className="font-bold hover:underline"><a href="mailto:whattowatch.support@gmail.com">whattowatch.support@gmail.com</a></span>
        </p>

        <h2 className="text-xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
        <p className="mb-8">We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. The updated policy will be posted on this page with a revised "Effective Date." We encourage you to review this policy periodically. Continued use of the website after changes are posted constitutes your acceptance of the revised Privacy Policy.</p>

        <h2 className="text-xl font-bold mb-4">12. Breach Notification</h2>
        <p className="mb-8">In the event of a security breach involving your personal information that poses a real risk of significant harm, we will notify you and the Office of the Privacy Commissioner of Canada as soon as feasible, as required by PIPEDA. Notification will include details of the breach, the information involved, and steps you can take to protect yourself.</p>

        <h2 className="text-xl font-bold mb-4">13. Governing Law</h2>
        <p className="mb-8">This Privacy Policy is governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein. Any disputes relating to this policy will be handled in accordance with the governing law provisions in our Terms and Conditions.</p>

        <p className="mt-8 pt-6 border-t border-zinc-800">
          By using WhatToWatch, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your personal information as described herein. 
          For more information about your use of the website, please review our <span className="font-bold hover:underline"><Link href="/terms">Terms and Conditions</Link></span>.
        </p>
             
      </div>
      <div>
          <Link 
            href="/" 
            className="flex items-center justify-center p-4 gap-2 text-yellow-400 hover:text-yellow-300 mb-6 group transition-transform"
          >
            <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
      </div>

    </main>
  );
}
