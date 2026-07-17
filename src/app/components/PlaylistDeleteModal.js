"use client";

export default function PlaylistDeleteModal({ playlist, onClose, onDelete, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl border sm:scale-100 scale-85 border-zinc-600 bg-zinc-950 text-zinc-100 pb-6 px-6 shadow-2xl">
        <div className="relative ">
          <h3 className="text-xl font-bold mb-3 text-shimmer w-55 pt-6">Delete This Playlist?</h3>
          
          <button className="absolute right-0 top-0 pt-3 h-fit text-lg hover:cursor-pointer active:scale-95"
            onClick={onClose}>
            x
          </button>        
        </div>
        <p className="text-zinc-300 mb-6">
          Are you sure you want to delete{" "}
          <strong>{playlist?.name || "this playlist"}</strong>? 
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



