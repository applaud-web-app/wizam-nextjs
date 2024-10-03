import { ReactNode } from "react";
import Link from "next/link";

interface QuizPacksProps {
  title: string;
  icon: ReactNode;
  iconColor: string;
  slug: string;
}

const QuizPacks: React.FC<QuizPacksProps> = ({ title, icon, iconColor, slug }) => {
  return (
    <Link href={`/dashboard/quizzes/${slug}`}>
      <div className="bg-white p-5 rounded-xl  border border-white shadow-sm hover:border-secondary transform  transition-all duration-300 cursor-pointer">
        <div className={`${iconColor} text-4xl mr-4 mb-2`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
    </Link>
  );
};

export default QuizPacks;
