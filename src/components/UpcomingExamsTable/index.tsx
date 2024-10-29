import Link from "next/link";
import { MdLockOutline } from "react-icons/md";

interface UpcomingExam {
  id: number;
  exam_slug: string;
  exam_name: string;
  duration_mode: string;
  exam_duration: number | null;
  total_questions: number;
  total_marks: string;
  total_time: number;
  point_mode: string;
  point: number | null;
  schedule_type: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
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
              <th className="p-3 text-left">Available Between/Fixed (Europe/London)</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingExams.map((examEntry, index) => {
              // Get either the flat structure fields or fields within exam object
              const examSlug = examEntry.exam_slug;
              const examName = examEntry.exam_name;
              const durationMode = examEntry.duration_mode;
              const examDuration = examEntry.exam_duration;
              const totalTime = examEntry.total_time;
              const totalQuestions = examEntry.total_questions;
              const totalMarks = examEntry.total_marks;
              const pointMode = examEntry.point_mode;
              const point = examEntry.point;
              const start_date = examEntry.start_date;
              const start_time = examEntry.start_time;
              const end_date = examEntry.end_date;
              const end_time = examEntry.end_time;
              const schedule_type = examEntry.schedule_type;

              // Get schedule details if available
              // const schedule = examEntry.schedules;
              if (!examName) return null; // Skip if exam_name is missing

              // Combine date and time for Start and End
              const startDateTime = start_date
                ? `${new Date(start_date).toLocaleDateString()} ${start_time}`
                : "N/A";
              const endDateTime = end_date ? `${new Date(end_date).toLocaleDateString()} ${end_time || "N/A"}`
                : "N/A";

              let scheduleTime = startDateTime;
              if (schedule_type === "flexible") {
                scheduleTime = `${startDateTime} - ${endDateTime}`;
              } else if (schedule_type === "fixed") {
                scheduleTime = `Fixed : ${startDateTime}`;
              }

              return (
                <tr key={examEntry.id} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{examName}</td>
                  <td className="p-4">{scheduleTime}</td>
                  <td className="p-4">
                    {durationMode === "manual"
                      ? examDuration
                      : Math.floor(totalTime / 60)}{" "}
                    min
                  </td>
                  <td className="p-4">{totalQuestions}</td>
                  <td className="p-4">
                    {pointMode === "manual"
                      ? totalQuestions * (point || 0)
                      : totalMarks}
                  </td>
                  <td className="p-4">
                    <div>
                      <Link
                        href={isDisabled ? "#" : `/dashboard/exam-details/${examSlug}`}
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
