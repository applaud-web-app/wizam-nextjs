import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon from react-icons

export default function QuizList() {
  // Sample data for quizzes
  const quizzes = [
    { title: "General Knowledge Quiz", available: "Nov 1 - Nov 30", duration: "1 hr", fee: "Free", questions: 25, status: "In Progress" },
    { title: "Science Quiz", available: "Fixed - Nov 15, 2023", duration: "1 hr", fee: "$10", questions: 30, status: "Completed" },
    { title: "History Quiz", available: "Dec 1 - Dec 31", duration: "1.5 hrs", fee: "$15", questions: 40, status: "Pending" },
    { title: "Math Quiz", available: "Nov 20 - Dec 20", duration: "1.5 hrs", fee: "$20", questions: 35, status: "In Progress" },
    { title: "Geography Quiz", available: "Fixed - Dec 10, 2023", duration: "1 hr", fee: "$10", questions: 30, status: "Completed" },
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
        <h2 className="text-lg font-bold mb-2 md:mb-0">All Quizzes</h2>
        <a
          href="#"
          className="text-secondary font-semibold flex items-center space-x-2 hover:underline transition duration-200"
        >
          <span>See All</span>
          <FiArrowRight /> {/* React Icon for arrow */}
        </a>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Available Between/Fixed (EST)</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{quiz.title}</td>
                <td className="p-4">{quiz.available}</td>
                <td className="p-4">{quiz.duration}</td>
                <td className="p-4">{quiz.fee}</td>
                <td className="p-4">{quiz.questions}</td>
                <td className="p-4">{getStatusBadge(quiz.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
