"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SingleBlog from "@/components/Blog/SingleBlog";
import { format } from "date-fns";
import Image from "next/image";
import Loader from "@/components/Common/Loader";

// Type for Blog Post data from API
interface BlogPost {
  id: number;
  title: string;
  content: string;
  short_description: string;
  image: string;
  slug: string;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
  user: {
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

  if (loading) {
    return <Loader />;
  }

  if (error || !post) {
    return <div>{error || "Post not found"}</div>;
  }

  return (
    <>
      <section className="relative">
        <Image src="/images/blog/blog-detail.png" alt={post.title} width={1288} height={500} className="h-full w-full object-cover object-center" />
      </section>

      <section className="py-16 dark:bg-dark lg:py-16 relative">
        <div className="container -mt-[100px] lg:-mt-[250px] ">
          <div className="bg-white shadow-lg p-5 md:p-6 lg:p-8 rounded-lg">
            <div className="w-full">
              {/* Category Badge */}
              <span className="inline-block bg-primary text-white text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
                {post.category.name}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-bold text-dark dark:text-white mb-4">{post.title}</h1>

              {/* Author and Date */}
              <div className="flex items-center text-gray-500 mb-6">
                <span className="mr-2">written by</span>
                <span className="font-semibold text-dark dark:text-white">{post.user.name}</span>
                <span className="mx-2">|</span>
                <span>published on {format(new Date(post.created_at), "dd MMM yyyy, h:mm a")}</span>
              </div>

              {/* Image Section */}
              <div className="wow fadeInUp relative z-20 mb-[60px] h-[300px] overflow-hidden rounded md:h-[400px] lg:h-[500px]" data-wow-delay=".1s">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1288}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Blog Content */}
              <div className="w-full px-4">
                <div className="blog-details xl:pr-10" id="dynamic_content">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-14">
            <h2 className="relative pb-5 text-2xl font-semibold text-dark dark:text-white sm:text-[28px]">
              Related Articles
            </h2>
            <span className="mb-10 inline-block h-[2px] w-20 bg-primary"></span>

            {/* Grid Layout for Related Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

        </div>
      </section>
    </>
  );
}
