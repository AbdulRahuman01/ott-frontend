import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FiPlay, FiPlus } from "react-icons/fi";
import MovieCard from "../../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import { ChevronRight,ChevronLeft } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- WATCHLIST ----------
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchMsg, setWatchMsg] = useState("");

  // ---------- SIMILAR MOVIES ----------
  const [similar, setSimilar] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  const scrollRef = useRef(null);

  // ---------- FETCH MOVIE DETAILS ----------
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosClient.get(`movies/api/detail/${id}/`);
        const m = res.data;

        setMovie({
          id: m.id,
          title: m.title,
          description: m.description,
          poster: m.poster,
          backdrop: m.backdrop,
          year: m.year,
          rating: m.rating,
          duration: m.duration,
          genre: m.genre ? m.genre.split(",").map((g) => g.trim()) : [],
          languages: m.languages
            ? m.languages.split(",").map((l) => l.trim())
            : [],
        });

        setLoading(false);
      } catch (err) {
        console.log("Movie fetch error:", err);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // ---------- FETCH ALL MOVIES ----------
  useEffect(() => {
    axiosClient
      .get("movies/api/list/")
      .then((res) => setAllMovies(res.data))
      .catch((err) => console.log("Error fetching movies:", err));
  }, []);

  // ---------- FIND SIMILAR MOVIES ----------
  useEffect(() => {
    if (!movie || allMovies.length === 0) return;

    const genres = movie.genre.map((g) => g.toLowerCase());

    const filtered = allMovies.filter((m) => {
      if (m.id === movie.id) return false;

      const mg = m.genre.toLowerCase();
      return genres.some((g) => mg.includes(g));
    });

    setSimilar(filtered);
  }, [movie, allMovies]);

  // ---------- CHECK WATCHLIST ----------
  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const res = await axiosClient.get("users/watchlist/");
        const exists = res.data.some(
          (item) => item.movie_id === Number(id)
        );
        setIsInWatchlist(exists);
      } catch (err) {
        console.log("Error checking watchlist:", err);
      }
    };

    checkWatchlist();
  }, [id]);

  const handleWatchlistToggle = async () => {
    try {
      if (!isInWatchlist) {
        await axiosClient.post("users/watchlist/add/", {
          movie_id: id,
        });
        setIsInWatchlist(true);
        setWatchMsg("Added to watchlist ✔");
      } else {
        await axiosClient.post("users/watchlist/remove/", {
          movie_id: id,
        });
        setIsInWatchlist(false);
        setWatchMsg("Removed from watchlist");
      }
    } catch (err) {
      console.log("Watchlist toggle error:", err);
      setWatchMsg("Something went wrong");
    }

    setTimeout(() => setWatchMsg(""), 2000);
  };

  // ---------- LOADING UI ----------
  if (loading) {
    return (
      <div className="pt-20 text-center text-white text-xl">
        Loading movie...
      </div>
    );
  }

  // ---------- NO MOVIE FOUND ----------
  if (!movie) {
    return (
      <div className="pt-20 text-center text-white text-xl">
        Movie not found 🤕
      </div>
    );
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen w-full bg-[#121316] text-white">
      
      {/* MAIN SECTION */}
      <div
        className="
          relative w-full 
          min-h-[400px] sm:min-h-[500px] 
          rounded-none sm:rounded-xl 
          overflow-hidden 
          px-4 sm:px-6 py-8 sm:py-12
        "
        style={{
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

        <div className="relative max-w-3xl z-10">
          <h1 className="text-4xl font-extrabold pt-6">{movie.title}</h1>

          <div className="flex items-center gap-3 text-gray-300 mt-3 text-sm">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.rating}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.languages.length} Languages</span>
          </div>

          <p className="mt-5 text-gray-300 leading-relaxed max-w-xl">
            {movie.description}
          </p>

          <div className="flex gap-4 mt-5 text-white font-semibold">
            {movie.genre.map((g) => (
              <span key={g} className="cursor-pointer hover:text-blue-400">
                {g}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            {movie.languages.map((lang) => (
              <span
                key={lang}
                className="px-4 py-1 bg-white/10 rounded-full text-sm text-gray-200"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              
              {/* WATCH NOW */}
              <button
                onClick={async () => {
                  try {
                    await axiosClient.post("users/history/add/", {
                      movie_id: movie.id,
                    });
                  } catch (err) {
                    console.log("Error adding history:", err);
                  }

                  navigate(`/player/${movie.id}`);
                }}
                className="
                  flex items-center justify-center w-full sm:w-auto 
                  gap-2 px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold 
                  hover:bg-blue-700 transition
                "
              >
                <FiPlay className="text-lg" /> Watch Now
              </button>

              {/* WATCHLIST */}
              <button
                onClick={handleWatchlistToggle}
                className={`
                  flex items-center justify-center w-full sm:w-auto 
                  gap-2 px-4 py-3 rounded-lg transition ${
                    isInWatchlist
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-white/10 hover:bg-white/20"
                  }
                `}
              >
                <FiPlus className="text-xl" />
                {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            {watchMsg && (
              <p className="text-sm text-gray-200">{watchMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- SIMILAR MOVIES WITH SCROLL ARROWS ---------------- */}
      {/* ---------------- SIMILAR MOVIES WITH CHEVRON SCROLL ---------------- */}
<div className="max-w-7xl mx-auto mt-16 px-6">
  <h2 className="text-2xl font-bold mb-4">You may also like</h2>

  {similar.length === 0 ? (
    <p className="text-gray-400">No similar movies found 😢</p>
  ) : (
    <div className="relative">

      {/* LEFT CHEVRON */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 
         hover:bg-black/70 backdrop-blur-md
        text-white p-3 rounded-full z-30 shadow-lg transition"
      >
        <ChevronLeft size={30} strokeWidth={2.5} />
      </button>

      {/* SCROLL BODY */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
      >
        {similar.map((m) => (
          <div key={m.id} className="w-[160px] shrink-0">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>

      {/* RIGHT CHEVRON */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 
         hover:bg-black/70 backdrop-blur-md
        text-white p-3 rounded-full z-30 shadow-lg transition"
      >
        <ChevronRight size={30} strokeWidth={2.5} />
      </button>

    </div>
  )}
</div>

    </div>
  );
}
