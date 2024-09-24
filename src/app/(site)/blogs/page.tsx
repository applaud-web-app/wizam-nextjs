import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

// Blog Metadata
export const metadata: Metadata = {
  title: "Blog - Wizam | Exam Preparation and Test Academy",
  description:
    "Wizam is an online learning platform that provides the latest resources for tests, practice, and exam preparation to enable students to achieve success in highly competitive tests and examinations.",
};

// Define the Blog type locally in this file
type Blog = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

// Dummy Blog Data for the main blog page
const dummyBlogs: Blog[] = [
  {
    title: "Mastering Data Science",
    coverImage: "/images/blog/blog-01.jpg",
    excerpt:
      "Discover the world of Data Science with this in-depth course that covers machine learning, AI, and data visualization.",
    date: "2024-09-20",
    slug: "mastering-data-science",
  },
  {
    title: "Complete Guide to Web Development",
    coverImage: "/images/blog/blog-02.jpg",
    excerpt:
      "Become a professional web developer by learning HTML, CSS, JavaScript, and frameworks like React and Next.js.",
    date: "2024-08-15",
    slug: "complete-guide-web-development",
  },
  {
    title: "Ultimate Course for Digital Marketing",
    coverImage: "/images/blog/blog-02.jpg",
    excerpt:
      "Enhance your marketing skills with this course on SEO, social media strategies, and email marketing to grow your business.",
    date: "2024-07-30",
    slug: "ultimate-course-digital-marketing",
  },
];

const Blog = () => {
  const posts = dummyBlogs;

  return (
    <>
      <Breadcrumb pageName="Blog Grids" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
