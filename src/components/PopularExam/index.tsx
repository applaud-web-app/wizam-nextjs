import SectionTitle from "../Common/SectionTitle"; // Assuming you have a SectionTitle component
import Image from 'next/image';
import { FaArrowRight } from "react-icons/fa";
import Link from 'next/link'; // Import Next.js Link component

const PopularExams = () => {
  // Array of exam data
  const exams = [
    {
      id: 1,
      title: "Dental Nursing Preparation Exam 2024 NEBDN",
      description:
        "Prepare for the 2024 NEBDN exam with updated questions and solutions crafted by top dental experts. Based on the latest exam patterns.",
      price: "£14.90",
      oldPrice: "£18.90",
      image: "/images/exam/exam-1.jpg",
      link: "/exams/dental-nursing-prep-2024" // Link to exam details page
    },
    {
      id: 2,
      title: "Pharmacy Technician Exam Preparation 2024",
      description:
        "Ace the 2024 pharmacy technician certification with comprehensive material tailored to meet the latest industry standards and exam structure.",
      price: "£19.90",
      oldPrice: "£24.90",
      image: "/images/exam/exam-1.jpg",
      link: "/exams/pharmacy-technician-prep-2024"
    },
    {
      id: 3,
      title: "Medical Assistant Certification Exam Prep 2024",
      description:
        "Get ready for the 2024 Medical Assistant certification with detailed practice questions and expert-verified solutions covering all key topics.",
      price: "£16.50",
      oldPrice: "£20.00",
      image: "/images/exam/exam-1.jpg",
      link: "/exams/medical-assistant-prep-2024"
    },
  ];

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        {/* Section Title */}
        <SectionTitle title="Most Popular Exams" align="center" />

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
           
              <Link href={exam.link} key={exam.id} passHref className="block bg-white shadow-md rounded-lg overflow-hidden transition hover:shadow-lg">
                {/* Image */}
                <Image
                  src={exam.image}
                  width={500}
                  height={500}
                  alt={`Exam Image for ${exam.title}`}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  {/* Description */}
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-semibold text-gray-900">
                        {exam.price}
                      </span>
                      <span className="text-gray-400 line-through">
                        {exam.oldPrice}
                      </span>
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                      <FaArrowRight size={24} />
                    </div>
                  </div>
                </div>
              
            </Link>
          ))}
        </div>

        {/* More Exams Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 rounded-full bg-primary text-white font-medium transition hover:bg-primary-dark">
            More Exams
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularExams;
