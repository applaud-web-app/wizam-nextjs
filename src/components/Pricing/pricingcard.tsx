import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie"; // To access cookies for JWT if needed
import React from "react";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  popular?: boolean;
  priceId: string;
  priceType: string; // Add priceType (fixed or monthly)
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonLabel,
  popular = false,
  priceId,
  priceType, // Get priceType from props
}) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const token = Cookies.get("jwt"); // Assuming you have the user JWT in cookies

    if (!token) {
      alert("User is not authenticated");
      return;
    }

    try {
      // Call the API to create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the JWT token to authorize the user on the backend
        },
        body: JSON.stringify({ priceId, priceType }), // Pass priceId and priceType to the backend
      });

      const { id: sessionId } = await response.json(); // Get sessionId from response

      // Check if the sessionId is available
      if (!sessionId) {
        throw new Error("Failed to create session ID.");
      }

      // Redirect to Stripe Checkout
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
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
      <p className="text-4xl sm:text-5xl font-bold text-primary text-center mb-4">
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
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a 1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-3">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className="block w-full text-center bg-primary text-white py-3 px-5 rounded-full hover:bg-primary-dark transition-colors duration-300 font-semibold"
        onClick={handleCheckout} // Trigger the checkout process
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;
