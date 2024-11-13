import Signin from "@/Components/Auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Wizam - Test Preparation Platform",
  description:
    "Sign in to Wizam and access your personalized dashboard to prepare for exams efficiently. Join the Wizam community today!",
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
