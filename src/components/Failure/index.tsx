// pages/failure.tsx
import { FC } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const Failure: FC = () => {
  return (
    <div className="container mx-auto text-center py-12 px-4 md:px-8 lg:px-16">
      {/* Failure Icon and Message */}
      <div className="mb-10">
        <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Oops! Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your transaction could not be completed. Please try again or contact support.
        </p>
      </div>


      {/* Retry or Go Back */}
      <div className="mb-10">
       
        <Link href="/" passHref>
          <button className="bg-red-500 text-white px-8 py-3 rounded-lg shadow hover:bg-red-700 transition-colors duration-300">
            Back to Home
          </button>
        </Link>
      
      </div>
    </div>
  );
};

export default Failure;
