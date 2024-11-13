// app/[slug]/page.tsx
import axios from "axios";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientContent from "@/Components/ClientContent"; // Client-side component
import Breadcrumb from "@/Components/Common/Breadcrumb";

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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${slug}`);
    const { data } = response;

    if (data.status && data.data) {
      const { meta_title, meta_description, meta_keywords } = data.data;

      return {
        title: meta_title || "Wizam",
        description: meta_description || "Default description",
        keywords: meta_keywords ? meta_keywords.split(",") : ["default", "keywords"],
      };
    }

    return {
      title: "Page Not Found - Wizam",
      description: "The page you are looking for does not exist.",
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Pages - Wizam",
      description: "An error occurred while fetching metadata.",
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
      notFound();
    }

    const page: PageData = data.data;

    return (
      <>
      <Breadcrumb pageName={page.title} />
      <ClientContent title={page.title} description={page.description} />
      </>
    );
  } catch (error) {
    console.error("Error fetching page data:", error);
    notFound(); // Show 404 page if error occurs
  }
}
