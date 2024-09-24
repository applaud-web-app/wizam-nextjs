"use client";

import Image from "next/image";
import { useState, FC } from "react";
import SectionTitle from "../Common/SectionTitle";


interface AccordionItemProps {
  header: string;
  text: string;
  count: number;
}

const AccordionItem: FC<AccordionItemProps> = ({ header, text, count }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div className="mb-5 w-full rounded-lg bg-white p-4 border   sm:p-5 lg:px-6 xl:px-6">
      <button
        className="faq-btn flex w-full justify-between items-center text-left"
        onClick={handleToggle}
        aria-expanded={active}
      >
        <div className="flex items-center">
          {/* Count */}
          <div className="mr-3 text-lg font-semibold text-gray-600">{count}.</div>
          
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

      <div
        className={` duration-200 ease-in-out ${
          active ? "block" : "hidden"
        }`}
      >
        <p className="py-3 text-base leading-relaxed text-body-color dark:text-dark-6">
          {text}
        </p>
      </div>
    </div>
  );
};

const Faq = () => {
  return (
    <section className="relative   bg-[#ebf5fa] pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[140px]">
      <div className="container">
        {/* Section Title */}
      

        <SectionTitle 
          title="Frequently Asked Questions" 
         
          align="center" 
        />


     
          <div className="w-full max-w-[768px] mx-auto">
            <AccordionItem
              header="How long does it take to get my first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes in-depth research and the creation of your monthly content marketing strategy before writing your first blog post."
              count={1} // Count for this FAQ
            />
            <AccordionItem
              header="What is included in the service?"
              text="We include everything you need to succeed: custom research, blog writing, content strategy, and regular updates to ensure your content stays relevant."
              count={2} // Count for this FAQ
            />
            <AccordionItem
              header="How do I track my progress?"
              text="We provide detailed analytics and reporting tools to track your progress, helping you understand how your content performs and which areas need improvement."
              count={3} // Count for this FAQ
            />
        
            <AccordionItem
              header="Can I cancel my subscription at any time?"
              text="Yes, you can cancel your subscription at any time with no penalties. We want you to be happy with our service and aim to keep everything flexible."
              count={4} // Count for this FAQ
            />
            <AccordionItem
              header="Do you provide content updates?"
              text="Yes, we constantly monitor and update your content to ensure it's always fresh and relevant to your audience. Our team works to keep your strategy aligned with your goals."
              count={5} // Count for this FAQ
            />
            <AccordionItem
              header="Do you offer customer support?"
              text="Absolutely! We offer 24/7 customer support to assist you with any questions or concerns you might have throughout the process."
              count={6} // Count for this FAQ
            />
          </div>
           {/* More Exams Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 rounded-full bg-primary text-white font-medium transition hover:bg-primary-dark">
            More FAQs
          </button>
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
