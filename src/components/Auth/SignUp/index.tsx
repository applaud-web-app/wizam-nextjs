"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For password toggle
import { FaRegCircleCheck } from "react-icons/fa6";

import ReactFlagsSelect from "react-flags-select";


const SignUp = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [selected, setSelected] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
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
          <Link
            href="/"
            className="flex items-center text-lg text-gray-700 hover:underline"
          >
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

      {/* Main Container */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 px-4 lg:px-0 lg:gap-16 z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-between h-full col-span-1">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Get Started Quickly
            </h3>
            <ul className="space-y-4 text-gray-700 text-justify">
              <li className="flex items-start space-x-2">
              <span className="text-primary font-semibold mt-1"><FaRegCircleCheck /></span>
              <p>
                  Access a variety of exam practice options with our
                  user-friendly platform and the most up-to-date questions.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-semibold mt-1"><FaRegCircleCheck /></span>
                <p>
                  Support Every Learning Style: Whether you're preparing for A
                  Levels, GCSEs, university entrance exams, or professional
                  certifications—Wizam offers practice resources for everyone.
                </p>
              </li>
              <li className="flex items-start space-x-2">
              <span className="text-primary font-semibold mt-1"><FaRegCircleCheck /></span>
              <p>
                  Join Thousands of Learners: Wizam is trusted by students,
                  educators, and institutions worldwide.
                </p>
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
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
           
              <ReactFlagsSelect  selected={selected} className=""   onSelect={(code) => setSelected(code)}  />
            </div>

            {/* Phone Number */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
            <div className="col-span-2 flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-2 text-base text-gray-900">
                By creating an account, you confirm that you have read and agree
                to Wizam's{" "}
                <Link
                  href="/terms"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms & Conditions
                </Link>
                .
              </label>
            </div>

            {/* Create My Account Button */}
            <button
              type="submit"
              disabled={!termsAccepted}
              className="col-span-2 w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md transition"
            >
              Create My Account
            </button>
          </form>
          </div>
       

          <div className="text-center p-2 col-span-2">
            <p className="text-sm text-gray-600 bg-[#F6F9FC] rounded-sm p-4">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
