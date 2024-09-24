import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

// Define the Blog type locally in this file
type Blog = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string; // Keeping it as a string for consistency with the date formatting
  slug: string;
};

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { title, coverImage, excerpt, date, slug } = blog;

  return (
    <div className="group mb-10 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-2">
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={`/blogs/${slug}`} aria-label="blog cover" className="block">
          <Image
            src={coverImage!}
            alt="image"
            className="w-full transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110"
            width={408}
            height={272}
          />
        </Link>
      </div>
      {/* Content Section */}
      <div className="p-6">
        <span className="mb-3 inline-block rounded text-body-color text-center">
          {format(new Date(date), "dd MMM yyyy")}
        </span>
        <h3>
          <Link
            href={`/blogs/${slug}`}
            className="mb-3 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl "
          >
            {title}
          </Link>
        </h3>
        <p className="text-base text-body-color dark:text-dark-6">{excerpt}</p>
      </div>
    </div>
  );
};

export default SingleBlog;
