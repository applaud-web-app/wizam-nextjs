"use client";

import { useEffect, useState } from "react";
import SingleBlog from "@/components/Blog/SingleBlog";
import { format } from "date-fns";
import Image from "next/image";
import Loader from "@/components/Common/Loader";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import axios from "axios";
import Link from "next/link";

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

interface RelatedPost {
  title: string;
  category_id: number;
  short_description: string;
  image: string;
  slug: string;
  created_at: string;
  category: Category | null;
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
  data: BlogPost;
  related: RelatedPost[];
  recent: RecentPost[];
  archive: ArchiveItem[];
}

interface Blog {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
}

export default function PostClient({ post }: { post: BlogPost }) {
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/resource/${post.slug}`
        );

        if (response.data.status) {
          const { related, recent, archive } = response.data;

          // Process Related Posts
          const relatedBlogs = related.map((relatedPost: RelatedPost) => ({
            title: relatedPost.title,
            coverImage: relatedPost.image,
            excerpt: relatedPost.short_description,
            date: relatedPost.created_at,
            slug: relatedPost.slug,
          }));
          setRelatedPosts(relatedBlogs);

          // Set Recent Posts
          setRecentPosts(response.data.recent);

          // Set Archive Data
          setArchive(response.data.archive);
        } else {
          setError("Failed to load blog data.");
        }
      } catch (err) {
        console.error("Error fetching post data:", err);
        setError("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [post.slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <section className="relative">
        <Image
          src={post.blog_image || "/images/blog/blog-detail.png"}
          alt={post.title || "Default Image"}
          width={1920}
          height={500}
          className="lg:h-[500px] h-[200px] w-full object-cover object-center"
        />
      </section>
      <section className="py-8 sm:py-12 md:py-16 dark:bg-dark relative bg-gray-50">
        <div className="container -mt-[100px] lg:-mt-[250px] ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg">
                <div className="w-full">
                  {/* Blog Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-secondary text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                      {post.category.name}
                    </span>
                  </div>

                  {/* Blog Title */}
                  <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
                    {post.title}
                  </h1>

                  {/* Blog Info */}
                  <div className="flex flex-wrap items-center text-gray-500 mb-3">
                    <span className="mr-1">Written by</span>
                    <span className="font-semibold text-dark dark:text-white">
                      {post.user}
                    </span>
                    <span className="hidden sm:inline mx-3 text-gray-400">
                      |
                    </span>
                    <span className="block sm:inline w-full sm:w-auto">
                      Published on{" "}
                      {format(new Date(post.created_at), "dd MMM yyyy, h:mm a")}
                    </span>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center space-x-3 mb-6">
                    <h5 className="font-semibold underline text-lg">Share:</h5>

                    <FacebookShareButton
                      url={shareUrl}
                      title={post.title}
                      hashtag="#YourHashtag"
                    >
                      <Image
                        src="/images/facebook.png"
                        alt="Facebook"
                        width={32}
                        height={32}
                        className="cursor-pointer rounded-full"
                      />
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} title={post.title}>
                      <Image
                        src="/images/twitter.png"
                        alt="Twitter"
                        width={32}
                        height={32}
                        className="cursor-pointer rounded-full"
                      />
                    </TwitterShareButton>

                    <WhatsappShareButton
                      url={shareUrl}
                      title={`${post.title} - ${shareUrl}`}
                    >
                      <Image
                        src="/images/whatsapp.png"
                        alt="WhatsApp"
                        width={32}
                        height={32}
                        className="cursor-pointer rounded-full"
                      />
                    </WhatsappShareButton>

                    <LinkedinShareButton
                      url={shareUrl}
                      title={post.title}
                      summary={post.short_description}
                      source="Wizam"
                    >
                      <Image
                        src="/images/linkedin.png"
                        alt="LinkedIn"
                        width={32}
                        height={32}
                        className="cursor-pointer rounded-full"
                      />
                    </LinkedinShareButton>
                  </div>

                  {/* Blog Content */}
                  {
                    post.image != null ? (
                    <div className="mb-8">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={1288}
                          height={550}
                          className="h-auto w-full mb-8 rounded-lg"
                        />
                      </div>
                    ) : <></>
                  }

                  <div
                    className="text-gray-700 dark:text-gray-300 mb-6"
                    dangerouslySetInnerHTML={{ __html: post.short_description }}
                  />
                  <div
                    className="text-gray-800 dark:text-gray-400 mb-5"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>

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
                      {
                        recentPost.image != null ? (
                            <Image
                                src={recentPost.image}
                                alt={recentPost.title}
                              width={48}
                              height={48}
                                objectFit="cover"
                                className="rounded-sm w-12 h-12"
                              />
                          ) : <></>
                        }
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

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark dark:text-white mb-4">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, key) => (
                  <SingleBlog
                    key={key}
                    blog={{
                      title: relatedPost.title,
                      coverImage: relatedPost.coverImage,
                      excerpt: relatedPost.excerpt,
                      date: relatedPost.date,
                      slug: relatedPost.slug,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
