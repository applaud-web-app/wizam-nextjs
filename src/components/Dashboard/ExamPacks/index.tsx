import Link from "next/link";
import Image from "next/image";
import { MdOutlineCheckBox, MdOutlineFreeCancellation   } from "react-icons/md"; // Icons for total exams, free exams, and paid exams
import { FaMoneyCheck } from "react-icons/fa";

interface ExamPacksProps {
  title: string;
  imagePath: string;
  slug: string;
  totalExams: number;       // Total number of exams in the pack
  totalFreeExams: number;   // Total number of free exams in the pack
  totalPaidExams: number;   // Total number of paid exams in the pack
}

const ExamPacks: React.FC<ExamPacksProps> = ({
  title,
  imagePath,
  slug,
  totalExams,
  totalFreeExams,
  totalPaidExams
}) => {

  return (
    <Link href={`/dashboard/all-exams/${slug}`}>
      <div className="bg-white p-5 rounded-xl border border-white shadow-sm hover:border-defaultcolor transform transition-all duration-300 cursor-pointer">
        {/* Display image */}
        <Image
          src={imagePath}
          alt={title}
          width={56}
          height={56}
          className="mr-4 mb-2 rounded-lg bg-defaultcolor p-3"
        />
        {/* Display exam pack title */}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="flex space-x-3 mt-2">
            <p className="text-gray-500 flex items-center space-x-1">
              <MdOutlineCheckBox className="text-defaultcolor" /> {/* Total Exams Icon */}
              <span>Exams : {totalExams}</span>
            </p>
            <p className="text-gray-500 flex items-center space-x-1">
              <MdOutlineFreeCancellation className="text-green-500" /> {/* Free Exams Icon */}
              <span>Free : {totalFreeExams}</span>
            </p>
            <p className="text-gray-500 flex items-center space-x-1">
              <FaMoneyCheck   className="text-yellow-500" /> {/* Paid Exams Icon */}
              <span>Paid : {totalPaidExams}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExamPacks;
