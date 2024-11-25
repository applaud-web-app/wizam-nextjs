// components/PricingCard.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext";

// Importing icons for different feature categories
import { FaBook, FaVideo, FaChalkboardTeacher, FaTasks, FaQuestionCircle } from "react-icons/fa";

interface PricingCardProps {
  title: string;
  price: string;
  examNames: string[];
  quizNames: string[];
  description: string | null;
  lessonNames: string[];
  practiceNames: string[];
  videoNames: string[];
  buttonLabel: string;
  buttonLink: string;
  popular?: boolean;
  priceId: string;
  priceType: string;
  customerId: string | null;
  isAuthenticated: boolean;
}

// Load Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  examNames,
  quizNames,
  lessonNames,
  practiceNames,
  videoNames,
  description,
  buttonLabel,
  buttonLink,
  popular = false,
  priceId,
  priceType,
  customerId,
  isAuthenticated,
}) => {
  const router = useRouter();

  // Access site settings from the SiteContext
  const { siteSettings } = useSiteSettings();

  // Fallback currency symbol in case it's null or undefined
  const currencySymbol = siteSettings?.currency_symbol || "$";

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe.js has not loaded yet.");
      alert("Failed to load Stripe. Please try again later.");
      return;
    }

    const successUrl = Cookies.get("redirect_url") ? Cookies.get("redirect_url") : '/dashboard';

    try {
      // Send the POST request to create a checkout session
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          priceId,
          priceType,
          customerId,
          successUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      // Check if the response indicates success
      if (response.status !== 200) {
        console.error("Error during checkout:", response.data);
        alert(`Failed to initiate checkout: ${response.data.error}`);
        return;
      }

      const { sessionId } = response.data;

      if (!sessionId) {
        throw new Error("Failed to create session ID.");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to checkout. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      alert(error?.response?.data?.error || "Failed to initiate checkout. Please try again.");
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      handleCheckout();
    } else {
      router.push(buttonLink);
    }
  };

  return (
    <div className="relative rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col">
    {/* Popular Badge */}
    {popular && (
      <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
        Most Popular
      </div>
    )}
  
    {/* Plan Title */}
    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
      {title}
    </h3>
  
    {/* Price Display */}
    <div className="flex items-end justify-center space-x-1 mb-3">
      <p className="text-3xl sm:text-4xl font-extrabold text-secondary text-center">
        {currencySymbol}
        {price}
      </p>
      <p className="text-sm sm:text-base text-gray-600 text-center">
        / {priceType === "monthly" ? "Per Month" : "One Time"}
      </p>
    </div>
  
    {/* Description */}
    <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
      {description}
    </p>
  
    {/* Features List */}
    <div className="flex-1 space-y-4">
      {examNames.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <FaBook className="text-blue-500 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Exams ({examNames.length})
            </h4>
          </div>
          <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
            {examNames.map((exam, index) => (
              <li key={index}>{exam}</li>
            ))}
          </ul>
        </div>
      )}
  
      {lessonNames.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <FaChalkboardTeacher className="text-green-500 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Lessons ({lessonNames.length})
            </h4>
          </div>
         
        </div>
      )}
  
      {videoNames.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <FaVideo className="text-red-500 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Videos ({videoNames.length})
            </h4>
          </div>
       
        </div>
      )}
  
      {practiceNames.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <FaTasks className="text-purple-500 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Practice Sets ({practiceNames.length})
            </h4>
          </div>
       
        </div>
      )}
  
      {quizNames.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <FaQuestionCircle className="text-indigo-500 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Quizzes ({quizNames.length})
            </h4>
          </div>
         
        </div>
      )}
    </div>
  
    {/* Call-to-Action Button */}
    <button
      className="mt-4 sm:mt-6 w-full bg-primary text-secondary py-2 sm:py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors text-sm sm:text-base g"
      onClick={handleClick}
    >
      {buttonLabel}
    </button>
  </div>  
  
  );
};

export default PricingCard;
