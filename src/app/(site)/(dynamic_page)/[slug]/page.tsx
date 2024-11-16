// app/[slug]/page.tsx
import axios from "axios";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientContent from "@/components/ClientContent"; // Client-side component
import Breadcrumb from "@/components/Common/Breadcrumb";

// Define the structure of the page data
interface PageData {
  title: string;
  description: string; // HTML string for the content
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

// Define the type for the `params` object
interface Params {
  slug: string;
}

// Function to generate metadata dynamically for SEO
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = params;

  try {
    // Fetch page metadata and content using Axios
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/page/${slug}`);
    const { data } = response;

    if (data.status && data.data) {
      const { meta_title, meta_description, meta_keywords } = data.data;

      // Generate dynamic metadata
      return {
        title: meta_title || "Wizam",
        description: meta_description
          ? meta_description.slice(0, 250) // Ensure description is within 250 characters
          : "Default description for Wizam",
        keywords: meta_keywords ? meta_keywords.split(",") : ["default", "keywords"],
        openGraph: {
          title: meta_title || "Wizam",
          description: meta_description || "Default description for Wizam",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: meta_title || "Wizam",
          description: meta_description || "Default description for Wizam",
        },
      };
    }

    return {
      title: "Page Not Found - Wizam",
      description: "The page you are looking for does not exist.",
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Error - Wizam",
      description: "An error occurred while fetching page metadata.",
    };
  }
}

// Main server-side dynamic page component
export default async function DynamicPage({ params }: { params: Params }) {
  const { slug } = params;

  try {
    // Fetch page data dynamically from the API based on the slug using Axios
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/page/${slug}`);

    if (!data.status || !data.data) {
      notFound(); // Show 404 page if the data is invalid
    }

    const page: PageData = data.data;

    return (
      <>
        {/* Breadcrumb navigation */}
        <Breadcrumb pageName={page.title} />

        {/* Dynamic Content */}
        <ClientContent title={page.title} description={page.description} />
      </>
    );
  } catch (error) {
    console.error("Error fetching page data:", error);
    notFound(); // Show 404 page if error occurs
  }
}
