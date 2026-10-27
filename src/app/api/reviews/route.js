import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function getFirebaseAdmin() {
  const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64.");
  }

  if (!getApps().length) {
    const serviceAccount = JSON.parse(
      Buffer.from(base64ServiceAccount, "base64").toString("utf8")
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return getAuth();
}

export async function GET(request) {
  try {
    const movieId = new URL(request.url).searchParams.get("movieId");

    if (!movieId || Number.isNaN(Number(movieId))) {
      return NextResponse.json(
        { error: "A valid movieId is required." },
        { status: 400 }
      );
    }

    const reviews = await sql`
      SELECT
        id,
        user_id,
        user_display_name,
        user_photo_url,
        rating,
        review_text,
        created_at
      FROM reviews
      WHERE movie_id = ${Number(movieId)}
        AND is_public = TRUE
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews failed:", error);
    return NextResponse.json(
      { error: "Unable to load reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = getFirebaseAdmin();

    const idToken = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = await auth.verifyIdToken(idToken);

    const body = await request.json();
    const movieId = Number(body.movieId);
    const rating = Number(body.rating);
    const movieTitle = String(body.movieTitle ?? "").slice(0, 300);
    const reviewText = String(body.text ?? "").slice(0, 5000);

    if (!movieId || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Invalid movie ID or rating." },
        { status: 400 }
      );
    }

    const [review] = await sql`
      INSERT INTO reviews (
        user_id,
        user_display_name,
        user_photo_url,
        movie_id,
        movie_title,
        rating,
        review_text
      )
      VALUES (
        ${decoded.uid},
        ${decoded.name ?? null},
        ${decoded.picture ?? null},
        ${movieId},
        ${movieTitle},
        ${rating},
        ${reviewText}
      )
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET
        user_display_name = EXCLUDED.user_display_name,
        user_photo_url = EXCLUDED.user_photo_url,
        rating = EXCLUDED.rating,
        review_text = EXCLUDED.review_text,
        updated_at = now()
      RETURNING
        id,
        rating,
        review_text,
        created_at
    `;

    return NextResponse.json({ review });
  } catch (error) {
    console.error("POST /api/reviews failed:", error);

    if (error?.code?.startsWith("auth/")) {
      return NextResponse.json(
        { error: "Invalid or expired login session." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Could not save review." },
      { status: 500 }
    );
  }
}



export async function DELETE(request) {
  try {
    const auth = getFirebaseAdmin();

    const idToken = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = await auth.verifyIdToken(idToken);

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: "reviewId is required." },
        { status: 400 }
      );
    }

    const deleted = await sql`
      DELETE FROM reviews
      WHERE id = ${reviewId}
        AND user_id = ${decoded.uid}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Review not found or you do not have permission to delete it." },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/reviews failed:", error);

    if (error?.code?.startsWith("auth/")) {
      return NextResponse.json(
        { error: "Invalid or expired login session." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Could not delete review." },
      { status: 500 }
    );
  }
}

