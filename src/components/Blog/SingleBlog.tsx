import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

// Define the Blog type locally in this file
type Blog = {
  title: string;
  coverImage: string;
  excerpt: string;
  date: string;
  slug: string;
};

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { title, coverImage, excerpt, date, slug } = blog;

  return (
    <div className="group mb-10 flex flex-col overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg dark:bg-dark-2">
      {/* Image Section */}
      <div className="relative  overflow-hidden rounded-t-lg">
        <Link href={`/knowledge-hub/${slug}`} aria-label="blog cover" className="block h-full">
          <Image
            src={coverImage}
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110"
            width={408}
            height={280}
          />
        </Link>
      </div>
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6">
        <span className="mb-3 inline-block rounded text-body-color">
          {format(new Date(date), "dd MMM yyyy")}
        </span>
        <h3>
          <Link
            href={`/knowledge-hub/${slug}`}
            className="mb-3 inline-block text-xl font-semibold text-dark hover:text-primary-dark dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl"
          >
            {title}
          </Link>
        </h3>
        <p className="text-base text-body-color dark:text-dark-6 flex-1">{excerpt}</p>
      </div>
    </div>
  );
};

export default SingleBlog;
