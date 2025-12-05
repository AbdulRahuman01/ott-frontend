import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axiosClient from "../../api/axiosClient";
import MovieCard from "../../components/MovieCard";
import Footer from "../../components/Footer";
import CTAFooter from "../../components/CTAFooter";
import LoginModal from "../../components/LoginModal";
import { useNavigate } from "react-router-dom";

// NEW: Import for icon library
import { PlayCircle, Plus, Check } from 'lucide-react';

export default function Home() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Store IDs of movies currently in watchlist
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // LOGIN PROTECTION FUNCTION
  const requireLogin = (callback) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      setShowModal(true);
    } else {
      callback();
    }
  };

  // 1. Fetch movies
  useEffect(() => {
    axiosClient
      .get("movies/api/list/")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching movies:", err);
      });
  }, []);

  // 2. Fetch User Watchlist (to know which buttons should say "Added")
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosClient
        .get("users/watchlist/")
        .then((res) => {
          // Create a Set of movie IDs for fast lookup
          const ids = new Set(res.data.map((item) => item.movie_id));
          setWatchlistIds(ids);
        })
        .catch((err) => console.log("Error fetching watchlist:", err));
    }
  }, []);

  // 3. Handle Add/Remove Logic
  const handleWatchlistToggle = async (movieId) => {
    try {
      if (watchlistIds.has(movieId)) {
        // REMOVE
        await axiosClient.post("users/watchlist/remove/", { movie_id: movieId });
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(movieId);
          return next;
        });
      } else {
        // ADD
        await axiosClient.post("users/watchlist/add/", { movie_id: movieId });
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.add(movieId);
          return next;
        });
      }
    } catch (err) {
      console.log("Watchlist toggle error:", err);
    }
  };

  const featured = movies.filter((m) => m.is_featured);
  const trending = movies.filter((m) => m.is_trending);
  const action = movies.filter((m) => m.is_action);
  const comedy = movies.filter((m) => m.is_comedy);
  const malayalam = movies.filter((m) => m.is_malayalam);
  const scifi = movies.filter((m) => m.is_scifi);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white text-xl bg-black">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="pt-24 w-full min-h-screen bg-[#121316] text-white">

      {/* HERO BANNER */}
      {/* Increased height, added custom pagination bullets for sleek look */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{ 
          clickable: true,
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom"
        }}
        className="w-[95%] mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-800 home-swiper"
      >
        {featured.map((b) => {
          // Check if this specific movie is in watchlist
          const isInWatchlist = watchlistIds.has(b.id);

          return (
            <SwiperSlide key={b.id}>
              {/* Increased height and gradient overlay for better text contrast */}
              <div className="relative w-full h-[350px] lg:h-[450px] xl:h-[520px]">
                <img src={b.backdrop} className="w-full h-full object-cover" alt={b.title} />
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent opacity-90"></div>

                <div className="absolute left-0 bottom-0 p-6 md:p-10 lg:p-14 max-w-4xl">

                  <div className="inline-block px-3 py-1 text-xs font-bold text-black bg-yellow-400 rounded-full mb-4 uppercase tracking-wider">
                    Featured Movie
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg">
                    {b.title}
                  </h1>

                  <div className="text-sm text-gray-300 mb-4 flex items-center gap-4">
                    <span>{b.year}</span>
                    <span className="text-yellow-400 font-semibold">{b.rating} IMDb</span>
                    <span className="border border-gray-500 px-2 rounded text-xs">{b.genre}</span>
                  </div>

                  {/* Description improved contrast/style */}
                  <p className="text-lg text-gray-200 max-w-xl mb-8 leading-relaxed line-clamp-2">
                    {b.description.substring(0, 150)}...
                  </p>

                  <div className="flex gap-4 mt-6">

                    {/* PROTECTED WATCH NOW - Primary Button Style */}
                    <button
                      onClick={() =>
                        requireLogin(() => navigate(`/player/${b.id}`))
                      }
                      className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 transition transform hover:scale-[1.02]"
                    >
                      <PlayCircle size={24} fill="white" className="text-red-600"/> Watch Now
                    </button>

                    {/* PROTECTED WATCHLIST - Secondary Button Style */}
                    <button
                      onClick={() =>
                        requireLogin(() => handleWatchlistToggle(b.id))
                      }
                      className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl border-2 transition ${
                        isInWatchlist 
                          ? "bg-green-600 border-green-600 text-white hover:bg-green-700" 
                          : "bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:border-white"
                      }`}
                    >
                      {isInWatchlist ? <Check size={20}/> : <Plus size={20}/>} 
                      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    </button>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Inject custom styles for Swiper pagination */}
      <style jsx="true">
        {`
          .swiper-pagination-bullet-custom {
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            margin: 0 4px !important;
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active-custom {
            background: #ef4444; /* red-600 */
            width: 30px;
            border-radius: 5px;
          }
          .home-swiper .swiper-pagination {
             bottom: 30px !important; /* Adjust position */
          }
        `}
      </style>

      {/* CATEGORY ROWS */}
      {[
        { title: "🔥 Trending Now", data: trending },
        { title: "Top Action Movies", data: action },
        { title: "Comedy Movies", data: comedy },
        { title: "Mollywood Hits", data: malayalam },
        { title: "Sci-Fi Thrillers", data: scifi },
      ].map((section, index) => (
        <section key={index} className="mt-16 px-6">
          {/* Improved header styling */}
          <h2 className="text-3xl font-extrabold mb-6 border-l-4 border-red-600 pl-3">
            {section.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
                          lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {section.data.map((movie) => (
              <div key={movie.id} className="p-2 transform transition-transform duration-300 hover:scale-[1.05] hover:z-10">
                {/* NOTE: Assuming MovieCard has been styled to fit a dark theme */}
                <MovieCard movie={movie} requireLogin={requireLogin} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <CTAFooter />
      <Footer />

      {/* MODAL */}
      <LoginModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onLogin={() => navigate("/login")}
      />
    </div>
  );
}