// components/Blog/ArchiveBlogs.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import Loader from "@/components/Common/Loader";
import SingleBlog from "@/components/Blog/SingleBlog";

interface Category {
  id: number;
  name: string;
}

interface BlogPost {
  id: number;
  category_id: number;
  user: string;
  title: string;
  content: string;
  short_description: string;
  image: string | null;
  slug: string;
  created_at: string;
  blog_image: string;
  category: Category;
}

interface ApiResponse {
  status: boolean;
  data: BlogPost[];
}

interface Blog {
  title: string;
  coverImage: string | null;
  excerpt: string;
  date: string;
  slug: string;
}

interface ArchiveBlogsProps {
  year: string;
}

const ArchiveBlogs: React.FC<ArchiveBlogsProps> = ({ year }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/resource/archive/${year}`
        );

        if (response.data.status) {
          const mappedBlogs: Blog[] = response.data.data.map((item: BlogPost) => ({
            title: item.title,
            coverImage: item.image, 
            excerpt: item.short_description,
            date: item.created_at,
            slug: item.slug,
          }));

          setBlogs(mappedBlogs);
        } else {
          setError("Failed to fetch archived blogs.");
        }
      } catch (err) {
        console.error("Error fetching archived blogs:", err);
        setError("An error occurred while fetching the archived blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [year]);

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const selectedBlogs = blogs.slice(startIdx, startIdx + itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading or Error handling
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <section className="py-8 lg:py-20">
      <div className="container">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {selectedBlogs.map((blog) => (
            <SingleBlog key={blog.slug} blog={blog} />
          ))}
        </div>

        {/* Pagination Component with Primary Color Styling */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons={true}
              color="primary"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ArchiveBlogs;
