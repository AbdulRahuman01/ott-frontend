import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import MovieCard from "../../components/MovieCard";

export default function History() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosClient.get("users/history/");
        setMovies(response.data);
      } catch (err) {
        console.log("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Remove a specific movie from history
  const removeMovie = async (movie_id) => {
    try {
      await axiosClient.post("users/history/remove/", { movie_id });
      setMovies((prev) => prev.filter((m) => m.movie_id !== movie_id));
    } catch (err) {
      console.log("Error removing from history:", err);
    }
  };

  // Clear all history
  const clearHistory = async () => {
    try {
      await axiosClient.post("users/history/clear/");
      setMovies([]);
    } catch (err) {
      console.log("Error clearing history:", err);
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 w-full min-h-screen text-white bg-[#121316]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🕒 History</h1>

        {movies.length > 0 && (
          <button
            onClick={clearHistory}
            className="bg-red-600 px-4 py-2 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-20 text-lg">
          Loading history...
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 mt-20 text-lg">
          No history found 😢  
          <br />
          Watch some movies!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((m) => (
            <div key={m.movie_id} className="relative group">
              <MovieCard
                movie={{
                  id: m.movie_id,
                  title: m.title,
                  poster: m.poster,
                }}
              />

              {/* Remove button */}
              <button
                onClick={() => removeMovie(m.movie_id)}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
