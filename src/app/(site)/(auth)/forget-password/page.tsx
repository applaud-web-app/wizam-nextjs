import React from "react";
import ForgotPassword from "@/components/Auth/ForgetPassword";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Wizam - The Knowledge Academy",
  description:
    "Reset your Wizam account password easily. If you’ve forgotten your password, follow the instructions to securely regain access to your Wizam account and continue your exam preparations.",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
