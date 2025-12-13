import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { MessageSquare, Star, User } from 'lucide-react'; 

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Subscription state (NEW)
  const [subscription, setSubscription] = useState(null);

  // ⭐ Review System States
  const [avgRating, setAvgRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviewMsg, setReviewMsg] = useState("");

  // ---------------- FETCH MOVIE ----------------
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosClient.get(`movies/api/detail/${id}/`);
        setMovie(res.data);
      } catch (err) {
        console.log("Video fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // ---------------- FETCH SUBSCRIPTION (NEW) ----------------
  const loadSubscription = async () => {
    try {
      const res = await axiosClient.get("users/subscription/");
      setSubscription(res.data);
    } catch (err) {
      setSubscription(null);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  // ---------------- FETCH REVIEWS ----------------
  const loadReviews = async () => {
    try {
      const rs = await axiosClient.get(`movies/api/reviews/${id}/`);
      setReviews(rs.data || []);
    } catch (err) {
      console.log("Review fetch error:", err);
    }
  };

  // ---------------- FETCH AVG RATING ----------------
  const loadAvgRating = async () => {
    try {
      const rs = await axiosClient.get(`movies/api/reviews/average/${id}/`);
      setAvgRating(rs.data.average || 0);
    } catch (err) {
      console.log("Avg rating fetch error:", err);
    }
  };

  useEffect(() => {
    loadReviews();
    loadAvgRating();
  }, [id]);

  // ---------------- SUBMIT REVIEW ----------------
  const submitReview = async () => {
    if (userRating === 0) {
      setReviewMsg("Please select rating ⭐");
      return;
    }

    try {
      await axiosClient.post("movies/api/reviews/add/", {
        movie_id: id,
        rating: userRating,
        comment,
      });

      setReviewMsg("Review submitted ✔");

      loadReviews();
      loadAvgRating();

      setComment("");
      setUserRating(0);

      setTimeout(() => setReviewMsg(""), 2000);
    } catch (err) {
      console.log("Review error:", err);
      setReviewMsg("Error submitting review");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading player...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Movie not found 😭
      </div>
    );
  }

  // ---------------- 🚫 PREMIUM MOVIE BLOCK ----------------
  if (movie.is_premium) {
    const active = subscription?.status === "active";

    if (!active) {
      return (
        <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-500">Premium Content 🔒</h2>

          <p className="text-gray-300 max-w-xl mb-6 text-lg">
            This movie is available only for subscribed users.  
            Subscribe now to unlock premium content!
          </p>

          <button
            onClick={() => navigate("/settings")}
            className="px-8 py-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
          >
            Go to Subscription Plans
          </button>
        </div>
      );
    }
  }

  // ---------- Helper: detect source ----------
  const isYouTube = (url = "") =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const isDirectVideo = (url = "") => {
    // basic check for common direct video extensions
    return /\.(mp4|webm|ogg|mkv)(\?.*)?$/i.test(url);
  };

  // ⭐ Helper: Star Display
  const StarDisplay = ({ rating, size = 16 }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? "#facc15" : "#4b5563"}
          className={i < rating ? 'text-yellow-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );

  // ---------------- MAIN CONTENT ----------------
  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col pt-24">

      {/* ---------------- VIDEO ---------------- */}
      <div
        className="w-full flex justify-center items-center px-4 pb-10"
        // ensure player area won't collapse on small screens
        style={{ minHeight: 240 }}
      >
        {movie.video_url ? (
          isYouTube(movie.video_url) ? (
            // YOUTUBE IFRAME (responsive)
            <div style={{ width: "100%", maxWidth: 900, aspectRatio: "16/9" }}>
              <iframe
                title={movie.title || "player"}
                src={
                  movie.video_url.includes("watch?v=")
                    ? movie.video_url.replace("watch?v=", "embed/")
                    : movie.video_url.includes("youtu.be/")
                    ? movie.video_url.replace("youtu.be/", "www.youtube.com/embed/")
                    : movie.video_url
                }
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8 }}
              ></iframe>
            </div>
          ) : isDirectVideo(movie.video_url) ? (
            // HTML5 video player
            <div style={{ width: "100%", maxWidth: 900 }}>
              <video
                key={movie.video_url}
                controls
                style={{ width: "100%", borderRadius: 8, backgroundColor: "black" }}
                // remove autoplay to avoid mobile autoplay restrictions
              >
                <source src={movie.video_url} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            // Last fallback: try using <video> anyway (some CDNs serve without extension)
            <div style={{ width: "100%", maxWidth: 900 }}>
              <video
                key={movie.video_url}
                controls
                style={{ width: "100%", borderRadius: 8, backgroundColor: "black" }}
              >
                <source src={movie.video_url} />
                Unable to play this video format in the browser.
              </video>

              {/* Helpful hint */}
              <p className="text-sm text-gray-400 mt-2">
                If this link is a YouTube link, it will open in the embedded player.
                For other providers you might need a direct .mp4/.webm URL or an embed URL.
              </p>
            </div>
          )
        ) : (
          <p className="text-gray-400">No video available</p>
        )}
      </div>

      {/* ---------------- REVIEWS SECTION ---------------- */}
      <div className="w-full max-w-4xl mx-auto px-6 mt-10 pb-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-gray-700 pb-3">
            <MessageSquare className="text-red-500" size={28} /> User Ratings & Reviews
        </h2>

        {/* AVERAGE RATING DISPLAY */}
        <div className="flex items-center gap-6 mb-10 p-5 bg-neutral-900 rounded-xl shadow-xl border border-gray-800">
            <div className="text-center">
                <p className="text-6xl font-extrabold text-yellow-400">
                    {avgRating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                    AVG RATING
                </p>
            </div>
            <div className="flex flex-col gap-1">
                <StarDisplay rating={avgRating} size={24} />
                <p className="text-md text-gray-300 font-medium">
                    {reviews.length} total review{reviews.length !== 1 ? 's' : ''}
                </p>
            </div>
        </div>

        {/* USER RATE BOX */}
        <div className="bg-neutral-900 p-6 rounded-xl border border-gray-700 mb-10">
          <h3 className="text-xl font-semibold mb-4">Rate This Movie</h3>

          {/* STAR SELECTOR */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg font-medium text-gray-300">Your Score:</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(star)}
                    className={`cursor-pointer text-4xl transition duration-150 ${
                    (hoverRating || userRating) >= star
                        ? "text-yellow-400 scale-110"
                        : "text-gray-700 hover:text-gray-500"
                    }`}
                >
                    ★
                </span>
                ))}
            </div>
          </div>

          {/* COMMENT INPUT */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts and review..."
            rows="4"
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-red-500 transition"
          />

          <button
            onClick={submitReview}
            className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Submit Review
          </button>

          {reviewMsg && (
            <p className={`mt-3 text-sm font-medium p-2 rounded ${
                reviewMsg.includes("Error") || reviewMsg.includes("select rating") 
                    ? 'bg-red-900/50 text-red-400' 
                    : 'bg-green-900/50 text-green-400'
            }`}>
                {reviewMsg}
            </p>
          )}
        </div>

        {/* EXISTING REVIEWS LIST */}
        <h3 className="text-xl font-bold mb-4 border-l-4 border-red-600 pl-3">What Others Say</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-400 p-4 bg-neutral-900 rounded-lg">No reviews yet. Be the first to share your opinion!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r, index) => (
              <div
                key={index}
                className="bg-neutral-900 p-4 rounded-xl border border-gray-800 shadow-md transition hover:border-red-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                      <User size={18} className="text-red-500"/>
                      <span className="text-md font-semibold text-white">{r.user}</span>
                  </div>
                  <span className="text-sm text-gray-500">{r.created_at}</span>
                </div>
                
                <div className="mb-3">
                    <StarDisplay rating={r.rating} size={18} />
                </div>
                
                <p className="text-gray-300 italic leading-relaxed">
                    "{r.comment || "(The reviewer left no comment)"}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
