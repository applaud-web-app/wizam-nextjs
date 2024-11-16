"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


export interface SeoDataItem {
  title: string;
  description: string;
  keyword: string;
  image: string;
}

export interface SeoData {
  home: SeoDataItem;
  about: SeoDataItem;
  contact: SeoDataItem;
  exams: SeoDataItem;
  pricing: SeoDataItem;
  resources: SeoDataItem;
  faq: SeoDataItem;
} 

export interface SeoApiResponse {
  status: boolean;
  data: SeoData;
}

interface SeoContextProps {
  seoData: SeoData | null;
  loading: boolean;
  error: string | null;
}

const SeoContext = createContext<SeoContextProps>({
  seoData: null,
  loading: true,
  error: null,
});

export const useSeo = () => useContext(SeoContext);

export const SeoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seoData, setSeoData] = useState<SeoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await axios.get<SeoApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/site-seo`);
        if (response.data.status) {
          setSeoData(response.data.data);
        } else {
          setError("Failed to fetch SEO data");
        }
      } catch (err) {
        setError("Error fetching SEO data");
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, []);

  return (
    <SeoContext.Provider value={{ seoData, loading, error }}>
      {children}
    </SeoContext.Provider>
  );
};
