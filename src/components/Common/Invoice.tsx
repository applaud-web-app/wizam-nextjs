import { FC } from "react";
import {
  FaFileInvoice,
  FaUser,
  FaCalendarAlt,
  FaDollarSign,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

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
        <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-4xl mx-auto shadow-sm">
          {/* Invoice Header */}
          <div className="mb-6 text-center">
            <FaFileInvoice className="text-4xl text-gray-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-700 mb-1">Invoice</h1>
            <p className="text-xs text-gray-500">{companyName}</p>
            <p className="text-xs text-gray-500">{companyAddress}</p>
            <p className="text-xs text-gray-500">{companyEmail}</p>
          </div>

          {/* Billing Information */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start bg-gray-50 p-4 rounded-lg">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-1">
                <FaUser className="mr-2" /> Billed To:
              </h2>
              <p className="text-sm text-gray-600">{customerName}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaEnvelope className="mr-2" /> {email}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {billingAddress}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-1">
                <FaFileInvoice className="mr-2" /> Invoice Details:
              </h2>
              <p className="text-sm text-gray-600 flex items-center mb-1">
                <FaCalendarAlt className="mr-2" /> Invoice Date: {date}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaFileInvoice className="mr-2" /> Transaction ID: {transactionId}
              </p>
            </div>
          </div>

          {/* Subscription Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Subscription Summary
            </h2>
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-2 px-3 text-xs text-gray-700">Product</th>
                  <th className="py-2 px-3 text-xs text-gray-700">Period</th>
                  <th className="py-2 px-3 text-xs text-gray-700">Price</th>
                  <th className="py-2 px-3 text-xs text-gray-700">Next Billing Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 text-sm text-gray-600">{productName}</td>
                  <td className="py-2 px-3 text-sm text-gray-600">{subscriptionPeriod}</td>
                  <td className="py-2 px-3 text-sm text-gray-600 flex items-center">
                    <FaDollarSign className="mr-1" /> {subscriptionPrice}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">{nextBillingDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Summary</h2>
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 text-sm font-semibold text-gray-600">
                    Subtotal:
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600 flex items-center">
                    <FaDollarSign className="mr-1" /> {price}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 text-sm font-semibold text-gray-600">Tax:</td>
                  <td className="py-2 px-3 text-sm text-gray-600 flex items-center">
                    <FaDollarSign className="mr-1" /> 0.00
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-semibold text-gray-700">Total:</td>
                  <td className="py-2 px-3 text-sm text-gray-700 flex items-center">
                    <FaDollarSign className="mr-1" /> {price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Owner Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Owner Information</h2>
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <FaUser className="mr-2" /> Owner: {ownerName}
            </p>
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <FaEnvelope className="mr-2" /> {companyEmail}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> {companyAddress}
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Notes</h2>
            <p className="text-sm text-gray-600">
              If you have any questions regarding this invoice or your subscription, feel free to contact us at <strong>{companyEmail}</strong>.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">Thank you for your business!</p>
        </div>
      </div>
    </section>
  );
};

export default Invoice;
