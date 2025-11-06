import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

  // 🟣 Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (data.success) {
            onSubmit({ token, userId, ...data.user });
            toast.success("Session restored. Redirecting...");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  // 🟣 Input change handler
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟣 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/user/login`, formData);
      if (!data.token) throw new Error("Login failed");

      // Save credentials
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      setFormData(INITIAL_FORM);
      onSubmit({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-2xl p-8 mx-auto mt-10 font-sans">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* ICON + TITLE */}
      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full
          mx-auto flex items-center justify-center mb-4 shadow-md shadow-purple-400/40"
        >
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue to TaskFlow
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-400"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-lg
          bg-gradient-to-r from-fuchsia-500 to-purple-600
          hover:from-fuchsia-600 hover:to-purple-700
          disabled:opacity-70 disabled:cursor-not-allowed
          shadow-md hover:shadow-purple-400/30 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Logging In...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchMode}
          type="button"
          className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
