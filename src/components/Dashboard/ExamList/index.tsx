import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon from react-icons

export default function ExamList() {
  // Sample data for the table
  const exams = [
    { title: "Math Exam", available: "Nov 1 - Nov 30", duration: "2 hrs", fee: "$50", questions: 50, status: "In Progress" },
    { title: "Science Quiz", available: "Fixed - Nov 15, 2023", duration: "1 hr", fee: "$30", questions: 30, status: "Completed" },
    { title: "History Test", available: "Dec 1 - Dec 31", duration: "1.5 hrs", fee: "$40", questions: 40, status: "Pending" },
    { title: "English Exam", available: "Nov 20 - Dec 20", duration: "2 hrs", fee: "$45", questions: 45, status: "In Progress" },
    { title: "Geography Quiz", available: "Fixed - Dec 10, 2023", duration: "1 hr", fee: "$25", questions: 25, status: "Completed" },
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
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className="text-lg font-bold mb-2 md:mb-0">All Exams</h2>
        <a
          href="#"
          className="text-primary font-semibold flex items-center space-x-2 hover:underline transition duration-200"
        >
          <span>See All</span>
          <FiArrowRight /> {/* React Icon for arrow */}
        </a>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Available Between/Fixed (EST)</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title}</td>
                <td className="p-4">{exam.available}</td>
                <td className="p-4">{exam.duration}</td>
                <td className="p-4">{exam.fee}</td>
                <td className="p-4">{exam.questions}</td>
                <td className="p-4">{getStatusBadge(exam.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
