import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi"; // Import the check icon

const WhyChoose = () => {
  return (
    <section className="pb-20 pt-20">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-[50px] mb-4 drop-shadow-xl">Why Choose</h2>
          <div className="flex justify-center items-center">
            <Image src="/images/logo/choose-logo.png" alt="wizam logo" width={348} height={80} />
          </div>
        </div>

        {/* Grid Layout for Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
       
            <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
            <span className="text-lg font-semibold text-gray-800">Real Exam Questions</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
          <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
          <span className="text-lg font-semibold text-gray-800">Real Exam Questions</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
          <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
          <span className="text-lg font-semibold text-gray-800">Focused Exam</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
          <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
          <span className="text-lg font-semibold text-gray-800">Focused Exam</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
          <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
          <span className="text-lg font-semibold text-gray-800">Increased Efficiency</span>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center">
          <Image src="/images/check-mark.png" alt="wizam logo" className=" mr-4" width={40} height={40} />
          <span className="text-lg font-semibold text-gray-800">Increased Efficiency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;

