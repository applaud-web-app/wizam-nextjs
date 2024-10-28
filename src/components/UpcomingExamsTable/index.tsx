import Link from "next/link";
import { MdLockOutline } from "react-icons/md";

interface UpcomingExam {
  id: number;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  exam: {
    exam_slug: string;
    exam_name: string;
    duration_mode: string;
    exam_duration: number | null;
    total_questions: number;
    total_marks: string;
    total_time: number;
    point_mode: string;
    point: number | null;
  };
}

interface UpcomingExamsTableProps {
  upcomingExams: UpcomingExam[];
}

export default function UpcomingExamsTable({ upcomingExams }: UpcomingExamsTableProps) {
  if (!upcomingExams || upcomingExams.length === 0) return <p>No upcoming exams available</p>;

  const isDisabled = true; // Change this to control if links should be disabled

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">Upcoming Exams</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Start Date & Time</th>
              <th className="p-3 text-left">End Date & Time</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingExams.map((examEntry, index) => {
              const { exam } = examEntry;

              // Combine date and time for Start and End
              const startDateTime = `${new Date(examEntry.start_date).toLocaleDateString()} ${examEntry.start_time}`;
              const endDateTime = examEntry.end_date
                ? `${new Date(examEntry.end_date).toLocaleDateString()} ${examEntry.end_time || "N/A"}`
                : "N/A";

              return (
                <tr key={examEntry.id} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{exam.exam_name}</td>
                  <td className="p-4">{startDateTime}</td>
                  <td className="p-4">{endDateTime}</td>
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
                    <div>
                      <Link
                        href={isDisabled ? "#" : `/dashboard/exam-details/${exam.exam_slug}`}
                        onClick={(e) => isDisabled && e.preventDefault()}
                        className={`px-3 text-sm py-1 inline-flex items-center justify-center space-x-1 rounded-full transition duration-200 ${
                          isDisabled
                            ? "text-white bg-[#ffc300] hover:bg-yellow-500"
                            : "text-white bg-[#ffc300] hover:bg-yellow-500"
                        }`}
                      >
                        <MdLockOutline />
                        <span>Upcoming</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
