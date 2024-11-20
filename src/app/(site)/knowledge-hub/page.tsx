"use client";

import React, { useEffect } from "react";
import { useSeo } from "@/context/SeoContext";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Blog from "@/components/Blog";
import PreLoader from "@/components/Common/PreLoader";

const KnowledgeHubPage = () => {
  const { seoData, loading, error } = useSeo();

  useEffect(() => {
    if (!loading && !error && seoData) {
      // Get the SEO data for the Blog page
      const currentSeo = seoData["resources"] || seoData["home"]; // Fallback to home SEO data if not found

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
  }, [seoData, loading, error]);

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading SEO data: {error}</div>;
  }

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb pageName="Knowledge Hub" />

      {/* Blog section */}
      <Blog />
    </>
  );
};

export default KnowledgeHubPage;