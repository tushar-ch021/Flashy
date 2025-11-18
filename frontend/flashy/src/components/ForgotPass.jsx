import React, { useState } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const ForgotPass = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleStep1 = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(2);
    } catch (error) {
      console.error(error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(3);
    } catch (error) {
      console.error(error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        { email, otp, password: newPassword },
        { withCredentials: true }
      );
      console.log(result.data);
      setSuccess('Password reset successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error(error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Forgot Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs">Email {email} is not valid. Please try again.</p>}
              <button
                onClick={handleStep1}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
              >
                {loading ? <ClipLoader size={20} color="white" /> : 'Send OTP'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter your OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                onClick={handleStep2}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
              >
                {loading ? <ClipLoader size={20} color="white" /> : 'Verify OTP'}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>
            <form className="space-y-4" onSubmit={handleStep3}>
              {/* New Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  placeholder="Enter your new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  placeholder="Confirm your new password"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
              >
                {loading ? <ClipLoader size={20} color="white" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
