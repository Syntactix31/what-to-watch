"use client";

export default function MovieDeleteModal({ movie, onClose, onDelete, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-zinc-600 bg-zinc-950 text-zinc-100 p-6 shadow-2xl">
        <div className="relative">
          <h3 className="text-2xl font-bold mb-3 text-shimmer w-55">Delete This Movie?</h3>

          {/* NOTE: ************   "x" CLOSE BUTTON IS NOT FORMATTING PROPERLY FOR SMALLER SCREENS IMMEDIATE FIX NEEDED ************** */}

          <button className="absolute left-99 bottom-5 h-fit align-right text-end text-lg hover:cursor-pointer active:scale-95" onClick={onClose}>x</button>
        </div>
        <p className="text-zinc-300 mb-6">
          Are you sure you want to delete{" "}
          <strong>{movie?.title || "this movie"}</strong>? 
          <br/>This cannot be undone!
        </p>
        

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-white hover:cursor-pointer active:scale-95 hover:bg-zinc-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:cursor-pointer active:scale-95 hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}