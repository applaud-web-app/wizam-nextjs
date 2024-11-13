import Breadcrumb from "@/Components/Common/Breadcrumb";
import Success from "@/Components/Success";
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
