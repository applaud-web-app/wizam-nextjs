import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiPlay } from "react-icons/fi";

interface ResumeExam {
  slug: string; // Unique identifier for each exam
  title: string;
  duration_mode: string;
  total_questions: number;
  total_marks: string;
  total_time: number;
  exam_duration: number;
  point_mode: string;
  point: number;
  schedule_id: string;
  startDate?: string; // Example start date property
  endDate?: string; // Example end date property
}

interface ResumeExamTableProps {
  resumedExam: ResumeExam[];
}

export default function ResumeExamTable({ resumedExam }: ResumeExamTableProps) {
  const router = useRouter();

  if (!resumedExam || resumedExam.length === 0) return <p>No resumed exams available</p>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats as dd/mm/yyyy
  };

  // Function to handle resume action
  const handleResumeExam = (examSlug: string) => {
    router.push(`/dashboard/exam-play/${examSlug}`);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">Resumed Exams</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-[#C9BC0F] text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
           
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resumedExam.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title}</td>
                <td className="p-4">
                  {exam.duration_mode === "manual"
                    ? exam.exam_duration
                    : Math.floor(exam.total_time / 60)}{" "}
                  min
                </td>
                <td className="p-4">{exam.total_questions}</td>
                <td className="p-4">
                  {exam.point_mode === "manual"
                    ? exam.total_questions * (exam.point || 0)
                    : exam.total_marks}
                </td>
              
                <td className="p-4">
                  <button
                    onClick={() => handleResumeExam(exam.slug + "?sid=" + exam.schedule_id)}
                    className="text-white bg-[#C9BC0F] px-5 py-1 rounded-full hover:bg-[#928c38] transition duration-200 flex items-center space-x-1"
                  >
                    <FiPlay />
                    <span>Resume</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
