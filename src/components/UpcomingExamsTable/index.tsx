import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon from react-icons

export default function UpcomingExamsCard() {
  // Sample data for the upcoming exams
  const exams = [
    { title: "Physics Exam", availableBetween: "Sept 28 - Oct 5", fees: "$15", duration: "1.5 hrs", questions: 40, status: "Scheduled" },
    { title: "Math Quiz", availableBetween: "Sept 30 - Oct 7", fees: "$10", duration: "1 hr", questions: 25, status: "Scheduled" },
    { title: "Chemistry Test", availableBetween: "Oct 1 - Oct 8", fees: "$20", duration: "2 hrs", questions: 50, status: "Completed" },
    { title: "Biology Exam", availableBetween: "Oct 3 - Oct 10", fees: "$12", duration: "1.5 hrs", questions: 35, status: "In Progress" },
    { title: "History Quiz", availableBetween: "Oct 5 - Oct 12", fees: "$8", duration: "1 hr", questions: 20, status: "Pending" },
  ];

  // Function to return the appropriate badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Scheduled</span>;
      case "In Progress":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">In Progress</span>;
      case "Completed":
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Completed</span>;
      case "Pending":
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Unknown</span>;
    }
  };

  return (
    <div className="p-5 bg-white shadow-sm rounded-lg mb-8">
      {/* Flexbox container for heading and "See All" link */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-lg font-bold mb-4 md:mb-0">Upcoming Exams (7 Days)</h2>
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
              <th className="p-3 text-left hidden sm:table-cell">Available Between</th>
              <th className="p-3 text-left hidden sm:table-cell">Fees</th>
              <th className="p-3 text-left hidden md:table-cell">Duration</th>
              <th className="p-3 text-left hidden md:table-cell">Questions</th>
              <th className="p-3 text-left rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title}</td>
                <td className="p-4 hidden sm:table-cell">{exam.availableBetween}</td>
                <td className="p-4 hidden sm:table-cell">{exam.fees}</td>
                <td className="p-4 hidden md:table-cell">{exam.duration}</td>
                <td className="p-4 hidden md:table-cell">{exam.questions}</td>
                <td className="p-4">{getStatusBadge(exam.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
