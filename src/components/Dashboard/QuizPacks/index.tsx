import Link from "next/link";
import Image from "next/image"; // Import Image component

interface QuizPacksProps {
  title: string;
  imagePath: string; // Use imagePath prop for the image path
  slug: string;
}

const QuizPacks: React.FC<QuizPacksProps> = ({ title, imagePath, slug }) => {
  return (
    <Link href={`/dashboard/quizzes/${slug}`}>
      <div className="bg-white p-5 rounded-xl border border-white shadow-sm hover:border-quaternary transform transition-all duration-300 cursor-pointer">
        {/* Use Image component to display the image */}
        <Image src={imagePath} alt={title} width={56} height={56} className="mr-4 mb-2 rounded-lg bg-quaternary p-3" />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
    </Link>
  );
};

export default QuizPacks;
