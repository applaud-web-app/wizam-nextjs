// components/Pricing.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NoData from "../Common/NoData";
import PricingCard from "./pricingcard";
import Cookies from "js-cookie";
import PricingCardNew from "./pricingcardnew";

interface PricingPlan {
  id: number;
  name: string;
  price_type: string;
  duration: number;
  price: string;
  discount: number;
  description: string | null;
  sort_order: number;
  popular: boolean;
  category_name: string;
  stripe_product_id: string;
  stripe_price_id: string;
  exam_names: string[];
  quiz_names: string[];
  lesson_names: string[];
  practice_names: string[];
  video_names: string[];
}

interface PricingApiResponse {
  status: boolean;
  data: {
    pricing: PricingPlan[];
    customer_id: string | null;
  };
}

const Pricing = () => {
  const [category, setCategory] = useState<string>("");
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
            popular: !!plan.popular,
            // Ensure all feature names are arrays
            exam_names: Array.isArray(plan.exam_names) ? plan.exam_names : [],
            quiz_names: Array.isArray(plan.quiz_names) ? plan.quiz_names : [],
            lesson_names: Array.isArray(plan.lesson_names) ? plan.lesson_names : [],
            practice_names: Array.isArray(plan.practice_names) ? plan.practice_names : [],
            video_names: Array.isArray(plan.video_names) ? plan.video_names : [],
          }));

          setPricingPlans(plans);
          setCustomerId(response.data.data.customer_id);

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
          <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-5">
            {filteredPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                title={plan.name}
                price={plan.price}
                examNames={plan.exam_names}
                quizNames={plan.quiz_names}
                description={plan.description} 
                lessonNames={plan.lesson_names}
                practiceNames={plan.practice_names}
                videoNames={plan.video_names}
                buttonLabel={isAuthenticated ? "Get Started" : "Pay Now"}
                buttonLink={isAuthenticated ? "" : "/register"}
                popular={plan.popular}
                priceId={plan.stripe_price_id}
                priceType={plan.price_type}
                customerId={customerId}
                isAuthenticated={isAuthenticated} />
            ))}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
            {filteredPlans.map((plan) => (
              <PricingCardNew
                key={plan.id}
                title={plan.name}
                price={plan.price}
                examNames={plan.exam_names}
                quizNames={plan.quiz_names}
                description={plan.description} 
                lessonNames={plan.lesson_names}
                practiceNames={plan.practice_names}
                videoNames={plan.video_names}
                buttonLabel={isAuthenticated ? "Get Started" : "Pay Now"}
                buttonLink={isAuthenticated ? "" : "/register"}
                popular={plan.popular}
                priceId={plan.stripe_price_id}
                priceType={plan.price_type}
                customerId={customerId}
                isAuthenticated={isAuthenticated} />
            ))}
          </div> */}
          </>
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
