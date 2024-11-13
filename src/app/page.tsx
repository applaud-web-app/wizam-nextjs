// app/page.tsx (or wherever the home component is located)
import BannerSection from "@/Components/BannerSection";
import HomeBlogSection from "@/Components/Blog/HomeBlogSection";
import CallToAction from "@/Components/CallToAction";
import ScrollUp from "@/Components/Common/ScrollUp";
import Faq from "@/Components/Faq";
import Features from "@/Components/Features";
import HelpArea from "@/Components/HelpArea";
import Hero from "@/Components/Hero";
import HomeFilterBox from "@/Components/HomeFilterBox";
import PopularExams from "@/Components/PopularExam";
import WhyChoose from "@/Components/WhyChoose";
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
      {/* <Hero /> */}
      <BannerSection />
      <HelpArea />
      <PopularExams />
      {/* <Features /> */}
      <WhyChoose />
      <Faq />
      <HomeBlogSection />
      <CallToAction />
    </main>
  );
}
