import CallToAction from "@/Components/CallToAction";
import Breadcrumb from "@/Components/Common/Breadcrumb";
import Contact from "@/Components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Us - Wizam | Exam Preparation and Test Academy",
    description: "Get in touch with Wizam for inquiries related to exam preparation, test resources, or any other support. Contact us via phone, email, or visit our London office.",
  };

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact Us" />
      <Contact />
      <CallToAction />

    </>
  );
};

export default ContactPage;
