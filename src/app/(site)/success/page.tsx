import Breadcrumb from "@/components/Common/Breadcrumb";
import Success from "@/components/Success";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success - Wizam | Exam Preparation and Test Academy",
};

const SuccessPage = () => {
  return (
    <>
      <Breadcrumb pageName="Payment Status" />

      <Success />

    </>
  );
};

export default SuccessPage;
