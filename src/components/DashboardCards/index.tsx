import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  iconColor: string; // Add a prop for icon color
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content, icon, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center">
        {/* Icon with dynamic color */}
        <div className={`${iconColor} text-4xl mr-4`}>{icon}</div> {/* Apply dynamic color to icon */}
        <div>
          <h2 className="text-lg font-semibold text-defaultcolor-dark">{title}</h2> {/* Use a slightly darker defaultcolor color */}
          <p className="text-gray-600 mt-2 text-base">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
