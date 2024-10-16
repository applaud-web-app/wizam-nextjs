import CallToAction from "@/components/CallToAction";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Invoice from "@/components/Common/Invoice";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Invoice - Wizam | Exam Preparation and Test Academy",
    description: "Get in touch with Wizam for inquiries related to exam preparation, test resources, or any other support. Invoice us via phone, email, or visit our London office.",
  };

const InvoicePage = () => {
  return (
    <>
     
      <Invoice/>
      <CallToAction />

    </>
  );
};

export default InvoicePage;
