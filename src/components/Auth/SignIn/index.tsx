"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Handle sign-in logic, e.g., API call
    try {
      // Add sign-in logic here
      setLoading(false);
    } catch (err) {
      setError("An error occurred during sign-in.");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-4 z-10">
        <div className="container flex items-center justify-between">
          <Image
            src="/images/logo/wizam-logo.png"
            alt="Wizam Logo"
            width={160}
            height={40}
          />
         <Link href="/" className="flex items-center text-lg text-gray-700 hover:underline">
          <FaHome className="mr-2" />
          Back to Home
        </Link>
        </div>
      </header>

      {/* Background Design */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/frame.png')" }}
      ></div>

      {/* Sign In Card */}
      <div className="relative mt-16 bg-white rounded-lg shadow-lg max-w-lg w-full z-10">
        <div className="p-14">
          <h2 className="text-2xl font-semibold text-left text-gray-800">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please sign in to your account.
          </p>

          {error && (
            <p className="text-center text-sm text-red-600 mt-4">{error}</p>
          )}

          <form className="mt-8 space-y-8" onSubmit={handleSignIn}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
                  <Link href="/forget-password" className="text-primary text-sm font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
             
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4">
            
          </div>
        </div>

        <div className="text-center p-2">
          <p className="text-sm text-gray-600 bg-[#F6F9FC] rounded-sm p-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500 z-10">
        <p>
          © Wizam •{" "}
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>{" "}
          •{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy & Terms
          </Link>
        </p>
      </footer>
    </section>
  );
};

export default SignIn;
