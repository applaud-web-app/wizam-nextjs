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

const sanitizeAndLimitText = (html: string, limit: number): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const plainText = div.textContent || div.innerText || "";
  return plainText.length > limit
    ? plainText.slice(0, limit) + "..."
    : plainText;
};

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

interface Blog {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
}

export default function PostClient({ post }: { post: BlogPost }) {
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await axios.get<{
          related: BlogPost[];
        }>(`${process.env.NEXT_PUBLIC_API_URL}/resource/${post.slug}`);
        const relatedBlogs = response.data.related.map(
          (relatedPost: BlogPost) => ({
            title: relatedPost.title,
            coverImage: relatedPost.image,
            excerpt: relatedPost.short_description,
            date: relatedPost.created_at,
            slug: relatedPost.slug,
          })
        );
        setRelatedPosts(relatedBlogs);
      } catch (err) {
        console.error("Error fetching related posts:", err);
        setError("Failed to load related posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [post.slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
          <section className="relative">
        <Image src="/images/blog/blog-detail.png" alt={post.title} width={1288} height={500} className="h-full w-full object-cover object-center" />
      </section>
      <section className="py-8 sm:py-12 md:py-16 dark:bg-dark relative bg-gray-50">
      <div className="container -mt-[100px] lg:-mt-[250px]">
        <div className="bg-white shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg">
          <div className="w-full">
            <div className="mb-4">
              <span className="inline-block bg-primary text-secondary text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                {post.category.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-500 mb-3">
              <span className="mr-1">Written by</span>
              <span className="font-semibold text-dark dark:text-white">
                {post.user}
              </span>
              <span className="hidden sm:inline mx-3 text-gray-400">|</span>
              <span className="block sm:inline w-full sm:w-auto">
                Published on{" "}
                {format(new Date(post.created_at), "dd MMM yyyy, h:mm a")}
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <h5 className="font-semibold underline text-lg">Share:</h5>

              {/* Facebook */}
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

              {/* Twitter */}
              <TwitterShareButton url={shareUrl} title={post.title}>
                <Image
                  src="/images/twitter.png"
                  alt="Twitter"
                  width={32}
                  height={32}
                  className="cursor-pointer rounded-full"
                />
              </TwitterShareButton>

              {/* WhatsApp */}
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

              {/* LinkedIn */}
              <LinkedinShareButton
                url={shareUrl}
                title={post.title}
                summary={post.short_description}
                source="YourWebsiteName"
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

            <Image
              src={post.image}
              alt={post.title}
              width={1288}
              height={550}
              className="h-auto w-full  mb-8 rounded-lg"
            />
            <div
              className="text-gray-700 dark:text-gray-300 mb-6"
              dangerouslySetInnerHTML={{ __html: post.short_description }}
            />
            <div
              className="text-gray-800 dark:text-gray-400 mb-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

<div className="flex items-center space-x-3 mb-6">
              <h5 className="font-semibold underline text-lg">Share:</h5>

              {/* Facebook */}
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

              {/* Twitter */}
              <TwitterShareButton url={shareUrl} title={post.title}>
                <Image
                  src="/images/twitter.png"
                  alt="Twitter"
                  width={32}
                  height={32}
                  className="cursor-pointer rounded-full"
                />
              </TwitterShareButton>

              {/* WhatsApp */}
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

              {/* LinkedIn */}
              <LinkedinShareButton
                url={shareUrl}
                title={post.title}
                summary={post.short_description}
                source="YourWebsiteName"
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
    
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div>{error}</div>
          ) : (
            relatedPosts.length > 0 && (
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
            )
          )}
        </div>
      </div>
    </section>

      </>
   
  );
}
