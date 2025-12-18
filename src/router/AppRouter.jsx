import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

import MoviesList from "../pages/Movies/MoviesList";
import MovieDetails from "../pages/Movies/MovieDetail";
import Player from "../pages/Player/Player";
import Watchlist from "../pages/User/Watchlist";
import History from "../pages/User/History";
import ChangePassword from "../pages/User/ChangePassword";
import Home from "../pages/Home/Home";

import Settings from "../pages/User/Settings";

import PublicRoute from "../components/PublicRoute";

export default function AppRouter() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
  <Navbar />

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    <Route path="/movies" element={<ProtectedRoute><MoviesList /></ProtectedRoute>} />
    <Route path="/movies/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
    <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
    <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
    <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}></Route>
  </Routes>
</BrowserRouter>
  )
}
