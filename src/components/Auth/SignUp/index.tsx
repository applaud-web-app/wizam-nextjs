"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For password toggle
import { FaRegCircleCheck } from "react-icons/fa6";
import ReactFlagsSelect from "react-flags-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation"; // Use router to redirect
import * as Yup from "yup"; // For validation
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings


const SignUp = () => {
  const { siteSettings, error } = useSiteSettings();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState("GB");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
    termsAccepted: Yup.boolean()
      .required("You must accept the terms and conditions")
      .oneOf([true], "You must accept the terms and conditions"),
    country: Yup.string().required("Country is required"),
  });

  const handleSignup = async (values: any, { setSubmitting, resetForm, setFieldError }: any) => {
    setIsSubmitting(true); // Start loading
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
        password_confirmation: values.confirmPassword,
        country: values.country,
      });
  
      if (response.data.status) {
        const token = response.data.token;
        Cookies.set("jwt", token, { expires: 1 });
  
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        resetForm(); // Reset the form after success
  
        const redirectUrl = Cookies.get("redirect_url");
        const destination = redirectUrl ? redirectUrl : "/";
  
        setTimeout(() => {
          router.push(destination);
        }, 1000);
      } else {
        toast.error(response.data.message || "An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/register");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        if (errors.email) {
          setFieldError("email", "Email is already taken");
        }
        errors.forEach((errorMessage: string) => {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          router.push("/register");
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/register");
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };
  
  
  if (error || !siteSettings) {
    return <p>Error loading site settings...</p>; // Handle the case where settings couldn't be fetched
  }
  return (
    <section className="relative min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-4 z-20">
        <div className="container mx-auto flex items-center justify-between px-4">
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

      {/* Main Container */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 px-4 lg:px-0 lg:gap-16 z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-between order-2 md:order-1 lg:order-1 h-full col-span-1">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Get Started Quickly
            </h3>
            <ul className="space-y-4 text-gray-700 text-justify">
              <li className="flex items-start space-x-2">
                <span className="text-defaultcolor font-semibold mt-1">
                  <FaRegCircleCheck />
                </span>
                <p>
                  Access a variety of exam practice options with our user-friendly platform and the most up-to-date questions.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-defaultcolor font-semibold mt-1">
                  <FaRegCircleCheck />
                </span>
                <p>
                  Support Every Learning Style: Whether you're preparing for A Levels, GCSEs, university entrance exams, or professional certifications—Wizam offers practice resources for everyone.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-defaultcolor font-semibold mt-1">
                  <FaRegCircleCheck />
                </span>
                <p>
                  Join Thousands of Learners: Wizam is trusted by students, educators, and institutions worldwide.
                </p>
              </li>
            </ul>
          </div>
          <footer className="mt-12 text-left text-sm text-gray-500 z-10">
            <p>
              © Wizam •{" "}
              <Link href="/contact-us" className="hover:underline">
                Contact Us
              </Link>{" "}
              •{" "}
              <Link href="/privacy-policy" className="hover:underline">
                Privacy & Terms
              </Link>
            </p>
          </footer>
        </div>

        {/* Register Form */}
        <div className="w-full bg-white shadow-sm lg:shadow-lg rounded-lg order-1 md:order-2 lg:order-2 col-span-2">
          <div className="p-5 lg:p-10">
            <h2 className="text-2xl font-semibold text-left text-gray-800 mb-6">
              Create your Wizam account
            </h2>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
                termsAccepted: false,
                country: "GB",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* First Name */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                      placeholder="First Name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Last Name */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                      placeholder="Last Name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Country */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <Field name="country" className="w-full">
                      {({ field }: { field: any }) => (
                        <ReactFlagsSelect
                          selected={selectedCountry}
                          searchable={true}
                          onSelect={(code) => {
                            field.onChange({ target: { name: "country", value: code } });
                            setSelectedCountry(code);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Phone Number */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                      placeholder="Enter your email address"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Password */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                        placeholder="Enter Password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Confirm Password */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                      placeholder="Enter Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Terms & Conditions */}
                  <div className="col-span-2">
                    <label className="flex items-center">
                      <Field
                        type="checkbox"
                        name="termsAccepted"
                        className="h-4 w-4 text-defaultcolor focus:ring-defaultcolor border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        By creating an account, you confirm that you have read and agree to Wizam's{" "}
                        <Link href="/term-and-condition" className="text-defaultcolor hover:underline">
                          Terms and Conditions
                        </Link>
                      </span>
                    </label>
                    <ErrorMessage name="termsAccepted" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Submit Button */}
                  <div className="col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-defaultcolor text-white py-2 px-4 rounded-md hover:bg-defaultcolor-dark transition"
                    >
                      {isSubmitting ? "Submitting..." : "Register"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="text-center p-2 col-span-2">
            <p className="text-sm text-gray-600 bg-[#F6F9FC] rounded-sm p-4">
              Already have an account?{" "}
              <Link href="/login" className="text-defaultcolor font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
