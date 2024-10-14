import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string; // Link to navigate if no customer ID
  popular?: boolean;
  priceId: string; // The price ID for the Stripe checkout
  priceType: string; // "fixed" or "monthly"
  customerId: string | null; // Stripe customer ID (can be null)
}

// Load Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonLabel,
  buttonLink,
  popular = false,
  priceId,
  priceType,
  customerId,
}) => {
  const router = useRouter(); // For route navigation

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe.js has not loaded yet.");
      alert("Failed to load Stripe. Please try again later.");
      return;
    }

    try {
      // Send the POST request to create a checkout session
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
        priceId,
        priceType,
        customerId,
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });

      // Check if the response indicates success
      if (response.status !== 200) {
        console.error("Error during checkout:", response.data);
        alert(`Failed to initiate checkout: ${response.data.error}`);
        return;
      }

      const { sessionId } = response.data; // Get sessionId from the response

      // Check if the sessionId is available
      if (!sessionId) {
        throw new Error("Failed to create session ID.");
      }

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  const handleClick = () => {
    console.log(customerId);
    handleCheckout(); 
    // if (!customerId) {
    //   router.push(buttonLink); // Navigate to the provided link if no customer ID
    // } else {
    //   handleCheckout(); // Initiate checkout process
    // }
  };

  return (
    <div className="relative rounded-lg shadow-sm p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
      {popular && (
        <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <p className="text-4xl sm:text-5xl font-bold text-secondary text-center mb-4">
        {price}
      </p>
      <p className="text-gray-500 text-center mb-6">Per month, billed annually</p>

      <ul className="text-gray-600 mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-3">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className="block w-full primary-button"
        onClick={handleClick} // Either checkout or navigate
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;