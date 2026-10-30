"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Comments({ movieId, refreshKey = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ user, setUser ] = useState(null);
  const [ busyReviewId, setBusyReviewId ] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!movieId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/reviews?movieId=${movieId}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Unable to load reviews");

      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      setError("Could not load reviews right now.");
    } finally {
      setLoading(false);
    }
  }, [movieId]);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews, refreshKey]);

  useEffect(() => {
    if (loading || reviews.length === 0) return;

    const hash = window.location.hash;
    const targetId = hash.startsWith("#review-")
      ? hash.slice(1)
      : null;

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-yellow-400");
        setTimeout(() => el.classList.remove("ring-2", "ring-yellow-400"), 2000);
      }
    }
  }, [loading, reviews]);
  
  async function handleCommentDelete(reviewId) {
    if (!user || !reviewId) return;

    // Temporary confirmation check until I make a proper modal
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return; 

    setBusyReviewId(reviewId);
    setError("");

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${idToken}`,
        }, 
        body: JSON.stringify({ reviewId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "This review could not be deleted.");

      }
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId));

    } catch(deleteError) {
      setError(deleteError.message || "This review could not be deleted. ");
    } finally {
      setBusyReviewId(null);
    }
    
  }



  return (
    <div className="mt-8 pt-8 pb-10 border-t border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {loading && <p className="text-gray-400">Loading reviews…</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
      )}

      <div className="space-y-4" id="review-list">
        {reviews.map((review) => {
          const isOwnReview = user?.uid === review.user_id;
          const isDeleting = busyReviewId === review.id;

          return (
          <article
            key={review.id}
            id={`review-${review.id}`}
            className="rounded-xl border border-gray-800 bg-gray-900/40 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {review.user_photo_url ? (
                  <img
                    src={review.user_photo_url}
                    alt={review.user_display_name || "Reviewer"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 font-semibold">
                    {(review.user_display_name || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="font-semibold">
                    {review.user_display_name || "Anonymous User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-yellow-400 font-bold">
                ★ {review.rating}/10
              </p>
            </div>

            {review.review_text && (
              <p className="mt-3 whitespace-pre-wrap text-gray-300">
                {review.review_text}
              </p>
            )}
            {isOwnReview && (
              <button className='text-xs flex w-fit ml-auto hover:underline active:text-red-500 active:scale-95 hover:cursor-pointer' disabled={isDeleting} onClick={()=> handleCommentDelete(review.id)}>{isDeleting? "Deleting..." : "Delete"}</button>
            )}


          </article>);
        })}
      </div>
    </div>
  );
}


