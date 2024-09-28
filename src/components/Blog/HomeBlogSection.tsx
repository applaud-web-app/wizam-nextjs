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

// Define the props type for HomeBlogSection (Optional if passing props)
interface HomeBlogSectionProps {}

// Define the HomeBlogSection component
const HomeBlogSection = ({}: HomeBlogSectionProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]); // State to store blog posts
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the latest blog posts from the API using Axios
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://wizam.awmtab.in/api/latest-resources");
        if (response.data.status && response.data.data) {
          // Assuming the API returns a list of posts in response.data.data
          const fetchedPosts = response.data.data.map((item: any) => ({
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
      } catch (error) {
        setError("An error occurred while fetching the blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-[60px]">
          <SectionTitle title="Resources" align="center" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-center w-full text-lg text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center w-full text-lg text-red-600">{error}</p>
          ) : posts.length > 0 ? (
            // Display all blog posts, not just the first 3
            posts.map((blog, i) => (
                <SingleBlog blog={blog} key={i} />
             
            ))
          ) : (
            <NoData message="No blog posts available" />
          )}
        </div>

        {/* More Resources Button */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/blog">
              <span className="px-6 py-3 rounded-full bg-primary text-white font-medium transition hover:bg-primary-dark">
                More Resources
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlogSection;
