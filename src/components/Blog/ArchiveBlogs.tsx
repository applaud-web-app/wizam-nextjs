"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import Loader from "@/components/Common/Loader";
import SingleBlog from "@/components/Blog/SingleBlog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

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
  data: BlogPost[];
  recent: RecentPost[];
  archive: ArchiveItem[];
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
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch blogs, recent posts, and archive data
  useEffect(() => {
    const fetchData = async () => {
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
          setRecentPosts(response.data.recent || []);
          setArchive(response.data.archive || []);
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

    fetchData();
  }, [year]);

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const selectedBlogs = blogs.slice(startIdx, startIdx + itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Blog Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {selectedBlogs.map((blog) => (
                <SingleBlog key={blog.slug} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
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
                      {recentPost.image ? (
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
                        {format(new Date(recentPost.created_at), "dd MMM yyyy")}
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

export default ArchiveBlogs;
