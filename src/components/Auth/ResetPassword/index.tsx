"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // Basic form validation
  if (newPassword !== confirmPassword) {
    setError("Passwords do not match!");
    setLoading(false);
    return;
  }

  // Add logic here to handle password reset, e.g., API call
  try {
    // Simulate successful reset
    setSubmitted(true);
    setLoading(false);
  } catch {
    setError("An error occurred while resetting your password.");
    setLoading(false);
  }
};

  return (
    <section className="relative min-h-screen flex flex-col items-center px-4 md:px-0">
      {/* Header */}
      <header className="w-full py-4">
        <div className="container flex items-center justify-between  mx-auto">
          <Image
            src="/images/logo/wizam-logo.png"
            alt="Wizam Logo"
            width={160}
            height={40}
          />
          <Link
            href="/"
            className="flex items-center text-lg text-gray-700 hover:underline"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Reset Password Card */}
      <div className="relative mt-16 bg-white rounded-lg  shadow-2xl max-w-xl w-full mx-auto md:mx-0">
        <div className="p-6 sm:p-10 md:p-14">
          <h2 className="text-[24px] md:text-[27px] font-semibold text-left text-gray-800">
            Reset your password
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Enter your new password below and confirm it to reset your account password.
          </p>

          {submitted && !error && (
            <p className="text-center text-green-600 mt-4">
              Your password has been successfully reset.
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-600 mt-4">{error}</p>
          )}

          <form className="mt-8 space-y-8" onSubmit={handleReset}>
            {/* New Password Field */}
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 top-[30px] flex items-center text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 top-[30px] flex items-center text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-secondary hover:bg-secondary-dark rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
