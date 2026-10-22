import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const projectID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const recaptchaKey = process.env.RECAPTCHA_SITE_KEY;
const base64ServiceAccount =
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!projectID || !recaptchaKey || !base64ServiceAccount) {
  throw new Error(
    "Missing GOOGLE_CLOUD_PROJECT_ID, RECAPTCHA_SITE_KEY, or FIREBASE_SERVICE_ACCOUNT_BASE64."
  );
}

const serviceAccount = JSON.parse(
  Buffer.from(base64ServiceAccount, "base64").toString("utf8")
);

const recaptchaClient = new RecaptchaEnterpriseServiceClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});

export async function createAssessment({ token, recaptchaAction }) {
  if (!token) {
    return { ok: false, reason: "Missing reCAPTCHA token." };
  }

  const projectPath = recaptchaClient.projectPath(projectID);

  const request = {
    assessment: {
      event: {
        token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await recaptchaClient.createAssessment(request);

  if (!response.tokenProperties.valid) {
    return {
      ok: false,
      reason:
        response.tokenProperties.invalidReason ||
        "Invalid reCAPTCHA token.",
    };
  }

  if (response.tokenProperties.action !== recaptchaAction) {
    return {
      ok: false,
      reason: "Unexpected reCAPTCHA action.",
    };
  }

  return {
    ok: true,
    score: response.riskAnalysis?.score ?? 0,
    reasons: response.riskAnalysis?.reasons ?? [],
  };
}