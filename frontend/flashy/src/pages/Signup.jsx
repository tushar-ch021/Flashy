import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../assets/assets"; 
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signup = () => {
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();

  // Submit handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormError(""); // clear previous errors

      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          userName,
          email,
          password
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      setLoading(false);
     
    } catch (error) {
      setLoading(false);
      console.error("Signup failed:", error);

      if (error.response && error.response.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl bg-white shadow-xl rounded-lg p-8 flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={assets.logo}
            alt="Flashy"
            className="h-14 md:h-18 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSignup}>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter a username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {formError && (
            <p className="text-red-500 text-sm font-medium">{formError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Create Account"}
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-pink-500 font-medium cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
