import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";

// Mock exam data
const examData = [
  {
    slug: "dental-nursing-preparation-exam-2024-nebdn",
    title: "Dental Nursing Preparation Exam 2024 NEBDN",
    description: "Comprehensive exam for dental nursing preparation.",
    detailedContent: "This exam will prepare you for NEBDN 2024.",
    duration: "1.5 Hrs",
    questions: 20,
    totalMarks: 40,
    availableFrom: "Sep 16, 2024",
    availableTo: "Jan 16, 2025",
  },
  {
    slug: "pharmacy-technician-certification-exam-2024",
    title: "Pharmacy Technician Certification Exam 2024",
    description: "Detailed exam for pharmacy technician certification.",
    detailedContent:
      "Get ready for the 2024 pharmacy technician certification exam.",
    duration: "2 Hrs",
    questions: 30,
    totalMarks: 60,
    availableFrom: "Oct 1, 2024",
    availableTo: "Feb 1, 2025",
  },
];

interface ExamDetailProps {
  params: {
    slug: string;
  };
}

const ExamDetailPage = ({ params }: ExamDetailProps) => {
  const { slug } = params;

  // Find the exam that matches the slug
  const exam = examData.find((exam) => exam.slug === slug);

  if (!exam) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb pageName={exam.title} />
      <section className="container relative z-10 mx-auto -mt-12 pb-20">
        <div className="mb-3 rounded-lg bg-white shadow-lg">
          {/* Exam Header Section */}
          <div className="flex flex-col items-center space-y-4 p-6 sm:flex-row sm:justify-around sm:space-x-8 sm:space-y-0">
            <div className="text-center">
              <p className="text-lg text-gray-500">Available Between</p>
              <p className="text-xl font-bold text-primary">
                {exam.availableFrom} - {exam.availableTo}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Duration</p>
              <p className="text-xl font-bold text-gray-900">{exam.duration}</p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Questions</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.questions}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Total Marks</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.totalMarks}
              </p>
            </div>
          </div>
        </div>

        {/* Exam Instructions Section */}
        <div className="mt-8 rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Exam Instructions
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
            <li>Total duration of quiz is {exam.duration}.</li>
            <li>The quiz contains {exam.questions} questions.</li>
            <li>Minimum Pass Percentage is 60%.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-gray-800">
            Standard Instructions
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
            <li>
              The clock will be set at the server. The countdown timer in the
              top right corner of the screen will display the remaining time
              available for you to complete the test.
            </li>
            <li>
              Click on the question number in the Question Palette to go to that
              numbered question directly. Note that this option does NOT save
              your answer.
            </li>
            <li>
              Click on Save & Next to save your answer and then go to the next
              question.
            </li>
            <li>
              The Question Palette displayed on the right side of the screen
              will show the status of each question.
            </li>
          </ul>

          {/* Checkbox and Start Exam Button */}
          <div className="mt-8">
            <div className="flex items-start">
              <input
                id="instruction-checkbox"
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-primary transition duration-200 ease-in-out hover:cursor-pointer focus:ring-primary"
              />
              <label
                htmlFor="instruction-checkbox"
                className="ml-3 text-sm font-medium text-gray-800 hover:cursor-pointer"
              >
                I have read all the instructions.
              </label>
            </div>

            <button className="mt-6 w-full rounded-full bg-secondary px-6 py-3 text-white  transition duration-300 ease-in-out hover:bg-primary focus:ring-4 focus:ring-primary">
              Start Exam
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExamDetailPage;
