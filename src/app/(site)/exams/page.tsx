import CallToAction from "@/components/CallToAction";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Exams from "@/components/Exams";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exams - Wizam | Exam Preparation and Test Academy",
  description:
    "Wizam provides students with a variety of exam resources, including practice tests, study materials, and preparation guides, tailored to help them succeed in competitive exams.",
};

const ExamPage = () => {
  return (
    <main>
      <Breadcrumb pageName="Exams" />
      <Exams />

      <CallToAction />
      
    </main>
  );
};

export default ExamPage;
