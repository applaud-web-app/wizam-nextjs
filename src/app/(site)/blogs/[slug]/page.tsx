"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SingleBlog from "@/components/Blog/SingleBlog";
import { format } from "date-fns";
import Image from "next/image";
import Loader from "@/components/Common/Loader";
import { FaFacebook, FaWhatsapp, FaTwitter, FaLinkedin } from "react-icons/fa";

// Utility function to sanitize description and limit to 250 characters
const sanitizeAndLimitText = (html: string, limit: number): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const plainText = div.textContent || div.innerText || "";
  return plainText.length > limit ? plainText.slice(0, limit) + "..." : plainText;
};

// Type for Blog Post data from API
interface BlogPost {
  id: number;
  title: string;
  content: string;
  short_description: string;
  image: string;
  slug: string;
  created_at: string;
  user: string;
  category: {
    id: number;
    name: string;
  };
}

// Type for Blog expected by SingleBlog component
interface Blog {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
}

// Page Props
interface Props {
  params: { slug: string };
}

// Main Post component
export default function Post({ params }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null); // State to store post details
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]); // State to store related posts
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get<{ status: boolean; data: BlogPost; related: BlogPost[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/resource/${params.slug}`
        );
        const fetchedPost = postResponse.data.data;
        setPost(fetchedPost);

        const relatedBlogs = postResponse.data.related.map((relatedPost: BlogPost) => ({
          title: relatedPost.title,
          coverImage: relatedPost.image,
          excerpt: relatedPost.short_description,
          date: relatedPost.created_at,
          slug: relatedPost.slug,
        }));
        setRelatedPosts(relatedBlogs);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  // Share Functions
  const handleFacebookShare = (url: string) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleWhatsappShare = (url: string) => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check this out: ${url}`
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = (title: string, url: string) => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = (title: string, url: string) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !post) {
    return <div>{error || "Post not found"}</div>;
  }

  return (
    <>
      <section className="relative">
        <Image
          src="/images/blog/blog-detail.png"
          alt={post.title}
          width={1288}
          height={500}
          className="h-[200px] sm:h-[300px] md:h-[400px] w-full object-cover object-center"
        />
      </section>

      <section className="py-8 sm:py-12 md:py-16 dark:bg-dark relative bg-gray-50">
        <div className="container -mt-[100px] lg:-mt-[250px] ">
          <div className="bg-white shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg">
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-primary text-secondary text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                  {post.category.name}
                </span>

                {/* Share Buttons */}
                <div className="flex justify-end items-center space-x-4">
                  <button
                    onClick={() => handleFacebookShare(window.location.href)}
                    className="text-blue-600 hover:text-blue-800 text-xl"
                    title="Share on Facebook"
                  >
                    <FaFacebook />
                  </button>
                  <button
                    onClick={() => handleWhatsappShare(window.location.href)}
                    className="text-green-500 hover:text-green-700 text-xl"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp />
                  </button>
                  <button
                    onClick={() => handleTwitterShare(post.title, window.location.href)}
                    className="text-blue-400 hover:text-blue-600 text-xl"
                    title="Share on Twitter"
                  >
                    <FaTwitter />
                  </button>
                  <button
                    onClick={() => handleLinkedInShare(post.title, window.location.href)}
                    className="text-blue-700 hover:text-blue-900 text-xl"
                    title="Share on LinkedIn"
                  >
                    <FaLinkedin />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-500 mb-6">
                <span className="mr-1">Written by</span>
                <span className="font-semibold text-dark dark:text-white">{post.user}</span>
                <span className="hidden sm:inline mx-3 text-gray-400">|</span>
                <span className="block sm:inline w-full sm:w-auto">
                  Published on {format(new Date(post.created_at), "dd MMM yyyy, h:mm a")}
                </span>
              </div>
              <Image
                src={post.image}
                alt={post.title}
                width={1288}
                height={550}
                className="h-full w-full object-cover object-center mb-8 rounded-lg"
              />
              <div className="text-gray-700 dark:text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: post.short_description }} />
              <div className="text-gray-800 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>

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
