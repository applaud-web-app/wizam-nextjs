"use client";
import { useState } from "react";
import PricingCard from "./pricingcard";

// Define types for the pricing plan
interface PricingPlan {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  popular?: boolean;
}

const Pricing = () => {
  const [category, setCategory] = useState<string>("monthly"); // State to track selected category

  // Define pricing plans for both monthly and yearly categories
  const pricingPlans: Record<string, PricingPlan[]> = {
    monthly: [
      {
        title: "Basic Plan",
        price: "$9",
        features: ["1 Project", "5 Team Members", "5 GB Storage", "Email Support"],
        buttonLabel: "Get Started",
        buttonLink: "/signup",
      },
      {
        title: "Pro Plan",
        price: "$29",
        features: [
          "10 Projects",
          "Unlimited Team Members",
          "100 GB Storage",
          "Priority Support",
        ],
        buttonLabel: "Get Started",
        buttonLink: "/signup",
        popular: true, // Mark as most popular
      },
      {
        title: "Enterprise Plan",
        price: "$99",
        features: [
          "Unlimited Projects",
          "Unlimited Team Members",
          "1 TB Storage",
          "24/7 Support",
        ],
        buttonLabel: "Contact Us",
        buttonLink: "/contact",
      },
    ],
    yearly: [
      {
        title: "Basic Plan",
        price: "$90",
        features: ["1 Project", "5 Team Members", "50 GB Storage", "Email Support"],
        buttonLabel: "Get Started",
        buttonLink: "/signup",
      },
      {
        title: "Pro Plan",
        price: "$290",
        features: [
          "10 Projects",
          "Unlimited Team Members",
          "1 TB Storage",
          "Priority Support",
        ],
        buttonLabel: "Get Started",
        buttonLink: "/signup",
        popular: true, // Mark as most popular
      },
      {
        title: "Enterprise Plan",
        price: "$999",
        features: [
          "Unlimited Projects",
          "Unlimited Team Members",
          "5 TB Storage",
          "24/7 Priority Support",
        ],
        buttonLabel: "Contact Us",
        buttonLink: "/contact",
      },
    ],
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  return (
    <section className="relative z-10 overflow-hidden bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Choose the plan that fits your needs.
          </p>
        </div>

        {/* Category Dropdown */}
        <div className="mb-10 max-w-xs mx-auto">
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
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans[category].map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              buttonLabel={plan.buttonLabel}
              buttonLink={plan.buttonLink}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;