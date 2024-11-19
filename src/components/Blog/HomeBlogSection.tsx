"use client"; // Use client-side features

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import Link from "next/link";
import NoData from "../Common/NoData";

// Define BlogPost type
type BlogPost = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

// Define the metadata type for section title and button
interface ResourceData {
  title: string;
  button_text: string;
  button_link: string;
}

// Define the props type for HomeBlogSection (Optional if passing props)
interface HomeBlogSectionProps {}

// Define the HomeBlogSection component
const HomeBlogSection = ({}: HomeBlogSectionProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]); // State to store blog posts
  const [resourceData, setResourceData] = useState<ResourceData | null>(null); // State to store section metadata
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the latest blog posts and resource data from the API using Axios
  useEffect(() => {
    const fetchPostsAndResourceData = async () => {
      try {
        // Fetch blog posts using the environment variable
        const postsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/latest-resources`);
        if (postsResponse.data.status && postsResponse.data.data) {
          const fetchedPosts = postsResponse.data.data.map((item: any) => ({
            title: item.title,
            coverImage: item.image, // Assuming 'image' is the field in the API
            excerpt: item.short_description, // Assuming 'short_description' is the field
            date: item.created_at, // Assuming 'created_at' is the field
            slug: item.slug,
          }));
          setPosts(fetchedPosts);
        } else {
          setError("Failed to fetch blog posts.");
        }

        // Fetch resource metadata (title, button text, button link) using the environment variable
        const resourceResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resource-data`);
        if (resourceResponse.data.status && resourceResponse.data.data) {
          setResourceData(resourceResponse.data.data);
        } else {
          setError("Failed to fetch resource data.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndResourceData();
  }, []);

  return (
    <section className="bg-dark/10 pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-[60px]">
          {/* Use dynamic section title */}
          <SectionTitle title={resourceData?.title || "Resources"} align="center" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-center w-full text-lg text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center w-full text-lg text-red-600">{error}</p>
          ) : posts.length > 0 ? (
            posts.map((blog, i) => (
              <SingleBlog blog={blog} key={i} />
            ))
          ) : (
            <NoData message="No blog posts available" />
          )}
        </div>

        {/* More Resources Button */}
        {posts.length > 0 && (
          <div className="text-center capitalize mt-8">
            <Link href={resourceData?.button_link || "/knowledge-hub"}>
              <span className="primary-button">
                {resourceData?.button_text || "More Resources"}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlogSection;
