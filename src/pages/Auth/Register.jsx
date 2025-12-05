import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axiosClient.post("users/signup/", form);

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/theatre.png"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Box */}
      <div className="relative z-10 flex justify-center items-center h-full">
      <div className="
    bg-black bg-opacity-60 p-10 rounded-xl shadow-2xl border-none 
    max-w-sm w-11/12 md:w-[380px]
">
          
          <h2 className="text-white text-3xl font-bold mb-6 text-center">
            Create Account ✨
          </h2>

          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          {success && <p className="text-green-500 text-center mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
            />

            <button
              type="submit"
              className="mt-3 bg-gradient-to-r from-black via-black to-red-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Sign Up
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?  
            <Link to="/login" className="text-red-500 hover:underline font-semibold ml-1">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
