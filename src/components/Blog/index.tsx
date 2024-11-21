"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import SingleBlog from "./SingleBlog";
import Loader from "../Common/Loader";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Type definitions
interface Category {
  id: number;
  name: string;
}

interface RecentPost {
  title: string;
  image: string | null;
  slug: string;
  created_at: string;
  category: Category | null;
}

interface ArchiveItem {
  year: number;
  count: number;
}

interface ApiResponse {
  status: boolean;
  data: any[]; // The array of blogs
  recent: RecentPost[];
  archive: ArchiveItem[];
}

// Type definition for the Blog structure
type Blog = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

// Blog component to display the list of blogs with pagination and sidebar
const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]); // State to store fetched blogs
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]); // State for recent posts
  const [archive, setArchive] = useState<ArchiveItem[]>([]); // State for archive data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const itemsPerPage = 10; // Number of items per page

  // Fetch blogs, recent posts, and archive from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/resource`
        );
  
        if (response.data.status) {
          // Check if the arrays exist before mapping
          const mappedBlogs = Array.isArray(response.data.data)
            ? response.data.data.map((item: any) => ({
                title: item.title || "Untitled",
                coverImage: item.image || "/default-image.jpg", // Fallback image
                excerpt: item.short_description || "",
                date: item.created_at || new Date().toISOString(),
                slug: item.slug || "#",
              }))
            : [];
  
          setBlogs(mappedBlogs);
  
          setRecentPosts(
            Array.isArray(response.data.recent) ? response.data.recent : []
          );
  
          setArchive(
            Array.isArray(response.data.archive) ? response.data.archive : []
          );
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("An error occurred while fetching the blogs.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const selectedBlogs = blogs.slice(startIdx, startIdx + itemsPerPage);

  // Loading or Error handling
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="pb-10 pt-20 lg:pb-20 lg:pt-20 bg-gray-50">
      <div className="container">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {selectedBlogs.map((blog, i) => (
                <SingleBlog key={i} blog={blog} />
              ))}
            </div>

            {/* Pagination Component with Primary Color Styling */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showIcons={true} // Show arrows for navigation
                  className="text-primary" // Primary color for pagination text
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Recent Blogs */}
            <div className="mb-5 bg-white shadow p-3 sm:p-5 lg:p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Recent Blogs
              </h3>
              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
              <ul className="space-y-6">
                {recentPosts.map((recentPost, index) => (
                  <li key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-12 h-12">
                      {recentPost.image != null ? (
                        <Image
                          src={recentPost.image}
                          alt={recentPost.title}
                          width={48}
                          height={48}
                          className="rounded-sm w-12 h-12 object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <Link
                        href={`/knowledge-hub/${recentPost.slug}`}
                        className="font-semibold text-gray-800 dark:text-white hover:underline"
                      >
                        {recentPost.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted on{" "}
                        {format(
                          new Date(recentPost.created_at),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Archive */}
            <div className="bg-white shadow p-3 sm:p-5 lg:p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Archive
              </h3>
              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
              <ul className="space-y-4">
                {archive.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/knowledge-hub/archive/${item.year}`}
                      className="flex justify-between items-center font-medium text-gray-800 dark:text-white hover:underline"
                    >
                      <span>{item.year}</span>
                      <span className="text-sm text-gray-500">{`(${item.count})`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Blog;
