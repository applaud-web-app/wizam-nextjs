import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface SiteSettings {
  site_logo: string;
  light_site_logo: string;
  favicon: string;
  site_name: string;
  tag_line: string;
  description: string;
  copyright: string;
  address: string;
  number: string;
  email: string;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  twitter: string | null;
}

interface SiteContextProps {
  siteSettings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

// Create the context with a default value
const SiteContext = createContext<SiteContextProps>({
  siteSettings: null,
  loading: true,
  error: null,
});

// Create a hook to access the site context easily
export const useSiteSettings = () => useContext(SiteContext);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the site settings when the component mounts
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/site-setting`);
        if (response.data.status) {
          setSiteSettings(response.data.data);
        } else {
          setError("Failed to fetch site settings");
        }
      } catch (err) {
        setError("Error fetching site settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  // Provide the fetched data via the SiteContext
  return (
    <SiteContext.Provider value={{ siteSettings, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
};
