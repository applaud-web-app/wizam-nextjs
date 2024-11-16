"use client";

import React, { useEffect } from "react";
import { useSeo } from "@/context/SeoContext";
import PreLoader from "@/components/Common/PreLoader";
import BannerSection from "@/components/BannerSection";
import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import ScrollUp from "@/components/Common/ScrollUp";
import Faq from "@/components/Faq";
import HelpArea from "@/components/HelpArea";
import PopularExams from "@/components/PopularExam";
import WhyChoose from "@/components/WhyChoose";
import { usePathname } from "next/navigation";

export default function Home() {
  const { seoData, loading, error } = useSeo();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !error && seoData) {
      // Determine the current page key based on the pathname
      const pageKey = pathname === "/" ? "home" : pathname.substring(1);
      const currentSeo = seoData[pageKey as keyof typeof seoData] || seoData["home"]; // Fallback to home if not found

      // Set document title
      document.title = currentSeo.title;

      // Function to set or create meta tag
      const setMetaTag = (name: string, content: string, property = false) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let metaTag = document.querySelector(selector) as HTMLMetaElement | null;
        if (metaTag) {
          metaTag.content = content;
        } else {
          metaTag = document.createElement("meta");
          if (property) {
            metaTag.setAttribute("property", name);
          } else {
            metaTag.setAttribute("name", name);
          }
          metaTag.content = content;
          document.head.appendChild(metaTag);
        }
      };

      // Set meta description
      setMetaTag("description", currentSeo.description);

      // Set meta keywords
      setMetaTag("keywords", currentSeo.keyword);

      // Set Open Graph meta tags 
      setMetaTag("og:title", currentSeo.title, true);
      setMetaTag("og:description", currentSeo.description, true);
      setMetaTag("og:image", currentSeo.image, true);
      setMetaTag("og:url", window.location.href, true);

      // Set Twitter Card meta tags
      setMetaTag("twitter:card", "summary_large_image");
      setMetaTag("twitter:title", currentSeo.title);
      setMetaTag("twitter:description", currentSeo.description);
      setMetaTag("twitter:image", currentSeo.image);
    }
  }, [seoData, loading, error, pathname]);

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading SEO data: {error}</div>;
  }

  return (
    <main>
      <ScrollUp />
      <BannerSection />
      <HelpArea />
      <PopularExams />
      <WhyChoose />
      <Faq />
      <HomeBlogSection />
      <CallToAction />
    </main>
  );
}
