import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios, { AxiosError } from 'axios'; // Import Axios and AxiosError for error handling
import { useState } from 'react';

interface PricingCardProps {
  title: string;
  price: string;
  priceId: string; // Static Stripe price ID
  features: string[];
  buttonLabel: string;
  popular?: boolean;
}

// Define the shape of the response from the API
interface CheckoutSessionResponse {
  id: string; // Stripe Checkout session ID
}

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  priceId,
  features,
  buttonLabel,
  popular = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    try {
      // Make POST request to create checkout session
      const res = await axios.post<CheckoutSessionResponse>('/api/create-checkout-session', {
        priceId, // Send priceId in the request body
      });

      // Extract session ID from the response
      const { id: sessionId } = res.data;

      // Redirect to Stripe checkout
      const result = await stripe?.redirectToCheckout({ sessionId });

      if (result?.error) {
        alert(result.error.message); // Display error to the user
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response) {
          alert(`API Error: ${axiosError.response.data.error}`); // Show API error
        }
      } else {
        alert('Unexpected error occurred during subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg shadow-sm p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
      {popular && (
        <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      <p className="text-4xl sm:text-5xl font-bold text-primary text-center mb-4">{price}</p>
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
        onClick={handleSubscribe}
        disabled={loading}
        className="block w-full text-center bg-primary text-dark font-semibold py-3 px-5 rounded-full hover:bg-primary-dark transition-colors duration-300 font-semibold"
      >
        {loading ? 'Loading...' : buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;
