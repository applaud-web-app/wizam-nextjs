import Breadcrumb from "@/Components/Common/Breadcrumb";
import NotFound from "@/Components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page | Wizam - Exam Preparation & Test Academy",
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
