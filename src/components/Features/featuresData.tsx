import { Feature } from "@/types/feature";
import { FiBookOpen, FiActivity, FiUserCheck, FiBarChart2, FiHelpCircle } from "react-icons/fi"; // Feather icons from react-icons

const featuresData: Feature[] = [
  {
    id: 1,
    icon: <FiBookOpen size={35} className="text-white" />,
    title: "Comprehensive Study Guides",
    paragraph: "Our comprehensive study guides provide in-depth coverage of all major topics, ensuring that you have the resources you need to fully understand and retain the material. Each guide is structured to simplify complex concepts and enhance your exam readiness.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 2,
    icon: <FiActivity size={35} className="text-white" />,
    title: "Practice Tests & Quizzes",
    paragraph: "Prepare effectively with practice tests and quizzes that closely simulate the actual exam experience. These tests cover a wide range of topics and are designed to help you identify your strengths and areas that need improvement.",
    btn: "Take a Test",
    btnLink: "/#",
  },
  {
    id: 3,
    icon: <FiUserCheck size={35} className="text-white" />,
    title: "One-on-One Tutoring",
    paragraph: "Receive personalized guidance through our one-on-one tutoring sessions, tailored to address your specific needs. Whether you need help understanding tricky topics or refining your exam strategies, our expert tutors are here to assist you every step of the way.",
    btn: "Schedule a Session",
    btnLink: "/#",
  },
 
];

export default featuresData;
