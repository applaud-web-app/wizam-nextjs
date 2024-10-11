"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import PricingCard from "./pricingcard";
import NoData from "../Common/NoData";

// Define types for the pricing plan
interface PricingPlan {
  stripe_price_id: string;
  id: number;
  name: string;
  price_type: string;
  duration: number;
  price: string;
  discount: number;
  description: string | null;
  sort_order: number;
  feature_access: number;
  features: string[] | string | null; // Can be an array, string (JSON), or null
  popular: boolean;
  category_name: string;
}

// Define the type for the API response
interface PricingApiResponse {
  status: boolean;
  data: PricingPlan[];
}

const Pricing = () => {
  const [category, setCategory] = useState<string>(""); 
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]); 
  const [categories, setCategories] = useState<string[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        // Fetch pricing plans from the backend
        const response = await axios.get<PricingApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/pricing`
        );

        const plans = response.data.data.map((plan) => ({
          ...plan,
          // Assign static Stripe price IDs to each plan
          stripe_price_id: getStaticStripePriceId(plan.name),
          features: typeof plan.features === "string"
            ? JSON.parse(plan.features)
            : Array.isArray(plan.features)
            ? plan.features
            : [],
          popular: !!plan.popular,
        }));

        setPricingPlans(plans);

        // Extract unique categories from the plans
        const uniqueCategories = Array.from(new Set(plans.map((plan) => plan.category_name)));
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setCategory(uniqueCategories[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  // Map plan names to static Stripe price IDs
  const getStaticStripePriceId = (planName: string) => {
    console.log("Checking plan:", planName); // Debugging log for the plan name
    switch (planName) {
      case 'Basic Plan':
        return 'price_1Q8cKASALL6oCDIiz3rlJIqv'; // Your static Stripe price ID
      case 'Pro Plan':
        return 'price_1Q8cKASALL6oCDIiz3rlJIqv'; // Replace with actual Stripe price ID
      case 'Enterprise Plan':
        return 'price_1Q8cKASALL6oCDIiz3rlJIqv'; // Replace with actual Stripe price ID
      default:
        return ''; // Fallback for unknown plans
    }
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // Filter plans based on the selected category
  const filteredPlans = pricingPlans.filter(
    (plan) => plan.category_name === category
  );

  return (
    <section className="relative z-10 overflow-hidden bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-sm mx-auto">
          <label
            htmlFor="category"
            className="text-lg w-full mb-2 block font-medium text-gray-700 text-center"
          >
            Choose Category:
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleCategoryChange}
            className="py-3 px-4 block border border-gray-300 w-full rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((categoryName, index) => (
              <option key={index} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan, index) => {
                console.log("Rendering pricing card with priceId:", plan.stripe_price_id); // Debugging log for the price ID
                return (
                  <PricingCard
                    key={index}
                    title={plan.name}
                    price={`$${plan.price}`}
                    priceId={plan.stripe_price_id} // Pass the priceId directly from the plan
                    features={Array.isArray(plan.features) ? plan.features : []}
                    buttonLabel="Subscribe Now"
                    popular={plan.popular}
                  />
                );
              })
            ) : (
              <NoData message="No pricing plans available for this category." />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
