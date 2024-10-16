import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Success: FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session_id) {
      // Fetch session details from API
      fetch(`/api/stripe/session?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setSessionDetails(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load session details');
          setLoading(false);
        });
    }
  }, [session_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="py-16">
      <div className="container mx-auto text-center px-6 lg:px-12">
        {/* Success Icon and Message */}
        <div className="mb-12">
          <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Thank You for Your Purchase!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your transaction was successful, and we appreciate your business.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-lg border border-gray-300 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Order Summary</h2>
          <table className="table-auto w-full text-left text-gray-600">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold">Product:</td>
                <td className="py-3">
                  {sessionDetails?.line_items?.data[0]?.description || 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">Price:</td>
                <td className="py-3">
                  {sessionDetails?.amount_total
                    ? `$${(sessionDetails.amount_total / 100).toFixed(2)}`
                    : 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">Transaction ID:</td>
                <td className="py-3">{sessionDetails?.payment_intent?.id || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">Date:</td>
                <td className="py-3">
                  {sessionDetails?.created
                    ? new Date(sessionDetails.created * 1000).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/" passHref>
            <span className="bg-primary hover:bg-secondary text-secondary hover:text-primary py-3 px-6 rounded-full text-lg font-semibold transition duration-300">
              Back to Home
            </span>
          </Link>
          <Link href="/invoice" passHref>
            <span className="bg-secondary hover:bg-secondary-dark text-white py-3 px-6 rounded-full text-lg font-semibold transition duration-300">
              View Invoice
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
