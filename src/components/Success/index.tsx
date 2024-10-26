import { FC } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaEnvelope, FaHome } from 'react-icons/fa';
import { useRouter } from "next/navigation"; // Use router to redirect
import { toast } from "react-toastify"; // Import toast from react-toastify
import Cookies from "js-cookie";

const Success: FC = () => {
  const router = useRouter();

  const handleClick = () => {
    const returnUrl = Cookies.get("redirect_url");
    if (returnUrl) {
      router.push(returnUrl); // Redirect to the return URL if it exists
    } else {
      router.push("/"); // Otherwise, redirect to the home page
    }
  };

  return (
    <div className="relative bg-gray-50 py-10 md:py-16  ">
     
      <div className="container">
        <div className="mb-10 md:mb-12 mx-auto max-w-2xl text-center px-4 md:px-6 lg:px-12 relative z-10">
          <FaCheckCircle className="text-green-500 text-5xl md:text-6xl lg:text-7xl mx-auto mb-4 md:mb-6 animate-bounce" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            Thank You for Your Purchase!!!!!!!!!!!!!!!!
          </h1>
          <p className="text-md md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
            Your transaction was successful, and we truly appreciate your business. Keep an eye out for a confirmation email.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-3 md:space-x-4 mt-6 md:mt-8">
          <button onClick={handleClick} >
            <span className="inline-flex items-center bg-primary hover:bg-secondary text-secondary hover:text-white py-2 md:py-3 px-6  rounded-full text-sm md:text-base lg:text-lg font-semibold transition duration-300 transform hover:scale-105 text-center">
              <FaHome className="mr-2 text-center" /> Back to Homes
            </span>
          </button>
          <Link href="/invoice" passHref>
            <span className="inline-flex items-center bg-secondary hover:bg-secondary-dark text-white py-2 md:py-3 px-6  rounded-full text-sm md:text-base lg:text-lg font-semibold transition duration-300 transform hover:scale-105">
              <FaEnvelope className="mr-2" /> View Invoice
            </span>
          </Link>
        </div>

        {/* Subtle Animation for User Engagement */}
        <div className="mt-8 md:mt-10 animate-pulse text-center">
          <p className="text-sm md:text-md lg:text-lg text-gray-500">
            You will receive an email with further details shortly.
          </p>
        </div>
      </div>

     
    </div>
  );
};

export default Success;
