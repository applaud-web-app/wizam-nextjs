import ExamList from "@/components/Dashboard/ExamList";
import ExamPacks from "@/components/Dashboard/ExamPacks";
import { FaBook, FaPencilAlt, FaGraduationCap, FaFlask, FaGlobe, FaCalculator } from 'react-icons/fa';

export default function AllExamPage() {
  const examPacksData = [
    { title: 'Math Exams', slug: 'math-exams' },
    { title: 'Science Exams', slug: 'science-exams' },
    { title: 'Literature Exams', slug: 'literature-exams' },
    { title: 'History Exams', slug: 'history-exams' },
    { title: 'Geography Exams', slug: 'geography-exams' },
    { title: 'Chemistry Exams', slug: 'chemistry-exams' },
  ];

  const icons = [
    <FaBook />, <FaPencilAlt />, <FaGraduationCap />, <FaFlask />, <FaGlobe />, <FaCalculator />
  ];

  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-5">Available Exam Packs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {examPacksData.map((pack, index) => (
          <ExamPacks
            key={index}
            title={pack.title}
            icon={getRandomIcon()}
            iconColor="text-primary"
            slug={pack.slug}
          />
        ))}
      </div>

      <ExamList />
    </div>
  );
}
