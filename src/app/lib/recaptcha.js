import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const projectID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const recaptchaKey = process.env.RECAPTCHA_SITE_KEY;

if (!projectID || !recaptchaKey) {
  throw new Error(
    "Missing GOOGLE_CLOUD_PROJECT_ID or RECAPTCHA_SITE_KEY environment variables."
  );
}

const recaptchaClient = new RecaptchaEnterpriseServiceClient();

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
