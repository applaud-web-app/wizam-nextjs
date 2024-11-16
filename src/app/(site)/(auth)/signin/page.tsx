// app/signin/page.tsx
import Signin from "@/components/Auth/SignIn";
import { Metadata } from "next";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Sign In | Wizam - Test Preparation Platform",
  description:
    "Sign in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
  openGraph: {
    title: "Sign In | Wizam - Test Preparation Platform",
    description:
      "Sign in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/signin`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Wizam - Test Preparation Platform",
    description:
      "Sign in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
  },
};

const SigninPage = () => {
  return (
    <>
      {/* Sign-In Component */}
      <Signin />
    </>
  );
};

export default SigninPage;
