"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleBlog from "./SingleBlog";
import Loader from "../Common/Loader";

// Type definition for the Blog structure
type Blog = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

// Blog component to display the list of blogs
const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]); // State to store fetched blogs
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch blogs from the Laravel API using axios
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resource`);

        if (response.data.status) {
          // Map API response data to the structure required for SingleBlog
          const mappedBlogs = response.data.data.map((item: any) => ({
            title: item.title,
            coverImage: item.image, // Use the image URL directly from API
            excerpt: item.short_description,
            date: item.created_at,
            slug: item.slug,
          }));

          setBlogs(mappedBlogs);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("An error occurred while fetching the blogs.");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchBlogs();
  }, []);

  // Loading or Error handling
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
      <div className="container">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <SingleBlog key={i} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
