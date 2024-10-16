import { FC } from "react";
import {
  FaFileInvoice,
  FaUser,
  FaCalendarAlt,
  FaDollarSign,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";
import Image from "next/image";

interface InvoiceProps {
  productName: string;
  price: string;
  transactionId: string;
  date: string;
  email: string;
  customerName?: string;
  billingAddress: string;
  subscriptionPeriod: string;
  nextBillingDate: string;
  subscriptionPrice: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  ownerName: string;
}

const Invoice: FC<InvoiceProps> = ({
  productName,
  price,
  transactionId,
  date,
  email,
  customerName = "Valued Customer",
  billingAddress,
  subscriptionPeriod,
  nextBillingDate,
  subscriptionPrice,
  companyName,
  companyAddress,
  companyEmail,
  ownerName,
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="bg-white p-8 rounded-xl  border border-gray-200 max-w-4xl mx-auto">
          {/* Header with Company Information */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-secondary mb-2">Invoice</h1>
              <p className="text-sm text-gray-600">{companyName}</p>
              <p className="text-sm text-gray-600">{companyAddress}</p>
              <p className="text-sm text-gray-600">{companyEmail}</p>
            </div>
           
            <Image src="/images/logo/wizam-logo.png" alt="Logo" className="w-auto h-10" width={100} height={100} />
          </div>

          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Customer Information */}
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Customer Information</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <FaUser className="mr-2" /> {customerName}
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="mr-2" /> {email}
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> {billingAddress}
                </p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Invoice Details</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2" /> Invoice Date: {date}
                </p>
                <p className="flex items-center">
                  <FaFileInvoice className="mr-2" /> Transaction ID: {transactionId}
                </p>
                <p className="flex items-center">
                  <FaCreditCard className="mr-2" /> Payment Method: Credit Card
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Summary */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">Subscription Summary</h2>
            <table className="w-full text-left">
              <thead className="bg-gray-200 text-sm">
                <tr>
                  <th className="py-3 px-4 text-gray-700">Product</th>
                  <th className="py-3 px-4 text-gray-700">Subscription Period</th>
                  <th className="py-3 px-4 text-gray-700">Price</th>
                  <th className="py-3 px-4 text-gray-700">Next Billing Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 text-gray-600">{productName}</td>
                  <td className="py-4 px-4 text-gray-600">{subscriptionPeriod}</td>
                  <td className="py-4 px-4 text-gray-600 flex items-center">
                    <FaDollarSign className="mr-1" /> {subscriptionPrice}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{nextBillingDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">Payment Summary</h2>
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Subtotal:</h3>
                <h3 className="text-sm font-semibold text-gray-600">Tax:</h3>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">Total:</h3>
              </div>
              <div className="text-right">
                <p className="text-sm flex items-center">
                  <FaDollarSign className="mr-1" /> {price}
                </p>
                <p className="text-sm flex items-center">
                  <FaDollarSign className="mr-1" /> 0.00
                </p>
                <p className="text-lg font-bold flex items-center text-gray-800">
                  <FaDollarSign className="mr-1" /> {price}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Owner Information</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center">
                <FaUser className="mr-2" /> Owner: {ownerName}
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" /> {companyEmail}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {companyAddress}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Notes</h2>
            <p className="text-sm text-gray-600">
              If you have any questions regarding this invoice or your subscription, feel free
              to contact us at <strong>{companyEmail}</strong>.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-10">
            Thank you for your business!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Invoice;
