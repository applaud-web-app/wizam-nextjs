import Link from "next/link";
import { MdLockOutline } from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface UpcomingExams {
  id: number;
  exam_slug: string;
  exam_name: string;
  duration_mode: string;
  exam_duration: string | null; // Changed from number | null to string | null
  total_questions: string;
  total_marks: string;
  total_time: string;
  point_mode: string;
  point: number | null;
  schedule_type: string;
  schedule_id: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  is_free: number; // Indicates if the exam is free
  is_resume: boolean; // Indicates if the exam can be resumed
  total_attempts: string | null; // Changed from number | null to string | null
  restrict_attempts: number; // Added based on sample data
}

interface UpcomingExamsTableProps {
  upcomingExams: UpcomingExams[];
  serverTime: Date | null;
}

export default function UpcomingExamsTable({ upcomingExams, serverTime }: UpcomingExamsTableProps) {
  const router = useRouter();

  if (!upcomingExams || upcomingExams.length === 0)
    return <p>No upcoming exams available</p>;

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
              <th className="p-3 text-left">Attempts</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingExams.map((examEntry, index) => {
              const {
                exam_slug,
                exam_name,
                duration_mode,
                exam_duration,
                total_time,
                total_questions,
                total_marks,
                point_mode,
                point,
                start_date,
                start_time,
                end_date,
                end_time,
                schedule_type,
                schedule_id,
                is_free,
                is_resume,
                total_attempts,
                restrict_attempts,
              } = examEntry;

              if (!exam_name) return null;

              const formatDateTime = (date: Date) =>
                `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

              const startDateTime = new Date(`${start_date}T${start_time}`);
              const endDateTime = end_date && end_time ? new Date(`${end_date}T${end_time}`) : null;

              let scheduleTime = formatDateTime(startDateTime);
              if (schedule_type === "flexible") {
                const endDateTimeStr = endDateTime ? formatDateTime(endDateTime) : "N/A";
                scheduleTime = `${formatDateTime(startDateTime)} - ${endDateTimeStr}`;
              } else if (schedule_type === "fixed") {
                scheduleTime = `Fixed: ${formatDateTime(startDateTime)}`;
              }

              const currentTime = serverTime || new Date();

              let isUpcoming = false;
              let isAvailable = false;
              let isOver = false;

              if (schedule_type === "flexible" || schedule_type === "fixed") {
                if (currentTime < startDateTime) {
                  isUpcoming = true;
                } else if (endDateTime && currentTime > endDateTime) {
                  isOver = true;
                } else {
                  isAvailable = true;
                }
              } else if (schedule_type === "attempts") {
                if (currentTime < startDateTime) {
                  isUpcoming = true;
                } else {
                  isAvailable = true;
                }
              }

              if (isOver) {
                return null;
              }

              const handlePayment = async () => {
                try {
                  const jwt = Cookies.get("jwt");
                  const type = "exams";
                  if (!jwt) {
                    toast.error("User is not authenticated. Please log in.");
                    return;
                  }
                  const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/user-subscription`,
                    {
                      headers: {
                        Authorization: `Bearer ${jwt}`,
                      },
                      params: { type },
                    }
                  );
                  if (response.data.status === true) {
                    router.push(
                      `/dashboard/exam-detail/${exam_slug}?sid=${schedule_id}`
                    );
                  } else {
                    toast.error("Please buy a subscription to access this course.");
                    router.push("/pricing");
                  }
                } catch (error: any) {
                  if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                      toast.error("User is not authenticated. Please log in.");
                      router.push("/login");
                    } else if (status === 403 || status === 404) {
                      toast.error("Please buy a subscription to access this course.");
                      router.push("/pricing");
                    } else {
                      toast.error(`An error occurred: ${data.error || "Unknown error"}`);
                    }
                  } else {
                    toast.error("An error occurred. Please try again.");
                  }
                }
              };

              return (
                <tr key={examEntry.id} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{exam_name}</td>
                  <td className="p-4">{scheduleTime}</td>
                  <td className="p-4">
                    {restrict_attempts === 1 && total_attempts
                      ? total_attempts
                      : '-'}
                  </td> {/* Updated Cell */}
                  <td className="p-4">
                    {duration_mode === "manual"
                      ? exam_duration
                      : exam_duration !== null
                      ? Math.floor(parseInt(total_time, 10) / 60)
                      : '-'}{" "}
                    min
                  </td>
                  <td className="p-4">{total_questions}</td>
                  <td className="p-4">
                    {point_mode === "manual"
                      ? (parseInt(total_questions, 10) * (point || 0)).toString()
                      : total_marks}
                  </td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <button
                        className="bg-[#ffc300] hover:bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold text-sm cursor-not-allowed inline-flex items-center space-x-1 w-32"
                        disabled
                      >
                        <MdLockOutline className="flex-shrink-0" />
                        <span>Upcoming</span>
                      </button>
                    ) : is_resume ? (
                      <Link
                        href={`/dashboard/exam-play/${exam_slug}?sid=${schedule_id}`}
                        className="text-white bg-[#C9BC0F] px-5 py-1 rounded-full hover:bg-[#928c38] transition duration-200 inline-flex items-center justify-center space-x-1 font-semibold text-sm w-32"
                      >
                        <FiPlay />
                        <span>Resume</span>
                      </Link>
                    ) : is_free === 1 ? (
                      <Link
                        href={`/dashboard/exam-detail/${exam_slug}?sid=${schedule_id}`}
                        className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold text-sm hover:bg-green-700 transition duration-200 inline-flex items-center justify-center w-32"
                      >
                        Start Exam
                      </Link>
                    ) : (
                      <button
                        className="bg-defaultcolor text-white py-1 px-5 rounded-full font-semibold text-sm hover:bg-defaultcolor-dark w-32"
                        onClick={handlePayment}
                      >
                        Pay Now
                      </button>
                    )}
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
