// components/Pricing.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NoData from "../Common/NoData";
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
    customer_id: string | null; // Include customer_id in the response
  };
}

const Pricing = () => {
  const [category, setCategory] = useState<string>("");
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null); // State for customer_id
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // New state for authentication

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const jwtToken = Cookies.get("jwt");
        if (jwtToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

        const response = await axios.get<PricingApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/pricing`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.data.status) {
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

          const uniqueCategories = Array.from(new Set(plans.map((plan) => plan.category_name)));
          setCategories(uniqueCategories);

          if (uniqueCategories.length > 0) {
            setCategory(uniqueCategories[0]);
          }
        } else {
          console.error("API returned unsuccessful status.");
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

  const filteredPlans = pricingPlans.filter((plan) => plan.category_name === category);

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
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                title={plan.name}
                price={plan.price}
                features={Array.isArray(plan.features) ? plan.features : []}
                buttonLabel={isAuthenticated ? "Get Started" : "Pay Now"}
                buttonLink={isAuthenticated ? "" : "/signin"} // Navigate to login if not authenticated
                popular={plan.popular}
                priceId={plan.stripe_price_id}
                priceType={plan.price_type}
                customerId={customerId}
                isAuthenticated={isAuthenticated} // Pass authentication state
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-10">
            <NoData message="No pricing plans available for this category." />
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
