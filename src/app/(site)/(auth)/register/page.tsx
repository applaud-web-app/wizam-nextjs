// app/signup/page.tsx
import SignUp from "@/components/Auth/SignUp";
import { Metadata } from "next";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Register | Wizam - Test Preparation Platform",
  description:
    "Register up for Wizam and unlock access to personalized dashboards, test preparation resources, and more. Join the Wizam community today and start your journey to success!",
  openGraph: {
    title: "Register Up | Wizam - Test Preparation Platform",
    description:
      "Register up for Wizam and unlock access to personalized dashboards, test preparation resources, and more. Join the Wizam community today and start your journey to success!",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/register`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register Up | Wizam - Test Preparation Platform",
    description:
      "Register up for Wizam and unlock access to personalized dashboards, test preparation resources, and more. Join the Wizam community today and start your journey to success!",
  },
};

const RegisterPage = () => {
  return (
    <>
      {/* Sign-Up Component */}
      <SignUp />
    </>
  );
};

export default RegisterPage;
