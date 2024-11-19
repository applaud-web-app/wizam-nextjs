"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SingleBlog from "@/components/Blog/SingleBlog";
import { format } from "date-fns";
import Image from "next/image";
import { FaShareAlt } from "react-icons/fa"; 
import Loader from "@/components/Common/Loader";

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

  // Fetch blog post details and related content based on slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch the blog post by slug
        const postResponse = await axios.get<{ status: boolean; data: BlogPost; related: BlogPost[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/resource/${params.slug}`
        );
        const fetchedPost = postResponse.data.data;

        // Set the fetched post in the state
        setPost(fetchedPost);

        // Set SEO Metadata
        const setMetaTag = (name: string, content: string, property = false) => {
          const selector = property
            ? `meta[property="${name}"]`
            : `meta[name="${name}"]`;
          let metaTag = document.querySelector(selector) as HTMLMetaElement | null;
          if (metaTag) {
            metaTag.content = content;
          } else {
            metaTag = document.createElement("meta");
            if (property) {
              metaTag.setAttribute("property", name);
            } else {
              metaTag.setAttribute("name", name);
            }
            metaTag.content = content;
            document.head.appendChild(metaTag);
          }
        };

        const plainDescription = sanitizeAndLimitText(fetchedPost.content || "", 250);
        document.title = fetchedPost.title;

        setMetaTag("description", plainDescription);
        setMetaTag("keywords", fetchedPost.category.name || "blog, article");
        setMetaTag("og:title", fetchedPost.title, true);
        setMetaTag("og:description", plainDescription, true);
        setMetaTag("og:image", fetchedPost.image, true);
        setMetaTag("og:url", window.location.href, true);
        setMetaTag("twitter:card", "summary_large_image");
        setMetaTag("twitter:title", fetchedPost.title);
        setMetaTag("twitter:description", plainDescription);
        setMetaTag("twitter:image", fetchedPost.image);

        // Map related posts to the structure expected by SingleBlog component
        const relatedBlogs = postResponse.data.related.map((relatedPost: BlogPost) => ({
          title: relatedPost.title,
          coverImage: relatedPost.image,
          excerpt: relatedPost.short_description,
          date: relatedPost.created_at,
          slug: relatedPost.slug,
        }));

        // Set the related posts
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

  // Function to handle sharing
  const handleShare = async () => {
    if (!post) {
      alert("Post data is not available. Please try again later.");
      return;
    }
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title, 
          text: `${post.short_description}\nRead more at: ${window.location.href}`,
          url: window.location.href,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error during share:", error);
      }
    } else {
      // Fallback for unsupported browsers
      try {
        const shareContent = `
        ${post.title}\n\n
        ${post.short_description}\n\n
        Read more: ${window.location.href}
        `;
        await navigator.clipboard.writeText(shareContent);
        alert("Post link copied to clipboard! Share it anywhere.");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        alert("Failed to copy the link. Please try again.");
      }
    }
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
    {/* Category and Share */}
   <div className="flex justify-between items-center mb-4">
    {/* Category Badge */}
    <span className="inline-block bg-primary text-secondary text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-1 sm:py-2 rounded-full">
      {post.category.name}
    </span>

    {/* Share Button */}
    <button
      onClick={handleShare}
      className="inline-flex items-center bg-secondary text-white text-xs sm:text-sm font-semibold hover:bg-secondary-dark px-3 sm:px-4 py-1 sm:py-2 rounded-full"
    >
      <FaShareAlt className="mr-1 sm:mr-2 text-sm sm:text-lg" />
      Share
    </button>
  </div>

    {/* Title */}
    <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
      {post.title}
    </h1>

    {/* Author and Date */}
    <div className="flex flex-wrap items-center text-gray-500 mb-6">
      <span className="mr-1">Written by</span>
      <span className="font-semibold text-dark dark:text-white">{post.user}</span>
      <span className="hidden sm:inline mx-3 text-gray-400">|</span>
      <span className="block sm:inline w-full sm:w-auto">
        Published on {format(new Date(post.created_at), "dd MMM yyyy, h:mm a")}
      </span>
    </div>

    {/* Blog Image */}
    <div
      className="relative z-20 mb-8 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-lg shadow-md"
      data-wow-delay=".1s"
    >
      <Image
        src={post.image}
        alt={post.title}
        width={1288}
        height={550}
        className="h-full w-full object-cover object-center"
      />
    </div>

    {/* Blog Content */}
    <div className="blog-details" id="dynamic_content">
      {/* Short Description */}
      <div
        className="mb-6 text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.short_description }}
      />

      {/* Full Content */}
      <div
        className="text-gray-800 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  </div>
</div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 sm:mt-12 md:mt-14">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark dark:text-white mb-4 sm:mb-5">
                Related Articles
              </h2>
              <span className="mb-6 inline-block h-[2px] w-16 sm:w-20 bg-primary"></span>

              {/* Grid Layout for Related Posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
