import axios from "axios";
import { UserPlus, Loader2 } from "lucide-react";
import React, { useState } from "react";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";
const INITIAL_FORM = { name: "", email: "", password: "" };

const Signup = ({onSwitchMode}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData);
      console.log("Signup successfully", data);
      setMessage({
        text: "Registered successfully! You can now log in.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Signup error.", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-2xl p-8 mx-auto mt-10 font-sans">
      {/* ICON + TITLE */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full
          mx-auto flex items-center justify-center mb-4 shadow-md shadow-purple-400/40">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join TaskFlow to manage your tasks efficiently
        </p>
      </div>

      {/* ALERT MESSAGE */}
      {message.text && (
        <div
          className={`mb-4 text-sm font-medium px-4 py-2 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
        </div>

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
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
        </div>

        {/* Button */}
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
              <Loader2 className="animate-spin w-5 h-5" /> Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
  Already have an account?{" "}
  <button
    onClick={onSwitchMode}
    type="button"
    className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
  >
    Login
  </button>
</p>

    </div>
  );
};

export default Signup;
