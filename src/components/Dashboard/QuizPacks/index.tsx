import Link from "next/link";
import Image from "next/image";
import { MdOutlineCheckBox, MdOutlineFreeCancellation  } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa";

interface QuizPacksProps {
  title: string;
  imagePath: string;
  slug: string;
  totalQuizzes: number;
  totalFreeQuizzes: number;
  totalPaidQuizzes: number;
}

const QuizPacks: React.FC<QuizPacksProps> = ({
  title,
  imagePath,
  slug,
  totalQuizzes,
  totalFreeQuizzes,
  totalPaidQuizzes
}) => {

  return (
    <Link href={`/dashboard/all-quizzes/${slug}`}>
      <div className="bg-white p-5 rounded-xl border border-white shadow-sm hover:border-quaternary transform transition-all duration-300 cursor-pointer">
        {/* Display image */}
        <Image
          src={imagePath}
          alt={title}
          width={56}
          height={56}
          className="mr-4 mb-2 rounded-lg bg-quaternary p-3"
        />
        {/* Display quiz pack title */}
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex space-x-3 mt-2">
          <p className="text-gray-500 flex items-center space-x-1">
              <MdOutlineCheckBox className="text-quaternary" />
              <span>Total: {totalQuizzes}</span>
            </p>
            <p className="text-gray-500 flex items-center space-x-1">
              <MdOutlineFreeCancellation className="text-green-500" />
              <span>Free: {totalFreeQuizzes}</span>
            </p>
            <p className="text-gray-500 flex items-center space-x-1">
              <FaMoneyCheck   className="text-yellow-500" />
              <span>Paid: {totalPaidQuizzes}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuizPacks;
