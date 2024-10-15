// pages/success.tsx
import { FC } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const Success: FC = () => {
  return (
    <div className="container mx-auto text-center py-12 px-4 md:px-8 lg:px-16">
      {/* Success Icon and Message */}
      <div className="mb-10">
        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your transaction was successful. We appreciate your business.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg  mb-10 border border-gray-200 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Order Summary
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

      {/* Email Confirmation */}
      <div className="mb-10">
        <p className="text-lg text-gray-600 mb-2">
          <FaEnvelope className="inline-block text-primary mr-2" />
          We’ve sent a confirmation email to{' '}
          <strong>your-email@example.com</strong>.
        </p>
        <p className="text-gray-600">
          If you have any questions, please contact us at{' '}
          <strong>support@example.com</strong>.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Link href="/" passHref>
          <button className="primary-button">
            Back to Home
          </button>
        </Link>

        {/* View Invoice Button */}
        <Link href="/invoice" >
          <button className="secondary-button">
            View Invoice
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
