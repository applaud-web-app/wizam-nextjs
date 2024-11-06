import Breadcrumb from "@/components/Common/Breadcrumb";
import Failure from "@/components/Failure";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Failure - Wizam | Exam Preparation and Test Academy",
};

const FailurePage = () => {
  return (
    <>
      <Breadcrumb pageName="Payment Failed" />

      <Failure />

    </>
  );
};

export default FailurePage;
