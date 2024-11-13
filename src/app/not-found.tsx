import Breadcrumb from "@/components/Common/Breadcrumb";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Wizam - Exam Preparation & Test Academy",
  description: "Oops! The page you're looking for doesn't exist. Return to Wizam, the leading platform for exam preparation and testing, and continue your journey to success."
};

const ErrorPage = () => {
  return (
    <>
      <Breadcrumb pageName="404 Page" />
      <NotFound />
    </>
  );
};

export default ErrorPage;
