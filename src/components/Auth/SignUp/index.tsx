"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa"; // For password toggle
import { FaRegCircleCheck } from "react-icons/fa6";
import ReactFlagsSelect from "react-flags-select";

const SignUp = () => {
  // Form state variables
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple client-side validation
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Submit form logic
    console.log({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      selectedCountry,
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-4 z-20">
        <div className="container mx-auto flex items-center justify-between px-4">
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

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/frame.png')" }}
      ></div>

      {/* Main Form Container */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 px-4 lg:px-0 lg:gap-16 z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-between h-full col-span-1">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Get Started Quickly</h3>
            <ul className="space-y-4 text-gray-700 text-justify">
              <li className="flex items-start space-x-2">
                <FaRegCircleCheck className="text-primary font-semibold mt-1" />
                <p>
                  Access a variety of exam practice options with our user-friendly platform and
                  the most up-to-date questions.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <FaRegCircleCheck className="text-primary font-semibold mt-1" />
                <p>
                  Support Every Learning Style: Whether you're preparing for A Levels, GCSEs,
                  university entrance exams, or professional certifications—Wizam offers practice
                  resources for everyone.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <FaRegCircleCheck className="text-primary font-semibold mt-1" />
                <p>Join Thousands of Learners: Wizam is trusted by students, educators, and institutions worldwide.</p>
              </li>
            </ul>
          </div>
          <footer className="mt-12 text-left text-sm text-gray-500 z-10">
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
        </div>

        {/* Signup Form */}
        <div className="w-full bg-white shadow-lg rounded-lg col-span-2">
          <div className="p-10">
            <h2 className="text-2xl font-semibold text-left text-gray-800 mb-6">
              Create your Wizam account
            </h2>

            <form className="grid grid-cols-1 gap-8 md:grid-cols-2" onSubmit={handleSignup}>
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  required
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  required
                  placeholder="Last Name"
                />
              </div>

              {/* Country */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <ReactFlagsSelect
                  selected={selectedCountry}
                  onSelect={setSelectedCountry}
                  className="w-full"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  required
                  placeholder="Phone Number"
                />
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  required
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  required
                  placeholder="••••••••"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
