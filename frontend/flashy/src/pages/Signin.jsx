import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../assets/assets"; 
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
const dispatch = useDispatch();
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setUsernameError("");
      setPasswordError("");
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          userName,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false);
       dispatch(setUserData(result.data.user));
      // Navigate to dashboard/home after login
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.error("Signin failed:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        const msg = String(err.response.data?.message || "").toLowerCase();
        if (msg.includes("user not found")) {
          setUsernameError("User not found!");
        } else if (msg.includes("invalid password")) {
          setPasswordError("Incorrect password!");
        } else {
          setError(err.response.data?.message || "Signin failed");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Signin Card */}
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl rounded-lg p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={assets.logo}
            alt="Flashy"
            className="h-14 md:h-18 w-auto object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign In
        </h2>

        <form className="w-full space-y-4" onSubmit={handleSignin}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              value={userName}
              onChange={(e) => { setUserName(e.target.value); setError(""); setUsernameError(""); }}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your username"
            />
            {usernameError && (
              <p className="text-red-600 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); setPasswordError(""); }}
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-pink-500 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-600 text-xs mt-1">{passwordError}</p>
            )}

            {/* Forgot Password */}
            <div className="text-left ">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-xs  hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Sign In"}
          </button>
        </form>

        {/* Signup redirect */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-500 font-medium cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
