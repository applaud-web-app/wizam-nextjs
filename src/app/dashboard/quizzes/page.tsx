import QuizList from '@/components/Dashboard/QuizList';
import QuizPacks from '@/components/Dashboard/QuizPacks';
import { FaQuestion, FaLightbulb, FaBrain, FaPuzzlePiece, FaKeyboard, FaCode } from 'react-icons/fa';

export default function AllQuizPage() {
  const quizPacksData = [
    { title: 'General Knowledge Quiz', slug: 'general-knowledge-quiz' },
    { title: 'Science Quiz', slug: 'science-quiz' },
    { title: 'Math Quiz', slug: 'math-quiz' },
    { title: 'History Quiz', slug: 'history-quiz' },
    { title: 'Geography Quiz', slug: 'geography-quiz' },
    { title: 'Programming Quiz', slug: 'programming-quiz' },
  ];

  const icons = [
    <FaQuestion />, <FaLightbulb />, <FaBrain />, <FaPuzzlePiece />, <FaKeyboard />, <FaCode />
  ];

  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-5">Available Quiz Packs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {quizPacksData.map((pack, index) => (
          <QuizPacks
            key={index}
            title={pack.title}
            icon={getRandomIcon()}
            iconColor="text-secondary"
            slug={pack.slug}
          />
        ))}
      </div>
      <QuizList />
    </div>
  );
}
