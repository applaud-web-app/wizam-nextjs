"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const HelpArea = () => {
  const [activeTab, setActiveTab] = useState("");
  const [tabsData, setTabsData] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");

  // Fetch help data from API
  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/help-data`);
        if (response.data.status) {
          const enabledTabs = response.data.data.data.filter((tab: any) => tab.status === "1"); // Only include tabs with status '1'
          setTabsData(enabledTabs);
          setTitle(response.data.data.title);
          if (enabledTabs.length > 0) {
            setActiveTab(enabledTabs[0].title); // Set the first enabled tab as active by default
          }
        }
      } catch (error) {
        console.error("Error fetching help data:", error);
      }
    };

    fetchHelpData();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[#ecf3fc] py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto">
          {/* Main Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className=" text-3xl sm:text-4xl lg:text-5xl font-bold text-tertiary leading-snug sm:leading-snug lg:leading-tight">
              {title}
            </h2>
          </div>

          {/* Layout with Tabs and Content */}
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0">
            {/* Sidebar Tabs with Title and Description */}
            <div className="w-full lg:w-2/6 space-y-4">
              {tabsData.map((tab) => (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(tab.title)}
                  className={`block w-full text-left px-8 py-4 text-secondary text-lg transition-all duration-200 ${
                    activeTab === tab.title ? "bg-primary " : "bg-white "
                  } rounded-lg hover:bg-primary/20`}
                >
                  <div>
                    <h3 className="font-bold text-2xl">{tab.title}</h3>
                    <p className="mt-1 text-base">{tab.description.substring(0, 120)}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-4/6 mt-8 lg:mt-0 p-5 lg:p-12 bg-[#DFECF8] rounded-lg ">
              {tabsData.map(
                (tab) =>
                  activeTab === tab.title && (
                    <div key={tab.title}>
                      {/* Image for Each Tab */}
                      <Image src={tab.image} alt={tab.title} width={300} height={300} className="mx-auto mb-5" />
                      <h2 className="text-3xl text-secondary font-bold mb-4">{tab.title}</h2>
                      <p className="mt-4 text-secondary">{tab.description}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#DFECF8] py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-lg text-center flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Image
              src="/images/approved.png"
              alt="Verified Badge"
              width={64}
              height={64}
              className="flex-shrink-0"
            />
            <p className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold text-secondary">
              Verified Questions by Top Schools for Best Quality
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HelpArea;
