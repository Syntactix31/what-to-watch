import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdmin() {
  const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64.");
  }

  if (!getApps().length) {
    const serviceAccount = JSON.parse(
      Buffer.from(base64ServiceAccount, "base64").toString("utf8")
    );
    initializeApp({ credential: cert(serviceAccount) });
  }

  return getAuth();
}

// Just a helper function for the firebase admin adk parse so their isn't authentication drift between server-side components



