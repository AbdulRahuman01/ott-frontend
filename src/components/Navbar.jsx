import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Menu,
  LogOut,
  User,
  Film,
  Clock,
  Heart,
  ChevronDown,
  Settings,
  Bell,
} from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [allMovies, setAllMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([]);
  const [openNotify, setOpenNotify] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) return;

    axiosClient
      .get("movies/api/list/")
      .then((res) => setAllMovies(res.data))
      .catch((err) => console.log("Search fetch error:", err));
  }, [isLoggedIn]);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(text.toLowerCase())
    );

    setResults(filtered.slice(0, 6));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔔 Fetch notifications
  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }

    axiosClient
      .get("users/notifications/")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.log("Notification fetch error:", err));
  }, [isLoggedIn]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await axiosClient.post("users/notifications/read/");
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
        }))
      );
    } catch (err) {
      console.log("Mark read error:", err);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
    setOpenNotify(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/");
  };

  const navigateAndClose = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg py-3"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="group text-3xl font-black tracking-tighter text-red-600 transition-transform hover:scale-105"
        >
          OTT
          <span className="text-white group-hover:text-gray-200 transition-colors">
            flix
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {!isLoggedIn && (
            <div className="flex items-center gap-6 font-medium text-sm">
              <Link to="/" className="text-gray-300 hover:text-white">
                Home
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <>
              <div className="flex gap-6 text-sm font-medium text-gray-300">
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
                <Link to="/movies" className="hover:text-white">
                  Movies
                </Link>
              </div>

              <div className="flex items-center gap-6 border-l border-gray-700 pl-6">
                {/* 🔍 SEARCH */}
                <div className="relative flex items-center">
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch(true)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:scale-110"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center gap-2 bg-neutral-800/80 border border-gray-600 rounded-full px-3 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Titles, genres..."
                          autoFocus
                          value={searchText}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="bg-transparent text-sm text-white outline-none w-32 lg:w-48 placeholder-gray-500"
                        />
                        <button
                          onClick={() => {
                            setShowSearch(false);
                            setSearchText("");
                            setResults([]);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {results.length > 0 && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-neutral-900/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                          {results.map((movie) => (
                            <div
                              key={movie.id}
                              onClick={() => {
                                navigate(`/movies/${movie.id}`);
                                setResults([]);
                                setShowSearch(false);
                                setSearchText("");
                              }}
                              className="flex items-center gap-4 p-2 my-1 hover:bg-neutral-700 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                            >
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                              />
                              <span className="text-sm text-gray-100 font-medium truncate">
                                {movie.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 🔔 NOTIFICATION BELL */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setOpenNotify(!openNotify)}
                    className="relative w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] leading-none text-white px-1.5 py-[3px] rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {openNotify && (
  <div
    className="
      absolute 
      top-full 
      right-0 
      mt-3 
      w-72 
      bg-neutral-900 
      border border-gray-700 
      rounded-lg 
      shadow-2xl 
      z-50 
      p-3
    "
  >
    {/* header + list exactly as before */}
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold text-gray-200">
        Notifications
      </span>
      {notifications.length > 0 && (
        <button
          onClick={markAllRead}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Mark all as read
        </button>
      )}
    </div>

    <div className="max-h-64 overflow-y-auto custom-scrollbar">
      {notifications.length === 0 ? (
        <p className="text-xs text-gray-400 py-2">
          No notifications yet.
        </p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-2 rounded-md mb-1 text-xs ${
              n.is_read
                ? "bg-neutral-900 text-gray-300"
                : "bg-neutral-800 text-gray-100"
            }`}
          >
            <p>{n.message}</p>
            <p className="text-[10px] text-gray-500 mt-1">
              {n.created_at}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
)}

                </div>

                {/* ⭐ PROFILE ICON WITH DROPDOWN MENU ⭐ */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group flex items-center text-gray-300 hover:text-white transition"
                    title="Account Menu"
                  >
                    <User className="w-5 h-5" />
                    <ChevronDown
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                        showProfileMenu ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-3 w-48 bg-neutral-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
                      <button
                        onClick={() => navigateAndClose("/watchlist")}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 hover:bg-neutral-800 hover:text-white transition"
                      >
                        <Heart className="w-4 h-4 text-red-500" /> Watchlist
                      </button>

                      <button
                        onClick={() => navigateAndClose("/history")}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 hover:bg-neutral-800 hover:text-white transition"
                      >
                        <Clock className="w-4 h-4 text-blue-400" /> History
                      </button>

                      <button
                        onClick={() => navigateAndClose("/settings")}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 hover:bg-neutral-800 hover:text-white transition"
                      >
                        <Settings className="w-4 h-4 text-gray-400" /> Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-sm text-red-500 hover:bg-red-900/40 transition border-t border-gray-700 mt-1 pt-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-1 rounded hover:bg-white/10"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 top-[60px] z-40 bg-black/95 backdrop-blur-xl md:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 p-8 text-lg font-semibold text-gray-300">
          {!isLoggedIn ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                to="/"
                className="hover:text-white"
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="hover:text-white"
              >
                Login
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/register"
                className="hover:text-white text-red-500"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 pb-6 border-b border-gray-800 text-white">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <span>My Account</span>
              </div>

              <Link
                onClick={() => setOpen(false)}
                to="/"
                className="flex items-center gap-4"
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/movies"
                className="flex items-center gap-4"
              >
                <Film className="w-5 h-5 text-gray-500" /> Movies
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/watchlist"
                className="flex items-center gap-4"
              >
                <Heart className="w-5 h-5 text-gray-500" /> Watchlist
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/history"
                className="flex items-center gap-4"
              >
                <Clock className="w-5 h-5 text-gray-500" /> History
              </Link>

              <Link onClick={() => setOpen(false)} to="/settings" className="flex items-center gap-4">
  <Settings className="w-5 h-5 text-gray-500" /> Settings
</Link>


              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-4 text-red-500 mt-4 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-neutral-900 border border-red-700/50 rounded-lg shadow-2xl p-8 w-full max-w-sm transform scale-100 opacity-100 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LogOut className="w-6 h-6 text-red-500" /> Confirm Logout
            </h3>
            <p className="text-gray-300 mb-6 text-sm">
              Are you sure you want to log out of OTTflix? You will need to
              sign in again to access your personalized content.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
