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

      {/* Transaction Error Summary (optional) */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10 border border-gray-200 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Transaction Details
        </h2>
        <table className="table-auto w-full text-left text-gray-600">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">Product:</td>
              <td className="py-3">Dental Nursing Course</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">Price:</td>
              <td className="py-3">$23.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">Transaction ID:</td>
              <td className="py-3">12345ABCDEF</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">Date:</td>
              <td className="py-3">October 12, 2024</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Retry or Go Back */}
      <div className="mb-10">
        <p className="text-lg text-gray-600 mb-6">
          <FaExclamationTriangle className="inline-block text-red-500 mr-2" />
          If the issue persists, please contact <strong>support@example.com</strong>.
        </p>
        <Link href="/" passHref>
          <button className="bg-red-500 text-white px-8 py-3 rounded-lg shadow hover:bg-red-700 transition-colors duration-300">
            Back to Home
          </button>
        </Link>
        <Link href="/retry-payment" passHref>
          <button className="ml-4 bg-gray-500 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-700 transition-colors duration-300">
            Retry Payment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Failure;
