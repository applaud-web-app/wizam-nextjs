import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon from react-icons

export default function ResumeExamCard() {
  // Sample data for the table
  const exams = [
    { title: "Math Exam", duration: "2 hrs", questions: 50, status: "In Progress" },
    { title: "Science Quiz", duration: "1 hr", questions: 30, status: "Completed" },
    { title: "History Test", duration: "1.5 hrs", questions: 40, status: "Pending" },
    { title: "English Exam", duration: "2 hrs", questions: 45, status: "In Progress" },
    { title: "Geography Quiz", duration: "1 hr", questions: 25, status: "Completed" },
  ];

  // Function to return the appropriate badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">In Progress</span>;
      case "Completed":
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Completed</span>;
      case "Pending":
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Unknown</span>;
    }
  };

  return (
    <div className="p-5 bg-white shadow-sm rounded-lg mb-8">
      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-lg font-bold mb-4 md:mb-0">Resume Exam</h2>
        <a
          href="#"
          className="text-primary font-semibold flex items-center space-x-2 hover:underline transition duration-200"
        >
          <span>See All</span>
          <FiArrowRight /> {/* React Icon for arrow */}
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left hidden sm:table-cell">Duration</th>
              <th className="p-3 text-left hidden sm:table-cell">Questions</th>
              <th className="p-3 text-left rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title}</td>
                <td className="p-4 hidden sm:table-cell">{exam.duration}</td>
                <td className="p-4 hidden sm:table-cell">{exam.questions}</td>
                <td className="p-4">{getStatusBadge(exam.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
