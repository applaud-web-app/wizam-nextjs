import SignUp from "@/components/Auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Wizam - Test Preparation Platform",
  description:
    "Sign in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
};

const SignupPage = () => {
  return (
    <>

      <SignUp />
    </>
  );
};

export default SignupPage;
