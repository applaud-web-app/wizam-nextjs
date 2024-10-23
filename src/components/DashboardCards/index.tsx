import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  iconColor: string; // Add a prop for icon color
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content, icon, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center space-x-4">
        {/* Icon with dynamic color in a rounded container */}
        <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 ${iconColor} text-3xl`}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-1">{title}</h2>
          <p className="text-defaultcolor text-4xl font-semibold">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
