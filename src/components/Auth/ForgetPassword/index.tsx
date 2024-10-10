"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Use router to redirect
import { toast } from "react-toastify"; // Import toast from react-toastify
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings


const ForgetPassword = () => {
  const { siteSettings } = useSiteSettings(); // Access site settings from the context

  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already signed in
  useEffect(() => {
    const token = Cookies.get('jwt'); 
    if (token) {
      router.push('/'); 
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          // Show success toast notification
          toast.success("A password reset link has been sent to your email address. Please check your inbox (or spam folder) to proceed.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Redirect to another page after a brief delay to let the toast show
          setTimeout(() => {
            router.push("/email-sent"); // Redirect to the /about page after login
          }, 1000);

        } else {
            // Handle specific error messages from the API
            // setError(data.message || "An error occurred while sending the reset link.");
            toast.error(data.message || "An error occurred while sending the reset link.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        }
    } catch (error) {
        toast.error("An error occurred while sending the reset link.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    } finally {
        setLoading(false);
    }
  };

  if (error || !siteSettings) {
    return <p>Error loading site settings...</p>; // Handle the case where settings couldn't be fetched
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center px-4 md:px-0">
      {/* Header */}
      <header className="w-full py-4">
        <div className="container flex items-center justify-between mx-auto">
        <Link href="/">
        {siteSettings.site_logo && (
                <Image
                  src={siteSettings.site_logo}
                  alt={`${siteSettings.site_name} logo`}
                  width={150}
                  height={30}
                  className="dark:hidden"
                />
              )}
          </Link>
          <Link
            href="/"
            className="flex items-center text-lg text-gray-700 hover:underline"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Forgot Password Card */}
      <div className="relative mt-16 bg-white rounded-lg  shadow-2xl max-w-xl w-full mx-auto md:mx-0">
        <div className="p-6 sm:p-10 md:p-14">
          <h2 className="text-[24px] md:text-[27px] font-bold text-left text-gray-800">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Enter your email address and we will send you instructions to reset
            your password.
          </p>

          {submitted && !error && (
            <p className="text-center text-green-600 mt-4">
              A reset link has been sent to your email.
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-600 mt-4">{error}</p>
          )}

          <form className="mt-8 space-y-8" onSubmit={handleReset}>
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-secondary hover:bg-secondary-dark rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
