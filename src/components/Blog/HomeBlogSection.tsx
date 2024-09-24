import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";

// Define BlogPost type
type BlogPost = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

// Define the props type for HomeBlogSection
interface HomeBlogSectionProps {
  posts: BlogPost[];
}

const HomeBlogSection = ({ posts }: HomeBlogSectionProps) => {
  return (
    <section className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-[60px]">
          <SectionTitle title="Resources" align="center" />
        </div>

        <div className="-mx-4 flex flex-wrap">
          {posts.length > 0 ? (
            posts.slice(0, 3).map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))
          ) : (
            <p className="text-center w-full text-lg text-gray-600">
              No blog posts available.
            </p>
          )}
        </div>

        {/* More Resources Button */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 rounded-full bg-primary text-white font-medium transition hover:bg-primary-dark">
              More Resources
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlogSection;
