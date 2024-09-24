import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi"; // Import the check icon

const WhyChoose = () => {
  return (
    <section className="pb-20 pt-20">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-0">Why Choose</h2>
          <div className="flex justify-center items-center">
            <Image src="/images/logo/wizam-logo.png" alt="wizam logo" width={180} height={40} />
          </div>
        </div>

        {/* Grid Layout for Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Real Exam Questions</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Real Exam Questions</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Focused Exam</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Focused Exam</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Increased Efficiency</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex items-center">
            <FiCheckCircle className="text-green-500 w-8 h-8 mr-4" />
            <span className="text-lg font-medium text-gray-800">Increased Efficiency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;

