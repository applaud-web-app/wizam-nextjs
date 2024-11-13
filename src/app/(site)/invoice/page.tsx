// src/app/invoice/page.tsx

import CallToAction from "@/components/CallToAction";
import InvoiceGenerator from "@/components/Common/InvoiceGenerator"; // Adjust path if necessary


export const metadata = {
  title: "Invoice - Wizam | Exam Preparation and Test Academy",
  description:
    "Get in touch with Wizam for inquiries related to exam preparation, test resources, or any other support. Invoice us via phone, email, or visit our London office.",
};

const InvoicePage = () => {
  
  const sid = 1;
  return (
    <>
      {sid ? (
        <InvoiceGenerator  />
      ) : (
        <div>No invoice ID provided.</div>
      )}
      <CallToAction />
    </>
  );
};

export default InvoicePage;
