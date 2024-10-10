"use client";

import { useEffect } from "react";
import React from "react";
import Link from "next/link";
import { FaHome  } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const EmailSent = () => {
  const router = useRouter();
   // Check if user is already signed in
  useEffect(() => {
    const token = Cookies.get('jwt'); 
    if (token) {
      router.push('/'); 
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center px-4 md:px-0">
      {/* Header */}
      <header className="w-full py-4">
        <div className="container flex items-center justify-between max-w-screen-lg mx-auto">
          <Link href="/">
            <Image
              src="/images/logo/wizam-logo.png"
              alt="Wizam Logo"
              width={160}
              height={40}
            />
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

      {/* Email Sent Message */}
      <div className="relative mt-16 bg-white rounded-lg text-center shadow-2xl max-w-xl w-full mx-auto md:mx-0">
      <div className="p-6 sm:p-10 md:p-14 lg:p-20">
        
        {/* Checkmark Image */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/images/check_circle.png" // Replace this with the actual path to your check_circle image
            alt="Checkmark" 
            width={120} 
            height={120} 
          />
        </div>

        <h2 className="text-[24px] md:text-[27px] font-semibold text-gray-800">
          Email Sent!
        </h2>

        <p className="mt-2 text-sm md:text-base text-gray-500">
          Check your email inbox for an email from the website or application
          containing a password reset link.
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-4 py-3 w-full bg-secondary text-white rounded-lg hover:bg-secondary-dark transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
    </section>
  );
};

export default EmailSent;
