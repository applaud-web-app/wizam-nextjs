import { Metadata } from "next";
import axios from "axios";
import PostClient from "@/components/Blog/PostClient";

// Fetch Post Data for Metadata
async function fetchPostData(slug: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/resource/${slug}`
  );
  return response.data.data;
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPostData(params.slug);

  return {
    title: `${post.title} - Your Website Name`,
    description: post.short_description,
    openGraph: {
      title: post.title,
      description: post.short_description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/knowledge-hub/${post.slug}`,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.short_description,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPostData(params.slug);

  return <PostClient post={post} />;
}
