"use client";

import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSiteSettings } from "@/context/SiteContext";
import {
  FaBook,
  FaVideo,
  FaChalkboardTeacher,
  FaTasks,
  FaQuestionCircle,
} from "react-icons/fa";

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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PricingCardNew: React.FC<PricingCardProps> = ({
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
  const { siteSettings } = useSiteSettings();
  const currencySymbol = siteSettings?.currency_symbol || "$";

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe.js has not loaded yet.");
      alert("Failed to load Stripe. Please try again later.");
      return;
    }

    
    const successUrl = "/dashboard";

    try {
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
            Authorization: `Bearer ${Cookies.get("jwt")}` || "",
          },
        }
      );

      if (response.status !== 200) {
        console.error("Error during checkout:", response.data);
        alert(`Failed to initiate checkout: ${response.data.error}`);
        return;
      }

      const { sessionId } = response.data;

      if (!sessionId) {
        throw new Error("Failed to create session ID.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to checkout. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      alert(
        error?.response?.data?.error ||
          "Failed to initiate checkout. Please try again."
      );
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      handleCheckout();
    } else {
      Cookies.set("plan_id", priceId);
      Cookies.set("priceType", priceType);
      router.push(buttonLink);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 ">
    {popular && (
      <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        Most Popular
      </div>
    )}
  
    {/* Left Section */}
    <div className="flex-shrink-0 bg-tertiary  text-white p-6 md:p-8 flex flex-col justify-center items-center w-full md:w-1/3">
      <h3 className="text-lg md:text-2xl font-bold mb-3">{title}</h3>
      <p className="text-3xl md:text-4xl font-extrabold mb-3">
        {currencySymbol}
        {price}
      </p>
      <p className="text-sm md:text-lg">
        {priceType === "monthly" ? "Per Month" : "One-Time Payment"}
      </p>
    </div>
  
    {/* Right Section */}
    <div className="flex-grow p-4 md:p-6 space-y-4">
      {/* Description */}
      {description && (
        <div className="mb-2 md:mb-4">
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
      )}
  
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        {examNames.length > 0 && (
          <div>
            <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <FaBook className="text-blue-500 mr-2" />
              Exams ({examNames.length})
            </h4>
            <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
              {examNames.map((exam, index) => (
                <li key={index}>{exam}</li>
              ))}
            </ul>
          </div>
        )}
  
        {lessonNames.length > 0 && (
          <div>
            <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <FaChalkboardTeacher className="text-green-500 mr-2" />
              Lessons ({lessonNames.length})
            </h4>
            <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
              {lessonNames.map((lesson, index) => (
                <li key={index}>{lesson}</li>
              ))}
            </ul>
          </div>
        )}
  
        {videoNames.length > 0 && (
          <div>
            <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <FaVideo className="text-red-500 mr-2" />
              Videos ({videoNames.length})
            </h4>
            <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
              {videoNames.map((video, index) => (
                <li key={index}>{video}</li>
              ))}
            </ul>
          </div>
        )}
  
        {practiceNames.length > 0 && (
          <div>
            <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <FaTasks className="text-purple-500 mr-2" />
              Practice Sets ({practiceNames.length})
            </h4>
            <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
              {practiceNames.map((practice, index) => (
                <li key={index}>{practice}</li>
              ))}
            </ul>
          </div>
        )}
  
        {quizNames.length > 0 && (
          <div>
            <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <FaQuestionCircle className="text-indigo-500 mr-2" />
              Quizzes ({quizNames.length})
            </h4>
            <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
              {quizNames.map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
  
      {/* Button */}
      <div>
        <button
          onClick={handleClick}
          className="mt-4 w-full py-2 md:py-3 text-secondary bg-primary rounded-md text-sm md:text-base font-semibold hover:bg-primary-dark transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default PricingCardNew;
