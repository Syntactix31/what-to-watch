import { NextResponse } from "next/server";
import { createAssessment } from "../../../lib/recaptcha";
import { adminAuth } from "../../../lib/firebase-admin";

const MIN_RECAPTCHA_SCORE = 0.5;   // try 0.4 or 0.5 for production, 0.3 for testing cuz 0.6 too strict apparently

export async function POST(request) {
  try {
    const { name, email, password, recaptchaToken } =
      await request.json();

    if (!name?.trim() || !email || !password) {
      return NextResponse.json(
        { error: "Display name, email, and password are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const assessment = await createAssessment({
      token: recaptchaToken,
      recaptchaAction: "SIGNUP",
    });

    console.log("reCAPTCHA assessment:", assessment);

    if (!assessment.ok) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed." },
        { status: 400 }
      );
    }

    if (assessment.score < MIN_RECAPTCHA_SCORE) {
      console.warn("Signup rejected: low reCAPTCHA score", {
        score: assessment.score,
        reasons: assessment.reasons,
      });

      return NextResponse.json(
        {
          error:
            "Sign up could not be completed. Please try again later.",
        },
        { status: 403 }
      );
    }


  // ONLY USE THIS IN TESTING FOR PRODUCTION, REMOVE BEFORE DEPLOYMENT (Exposes the app to bots)
  // if (assessment.score < MIN_RECAPTCHA_SCORE) {
  //   console.warn("Signup rejected: low reCAPTCHA score", {
  //     score: assessment.score,
  //     reasons: assessment.reasons,
  //   });

  //   return NextResponse.json(
  //     {
  //       error:
  //         "Sign up could not be completed. Please try again later.",
  //     },
  //     { status: 403 }
  //   );
  // }

    const user = await adminAuth.createUser({
      email: email.trim().toLowerCase(),
      password,
      displayName: name.trim(),
    });

    return NextResponse.json({
      success: true,
      uid: user.uid,
    });
  } catch (err) {
    console.error("Signup error:", err);

    if (err?.errorInfo?.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "That email is already in use." },
        { status: 409 }
      );
    }

    if (err?.errorInfo?.code === "auth/invalid-password") {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sign up failed. Please try again." },
      { status: 500 }
    );
  }
}
