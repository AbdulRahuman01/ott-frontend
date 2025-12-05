import { useNavigate } from "react-router-dom";
import {Crown} from "lucide-react";

export default function MovieCard({ movie, requireLogin }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (requireLogin) {
      // Home page protection
      requireLogin(() => 
        navigate(`/movies/${movie.id}`, { state: { movie } })
      );
    } else {
      // Movies page (no protection)
      navigate(`/movies/${movie.id}`, { state: { movie } });
    }
  };

  return (
    <div onClick={handleClick} className="relative group cursor-pointer">

      {/* ⭐ PREMIUM BADGE */}
      {movie.is_premium && (
        <div className="absolute top-2 right-2 z-20">
          <Crown 
            size={20} 
            className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          />
        </div>
      )}


      <img
        src={movie.poster}
        className="w-full h-28 sm:h-64 object-cover rounded-lg shadow-lg 
        transition-all duration-300 group-hover:scale-105"
      />

      <div className="absolute bottom-0 left-0 w-full p-3 
        bg-black bg-opacity-60 opacity-0 group-hover:opacity-100
        rounded-b-lg transition-all duration-300">
        <h3 className="text-white text-sm font-semibold truncate">
          {movie.title}
        </h3>
      </div>

    </div>
  );
}
