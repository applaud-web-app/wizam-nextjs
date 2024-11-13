import React from "react";
import ResetPassword from "@/components/Auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Wizam - The Knowledge Academy",
  description:
    "Reset your Wizam account password easily. Enter your new password and confirm it to regain access to your Wizam account and continue your exam preparations.",
};

const ResetPasswordPage = () => {
  return (
    <>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
