"use client";

import { useState } from "react";
import MovieReview from "./MovieReview";
import Comments from "./Comments";

export default function ReviewSection({ movie }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <MovieReview
        movie={movie}
        onSaved={() => setRefreshKey((key) => key + 1)}
      />

      <Comments movieId={movie.id} refreshKey={refreshKey} />
    </>
  );
}