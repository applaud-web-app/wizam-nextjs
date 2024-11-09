"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Use router to redirect
import axios from "axios"; // Axios for API calls
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Validation Schema
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings

const SignIn = () => {
  const { siteSettings, error } = useSiteSettings(); // Access site settings from the context
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirecting to other pages

  // Check if user is already signed in
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleSignIn = async (values: any, { resetForm }: any) => {
    setLoading(true);

    try {
      // Make an API request to your Laravel API for login
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`, // Ensure this URL matches your Laravel endpoint
        values, // Send email and password directly
        {
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );

      // Check if the response contains status true/false
      if (response.data.status === true) {
        const token = response.data.token; // Extract token from the response

        // Set the token in a cookie
        Cookies.set("jwt", token, { expires: 1 }); // Set cookie to expire in 1 day

        // Show success toast notification
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Check if the redirect_url cookie exists
        const redirectUrl = Cookies.get("redirect_url"); // Get the redirect URL from cookies
        // If redirect URL exists, redirect to that URL, otherwise go to the homepage
        const destination = redirectUrl ? redirectUrl : "/dashboard";

        // Clear the redirect_url cookie after redirection
        // Cookies.remove('redirect_url');

        // Redirect to the destination
        setTimeout(() => {
          router.push(destination);
        }, 1000);
      } else {
        // Display an error toast when status is false
        const errorMessage =
          response.data.message || "Invalid credentials. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset the form after invalid login attempt
        resetForm();
      }
    } catch (error: any) {
      // Display a generic error toast if the request fails (e.g., network issue)
      const errorMessage =
        error.response?.data?.message || "An error occurred during sign-in.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset the form after invalid login attempt
      resetForm();
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Password is required"),
  });

  if (error || !siteSettings) {
    return <p>Error loading site settings...</p>; // Handle the case where settings couldn't be fetched
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center ">
      {/* Header */}
      <header className="w-full py-4 z-10">
        <div className="container flex items-center justify-between">
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
            className="flex items-center text-base lg:text-lg text-gray-700 hover:underline"
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

      <div className="p-3 lg:p-0 max-w-lg w-full">
        {/* Sign In Card */}
        <div className="relative mt-16 bg-white rounded-lg lg:shadow-lg shadow-sm  z-10">
          <div className="p-6 lg:p-14">
            <h2 className="text-2xl font-bold text-left text-gray-800">
              Sign in to your account
            </h2>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignIn}
            >
              {({ isSubmitting }) => (
                <Form className="mt-8 space-y-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-defaultcolor"
                      placeholder="Enter Email Address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
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
                      <Link
                        href="/forget-password"
                        className="text-defaultcolor text-sm font-bold hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-defaultcolor"
                        placeholder="Enter Password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className={`w-full px-4 py-2 text-white bg-defaultcolor hover:bg-defaultcolor-dark rounded-lg transition ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-4"></div>
          </div>

          <div className="text-center p-2">
            <p className="text-sm text-gray-600 bg-[#F6F9FC] rounded-sm p-4">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-defaultcolor font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
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
