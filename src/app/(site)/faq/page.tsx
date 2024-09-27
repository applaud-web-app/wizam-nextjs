"use client";

import { FC, useState, useRef, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CallToAction from "@/components/CallToAction";
import NoData from "@/components/Common/NoData";
import Loader from "@/components/Common/Loader";
import { IoSearchSharp } from "react-icons/io5"; // Import the search icon


// Accordion Component for FAQs
interface AccordionItemProps {
  header: string;
  text: string;
}

const AccordionItem: FC<AccordionItemProps> = ({ header, text }) => {
  const [active, setActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  const handleToggle = () => {
    setActive(!active);
    if (contentRef.current) {
      setHeight(active ? "0px" : `${contentRef.current.scrollHeight}px`);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(active ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [active]);

  return (
    <div className="mb-5 w-full rounded-lg bg-white p-4 border sm:p-5 lg:px-6 xl:px-6">
      <button
        className="faq-btn flex w-full justify-between items-center text-left"
        onClick={handleToggle}
        aria-expanded={active}
      >
        <div className="flex items-center">
          <h4 className="mt-1 text-lg font-semibold text-dark dark:text-white">
            {header}
          </h4>
        </div>

        <div className="flex items-center">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out ${active ? "rotate-180" : ""}`}
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

      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className={`overflow-hidden transition-max-height duration-300 ease-in-out`}
      >
        <p className="py-3 text-base leading-relaxed text-body-color dark:text-dark-6">
          {text}
        </p>
      </div>
    </div>
  );
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]); // For filtered FAQs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  useEffect(() => {
    // Fetch data from the API using axios
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faq`);
        const { data } = response.data;
        
        if (Array.isArray(data)) {
          setFaqs(data);
          setFilteredFaqs(data); // Initially show all FAQs
        } else {
          throw new Error("API response is not an array");
        }
      } catch (error: any) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    // Filter FAQs based on the search query
    if (searchQuery === "") {
      setFilteredFaqs(faqs); // Show all FAQs if search query is empty
    } else {
      setFilteredFaqs(
        faqs.filter(faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, faqs]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
     <Breadcrumb pageName="Frequently Asked Questions" />

      <section className="relative py-16 dark:bg-dark">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8 relative w-full max-w-[768px] mx-auto">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <IoSearchSharp className="text-primary text-xl dark:text-gray-400" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="You can search by keywords or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              className="w-full pl-12 p-4 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-dark-2 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Accordion Section */}
          <div className="w-full max-w-[768px] mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  header={faq.question}
                  text={faq.answer}
                />
              ))
            ) : (
              <NoData message="No FAQs match your search." />
            )}
          </div>
        </div>
      </section>
      <CallToAction />
    </main>
  );
};

export default FAQPage;
