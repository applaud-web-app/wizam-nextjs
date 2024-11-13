import CallToAction from "@/components/CallToAction";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Wizam | Affordable Exam Preparation Plans",
  description:
    "Explore Wizam's affordable pricing plans for exam preparation. Choose from basic, pro, or enterprise plans to access test resources and ace your exams.",
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing" />
      <Pricing />
      <CallToAction />
    </>
  );
};

export default PricingPage;
