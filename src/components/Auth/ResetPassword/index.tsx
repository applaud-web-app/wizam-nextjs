"use client";

import { useState,useEffect } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings


const ResetPassword = () => {
  const { siteSettings, error } = useSiteSettings(); // Access site settings from the context

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; 
  const email = searchParams.get("email") || "";
  
  // Check if user is already signed in
  useEffect(() => {
    const token = Cookies.get('jwt'); 
    if (token) {
      router.push('/'); 
    }
  }, []);
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleReset = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            password: values.password,
            password_confirmation: values.confirmPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Your password has been reset successfully! Login to continue", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } else {
        toast.error(result.message || "Failed to reset password.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while resetting your password.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required"),
  });

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

      {/* Reset Password Card */}
      <div className="relative mt-16 bg-white rounded-lg shadow-2xl max-w-xl w-full mx-auto md:mx-0">
        <div className="p-6 sm:p-10 md:p-14">
          <h2 className="text-[24px] md:text-[27px] font-semibold text-left text-gray-800">
            Reset your password
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Enter your new password below and confirm it to reset your account password.
          </p>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleReset}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-8">
                {/* New Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                  <Field
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 top-[0px] flex items-center text-gray-600"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  </div>
                 
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                  <Field
                    type={passwordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-body-color outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 top-[0px] flex items-center text-gray-600"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className={`w-full px-4 py-2 text-white bg-secondary hover:bg-secondary-dark rounded-lg transition ${
                    loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
