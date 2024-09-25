import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AboutUs - Wizam | Exam Preparation and Test Academy",
  description: "Wizam is an online learning platform that provides the latest resources for tests, practice, and exam preparation to enable students to achieve success in highly competitive tests and examinations.",
};

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="About Us" />
      <About />
  

      <CallToAction />
      
    </main>
  );
};

export default AboutPage;
