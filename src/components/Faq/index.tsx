"use client";

import Image from "next/image";
import { useState, useEffect, FC } from "react";
import axios from "axios";
import SectionTitle from "../Common/SectionTitle";
import Link from "next/link";
import Loader from "../Common/Loader";
import NoData from "../Common/NoData";

interface AccordionItemProps {
  header: string;
  text: string;
}

const AccordionItem: FC<AccordionItemProps> = ({ header, text }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div className="mb-5 w-full rounded-lg bg-white p-4 border sm:p-5 lg:px-6 xl:px-6">
      <button
        className="faq-btn flex w-full justify-between items-center text-left"
        onClick={handleToggle}
        aria-expanded={active}
      >
        <div className="flex items-center">
          {/* FAQ Header */}
          <h4 className="mt-1 text-lg font-semibold text-dark dark:text-white">
            {header}
          </h4>
        </div>

        {/* Arrow Icon */}
        <div className="flex items-center">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out ${
              active ? "rotate-180" : ""
            }`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>
      </button>

      <div className={`duration-200 ease-in-out ${active ? "block" : "hidden"}`}>
        <p className="py-3 text-base leading-relaxed text-body-color dark:text-dark-6">
          {text}
        </p>
      </div>
    </div>
  );
};

// Define the structure of the FAQ data from the API
interface FaqData {
  question: string;
  answer: string;
}

interface FaqMetaData {
  title: string;
  button_text: string;
  button_link: string | null;
}

const Faq = () => {
  const [faqs, setFaqs] = useState<FaqData[]>([]); // State to store fetched FAQs
  const [faqMeta, setFaqMeta] = useState<FaqMetaData | null>(null); // State to store section title, button text, and link
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        // Fetch FAQs
        const faqResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faq`);
        if (faqResponse.data.status && faqResponse.data.data) {
          setFaqs(faqResponse.data.data);
        } else {
          setError("Failed to load FAQs.");
        }

        // Fetch FAQ metadata (title, button text, button link)
        const faqMetaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faq-data`);
        if (faqMetaResponse.data.status && faqMetaResponse.data.data) {
          setFaqMeta(faqMetaResponse.data.data);
        } else {
          setError("Failed to load FAQ section metadata.");
        }
      } catch (error) {
        setError("An error occurred while fetching FAQs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  return (
    <section className="relative bg-[#ebf5fa] pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[140px]">
      <div className="container">
        {/* Section Title */}
        <SectionTitle title={faqMeta?.title || "Frequently Asked Questions"} align="center" />

        <div className="w-full max-w-[768px] mx-auto">
          {loading ? (
            <Loader /> // Loader component
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : faqs.length > 0 ? (
            // Slice to show only the first 5 FAQs
            faqs.slice(0, 5).map((faq, index) => (
              <AccordionItem key={index} header={faq.question} text={faq.answer} />
            ))
          ) : (
            <NoData message="No FAQs available" />
          )}
        </div>

        {/* More FAQs Button */}
        <div className="text-center mt-8">
          <Link href={faqMeta?.button_link || "/faq"}>
            <span className="primary-btn">
              {faqMeta?.button_text || "More FAQs"}
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative Image */}
      <div className="absolute -top-8 left-0 right-0 w-full z-10">
        <Image
          src="/images/faq-vector.png"
          alt="decorative vector"
          className="mx-auto w-full"
          width={1920}
          height={300}
        />
      </div>
    </section>
  );
};

export default Faq;
