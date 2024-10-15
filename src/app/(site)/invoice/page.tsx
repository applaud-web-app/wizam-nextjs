import CallToAction from "@/components/CallToAction";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Invoice from "@/components/Common/Invoice";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Invoice Us - Wizam | Exam Preparation and Test Academy",
    description: "Get in touch with Wizam for inquiries related to exam preparation, test resources, or any other support. Invoice us via phone, email, or visit our London office.",
  };

const InvoicePage = () => {
  return (
    <>
      {/* <Breadcrumb pageName="Invoice Us" /> */}
      {/* Reusable Invoice Component */}
      <Invoice
        productName="Dental Subscription Plan"
        price="49.99"
        transactionId="98765ZYXWVU"
        date="October 15, 2024"
        email="johndoe@example.com"
        billingAddress="1234 Elm Street, Springfield, IL, USA"
        subscriptionPeriod="Annual"
        nextBillingDate="October 15, 2025"
        subscriptionPrice="49.99"
        companyName="Dental Health Corp"
        companyAddress="456 Maple Avenue, Springfield, IL, USA"
        companyEmail="support@dentalhealthcorp.com"
        ownerName="Dr. Alice Cooper"
      />
      {/* <CallToAction /> */}

    </>
  );
};

export default InvoicePage;
