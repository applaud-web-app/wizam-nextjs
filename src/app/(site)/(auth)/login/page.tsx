// app/signin/page.tsx
import Signin from "@/components/Auth/SignIn";
import { Metadata } from "next";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Log In | Wizam - Test Preparation Platform",
  description:
    "Log in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
  openGraph: {
    title: "Log In | Wizam - Test Preparation Platform",
    description:
      "Log in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Log In | Wizam - Test Preparation Platform",
    description:
      "Log in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
  },
};

const LoginPage = () => {
  return (
    <>
      {/* Sign-In Component */}
      <Signin />
    </>
  );
};

export default LoginPage;
