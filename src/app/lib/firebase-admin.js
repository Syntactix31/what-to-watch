import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminApp() {
  const existingApp = getApps().find((app) => app.name === "[DEFAULT]");

  if (existingApp) {
    return existingApp;
  }

  // Preferred for Vercel/production: entire service-account JSON as Base64.
  const base64ServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (base64ServiceAccount) {
    const serviceAccount = JSON.parse(
      Buffer.from(base64ServiceAccount, "base64").toString("utf8")
    );

    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  // Local development: downloaded service-account JSON file.
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
    });
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_BASE64 in production or GOOGLE_APPLICATION_CREDENTIALS locally."
  );
}

export const adminAuth = getAuth(getFirebaseAdminApp());


