import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "../../_lib/firebaseAdmin"; 
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const auth = getFirebaseAdmin();
    const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!idToken) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const decoded = await auth.verifyIdToken(idToken);

    const reviews = await sql`
      SELECT id, movie_id, movie_title, rating, review_text, created_at
      FROM reviews
      WHERE user_id = ${decoded.uid}
      ORDER BY COALESCE(updated_at, created_at) DESC
      LIMIT 8
    `;

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews/mine failed:", error);
    return NextResponse.json({ error: "Unable to load your reviews." }, { status: 500 });
  }
}

