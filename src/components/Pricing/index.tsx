"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import PricingCard from "./pricingcard";
import NoData from "../Common/NoData";

// Define types for the pricing plan
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
  const [category, setCategory] = useState<string>(""); // State to track selected category
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]); // State to store pricing plans
  const [categories, setCategories] = useState<string[]>([]); // State to store dynamic categories
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading

  // Fetch pricing data from API
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await axios.get<PricingApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/pricing`
        );

        const plans = response.data.data.map((plan) => ({
          ...plan,
          // Parse the JSON features if it's a string
          features: typeof plan.features === "string"
            ? JSON.parse(plan.features)
            : Array.isArray(plan.features)
            ? plan.features
            : [], // Fallback to empty array if null or invalid type
          popular: !!plan.popular, // Convert number to boolean
        }));

        setPricingPlans(plans);

        // Extract unique categories from the plans
        const uniqueCategories = Array.from(new Set(plans.map((plan) => plan.category_name)));
        setCategories(uniqueCategories);

        // Set the first category as the default selected category
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

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // Filter pricing plans based on the selected category
  const filteredPlans = pricingPlans.filter(
    (plan) => plan.category_name === category
  );

  return (
    <section className="relative z-10 overflow-hidden bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Category Dropdown */}
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

        {/* Pricing Cards */}
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
                  price={`$${plan.price}`}
                  // Ensure features is always an array
                  features={Array.isArray(plan.features) ? plan.features : []}
                  buttonLabel="Get Started"
                  buttonLink="/signup"
                  popular={plan.popular}
                />
              ))
            ) : (
              <NoData message=" No pricing plans available for this category."/>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
