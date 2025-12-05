import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import MovieCard from "../../components/MovieCard";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist movies from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axiosClient.get("users/watchlist/");
        setMovies(response.data);
      } catch (error) {
        console.log("Error fetching watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Remove movie from watchlist
  const removeMovie = async (movie_id) => {
    try {
      await axiosClient.post("users/watchlist/remove/", { movie_id });
      setMovies((prev) => prev.filter((m) => m.movie_id !== movie_id));
    } catch (error) {
      console.log("Error removing movie:", error);
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 w-full min-h-screen text-white bg-[#121316]">
      <h1 className="text-3xl font-bold mb-6">❤️ Watchlist</h1>

      {loading ? (
        <div className="text-center text-gray-400 mt-20 text-lg">
          Loading your watchlist...
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 mt-20 text-lg">
          Your watchlist is empty 😢  
          <br />  
          Add some movies to watch later!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((m) => (
            <div key={m.movie_id} className="relative group">
              <MovieCard movie={{
                id: m.movie_id,
                title: m.title,
                poster: m.poster
              }} />

              {/* Remove button */}
              <button
                onClick={() => removeMovie(m.movie_id)}
                className="
                  absolute top-2 right-2 
                  bg-black bg-opacity-70 text-white text-xs 
                  px-2 py-1 rounded-md opacity-0 
                  group-hover:opacity-100 transition
                "
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
