import Blog from "@/components/Blog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

// Blog Metadata
export const metadata: Metadata = {
  title: "Blog - Wizam | Exam Preparation and Test Academy",
  description:
    "Wizam is an online learning platform that provides the latest resources for tests, practice, and exam preparation to enable students to achieve success in highly competitive tests and examinations.",
};



const BlogPage = () => {

  return (
    <>
      <Breadcrumb pageName="Resources" />
     
      <Blog />

    </>
  );
};

export default BlogPage;
