import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


export default function Login() {
  const navigate = useNavigate();

  // state for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axiosClient.post("users/login/", {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      setErrorMsg("Invalid email or password");
    }
  };

  // ⭐ GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async (googleUser) => {
    try {
      const res = await axiosClient.post("users/google-login/", {
        email: googleUser.email,
        name: googleUser.name,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.log("Google login error:", err);
      setErrorMsg("Google login failed");
    }
  };

  return (
    <div className="relative w-full h-screen">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/theatre.png"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute"></div>

      {/* Login Box */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div
          className="
            bg-black bg-opacity-60 p-10 rounded-xl shadow-2xl border-none 
            max-w-sm w-11/12 md:w-[380px]
          "
        >
          <h2 className="text-white text-3xl font-bold mb-6 text-center">
            Welcome Back 👋
          </h2>

          {errorMsg && (
            <p className="text-red-500 text-center mb-2">{errorMsg}</p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
            />

            {/* Login Button */}
            <button
              className="mt-3 bg-gradient-to-r from-black via-black to-red-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Login
            </button>

          </form>

          {/* ⭐ GOOGLE LOGIN BUTTON */}
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                handleGoogleLogin(decoded);
              }}
              onError={() => {
                setErrorMsg("Google login failed");
              }}
            />
          </div>

          {/* Register Link */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?
            <Link
              to="/register"
              className="text-red-500 hover:underline font-semibold ml-1"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
