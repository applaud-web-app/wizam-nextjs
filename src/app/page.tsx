// app/page.tsx (or wherever the home component is located)
import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import ScrollUp from "@/components/Common/ScrollUp";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HomeFilterBox from "@/components/HomeFilterBox";
import PopularExams from "@/components/PopularExam";
import WhyChoose from "@/components/WhyChoose";
import { Metadata } from "next";

// Set metadata for SEO
export const metadata: Metadata = {
  title: "Wizam - Exam Preparation and Test Academy",
  description:
    "Wizam is an online learning platform that provides the latest resources for tests, practice, and exam preparation to enable students to achieve success in highly competitive tests and examinations.",
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <HomeFilterBox />
      <PopularExams />
      <Features />
      <WhyChoose />
      <Faq />
      <HomeBlogSection />
      <CallToAction />
    </main>
  );
}
