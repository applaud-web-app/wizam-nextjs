import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "../Common/SectionTitle";
import { FaArrowRight, FaBook, FaChalkboardTeacher, FaVideo, FaTasks, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";
import NoData from "../Common/NoData";
import { useSiteSettings } from "@/context/SiteContext"; // Import the context
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";

// Define the Pricing Plan type for the API data
type PricingPlan = {
  id: number;
  name: string;
  price_type: string;
  duration: number;
  price: string;
  discount: number;
  description: string;
  exam_names: string[] | null;
  lesson_names: string[] | null;
  practice_names: string[] | null;
  video_names: string[] | null;
  quiz_names: string[] | null;
  popular: boolean;
  category_name: string;
  stripe_product_id: string;
  stripe_price_id: string;
};

type SectionData = {
  title: string;
  button_text: string;
  button_link: string;
};


// Load Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PopularExam = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]); // State to store pricing plans
  const [sectionData, setSectionData] = useState<SectionData | null>(null); // State to store section data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();
  const { siteSettings } = useSiteSettings(); // Access site settings from SiteContext

  // Fetch the pricing plans and section data from the API using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pricing plans and section data concurrently
        const [pricingResponse, sectionResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/popular-pricing`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/popular-exam-data`),
        ]);

       
        if (pricingResponse.data.status && pricingResponse.data.data) {
          const allPricingPlans = pricingResponse.data.data.pricing;
          setPricingPlans(allPricingPlans);
        } else {
          setError("Failed to fetch pricing plans.");
        }

        if (sectionResponse.data.status && sectionResponse.data.data) {
          setSectionData(sectionResponse.data.data);
        } else {
          setError("Failed to fetch section data.");
        }
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async (priceId:any,priceType:any) => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe.js has not loaded yet.");
      alert("Failed to load Stripe. Please try again later.");
      return;
    }

    const successUrl = '/dashboard';

    try {
      // Send the POST request to create a checkout session
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          priceId,
          priceType,
          successUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      // Check if the response indicates success
      if (response.status !== 200) {
        console.error("Error during checkout:", response.data);
        alert(`Failed to initiate checkout: ${response.data.error}`);
        return;
      }

      const { sessionId } = response.data;

      if (!sessionId) {
        throw new Error("Failed to create session ID.");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to checkout. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      alert(error?.response?.data?.error || "Failed to initiate checkout. Please try again.");
    }
  };

  const handleClick = (priceId:any,planType:any) => {
    const isAuthenticated = Cookies.get("jwt");
    if (isAuthenticated) {
      handleCheckout(priceId,planType);
    } else {
      Cookies.set("plan_id", priceId);
      Cookies.set("priceType", planType);
      router.push("/register");
    }
  };

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        {/* Section Title */}
        {sectionData && (
          <SectionTitle title={sectionData.title} align="center" />
        )}

        {/* Content Area */}
        {loading ? (
          // Display skeleton loader while loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
          </div>
        ) : error ? (
          // Display error message
          <p className="text-center w-full text-lg text-red-600">{error}</p>
        ) : pricingPlans.length > 0 ? (
          // Grid Layout for Pricing Cards
          <div className="grid grid-cols-1 gap-5">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className="relative flex flex-col md:flex-row bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Left Section */}
                <div className="flex-shrink-0 bg-tertiary text-white p-6 md:p-8 flex flex-col justify-center items-center w-full md:w-1/3">
                  <h3 className="text-lg md:text-2xl font-bold mb-3">{plan.name}</h3>
                  <p className="text-3xl md:text-4xl font-extrabold mb-3">
                    {siteSettings?.currency_symbol || "£"}
                    {Number(plan.price).toFixed(2)}
                  </p>
                  <p className="text-sm md:text-lg">
                    {plan.price_type === "monthly" ? "Per Month" : "One-Time Payment"}
                  </p>
                </div>

                {/* Right Section */}
                <div className="flex-grow p-4 md:p-6 space-y-4">
                  {/* Description */}
                  {plan.description && (
                    <div className="mb-2 md:mb-4">
                      <p className="text-xs md:text-sm text-gray-600">{plan.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {Array.isArray(plan.exam_names) && plan.exam_names.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                          <FaBook className="text-blue-500 mr-2" />
                          Exams ({plan.exam_names.length})
                        </h4>
                        <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
                          {plan.exam_names.map((exam, index) => (
                            <li key={index}>{exam}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(plan.lesson_names) && plan.lesson_names.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                          <FaChalkboardTeacher className="text-green-500 mr-2" />
                          Lessons ({plan.lesson_names.length})
                        </h4>
                        <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
                          {plan.lesson_names.map((lesson, index) => (
                            <li key={index}>{lesson}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(plan.video_names) && plan.video_names.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                          <FaVideo className="text-red-500 mr-2" />
                          Videos ({plan.video_names.length})
                        </h4>
                        <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
                          {plan.video_names.map((video, index) => (
                            <li key={index}>{video}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(plan.practice_names) && plan.practice_names.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                          <FaTasks className="text-purple-500 mr-2" />
                          Practice Sets ({plan.practice_names.length})
                        </h4>
                        <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
                          {plan.practice_names.map((practice, index) => (
                            <li key={index}>{practice}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(plan.quiz_names) && plan.quiz_names.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-gray-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                          <FaQuestionCircle className="text-indigo-500 mr-2" />
                          Quizzes ({plan.quiz_names.length})
                        </h4>
                        <ul className="text-gray-600 text-xs md:text-sm list-disc list-inside">
                          {plan.quiz_names.map((quiz, index) => (
                            <li key={index}>{quiz}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <div>
                      <button onClick={()=>{handleClick(plan.stripe_price_id,plan.price_type)}}
                        className="mt-4 w-full py-2 md:py-3 text-secondary bg-primary rounded-md text-sm md:text-base font-semibold hover:bg-primary-dark transition-colors"
                      >
                        Get Started
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No pricing plans available
          <div className="flex justify-center items-center py-8">
            <NoData message="No pricing plans available" />
          </div>
        )}

        {/* More Plans Button */}
        {pricingPlans.length > 0 && sectionData && (
          <div className="text-center mt-8">
            <Link href={sectionData.button_link}>
              <span className="primary-button">{sectionData.button_text}</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularExam;
