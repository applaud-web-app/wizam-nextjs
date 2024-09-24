import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import ScrollUp from "@/components/Common/ScrollUp";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import PopularExams from "@/components/PopularExam";
import WhyChoose from "@/components/WhyChoose";
import { Metadata } from "next";

// Define BlogPost type
type BlogPost = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

export const metadata: Metadata = {
  title: "Wizam - Exam Preparation and Test Academy",
  description: "Wizam is an online learning platform that provides the latest resources for tests, practice, and exam preparation to enable students to achieve success in highly competitive tests and examinations.",
};

// Dummy Data for Blog Posts
const dummyPosts: BlogPost[] = [
  {
    title: "Introduction to Data Science",
    coverImage: "/images/blog/blog-01.jpg",
    excerpt: "Explore the fundamentals of data science, machine learning, and AI.",
    date: "2024-09-12",
    slug: "introduction-to-data-science",
  },
  {
    title: "Mastering Web Development",
    coverImage: "/images/blog/blog-02.jpg",
    excerpt: "A comprehensive guide to becoming a professional web developer.",
    date: "2024-08-25",
    slug: "mastering-web-development",
  },
  {
    title: "Digital Marketing Essentials",
    coverImage: "/images/blog/blog-03.jpg",
    excerpt: "Learn the key strategies of digital marketing, from SEO to social media.",
    date: "2024-07-30",
    slug: "digital-marketing-essentials",
  },
];

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <PopularExams />
      <Features />
      <WhyChoose />
      <Faq />
      {/* Pass the dummyPosts data to HomeBlogSection */}
      <HomeBlogSection posts={dummyPosts} />
      <CallToAction />
    </main>
  );
}
