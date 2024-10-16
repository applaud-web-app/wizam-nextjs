// components/Pricing.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NoData from "../Common/NoData";
import { loadStripe } from "@stripe/stripe-js";
import PricingCard from "./pricingcard";
import Cookies from "js-cookie";

interface PricingPlan {
  id: number;
  name: string;
  price_type: string;
  duration: number;
  price: string;
  discount: number;
  description: string | null;
  sort_order: number;
  feature_access: number;
  features: string[] | string | null;
  popular: boolean;
  category_name: string;
  stripe_product_id: string;
  stripe_price_id: string;
}

interface PricingApiResponse {
  status: boolean;
  data: {
    pricing: PricingPlan[];
    customer_id: string; // Include customer_id in the response
  };
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Pricing = () => {
  const [category, setCategory] = useState<string>(""); 
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]); 
  const [categories, setCategories] = useState<string[]>([]); 
  const [customerId, setCustomerId] = useState<string>(""); // New state for customer_id
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await axios.get<PricingApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/pricing`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        const plans = response.data.data.pricing.map((plan) => ({
          ...plan,
          features:
            typeof plan.features === "string"
              ? JSON.parse(plan.features)
              : Array.isArray(plan.features)
              ? plan.features
              : [], 
          popular: !!plan.popular,
        }));

        setPricingPlans(plans);
        setCustomerId(response.data.data.customer_id); // Set the customer_id from the response
        console.log(customerId);
        const uniqueCategories = Array.from(
          new Set(plans.map((plan) => plan.category_name))
        );
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

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
              filteredPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.name}
                  price={plan.price}
                  features={Array.isArray(plan.features) ? plan.features : []}
                  buttonLabel="Get Started"
                  buttonLink="/signup"
                  popular={plan.popular}
                  priceId={plan.stripe_price_id} // Dynamic priceId
                  priceType={plan.price_type} // Use price_type to determine fixed or monthly
                  customerId={customerId} // Pass customer_id to the PricingCard
                />
              ))
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
