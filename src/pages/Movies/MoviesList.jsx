import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import axiosClient from "../../api/axiosClient";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch movies on page load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosClient.get("movies/api/list/");
        setMovies(response.data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search
  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-28 px-4 sm:px-10 pb-20 w-full min-h-screen bg-[#121316] text-white">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-10">All Movies</h1>

      {/* SEARCH BAR */}
      <div className="w-full mb-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-3 py-3
            rounded-lg
            bg-[#171717]
            text-white
            placeholder-gray-400
            outline-none
            focus:ring-2 focus:ring-white
            transition
          "
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 text-center text-lg">Loading movies...</p>
      )}

      {/* MOVIE GRID */}
      {!loading && (
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-5
            xl:grid-cols-6
            gap-6
          "
        >
          {filtered.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-400 mt-10 text-center">
          No movies found 😢
        </p>
      )}

    </div>
  );
}
