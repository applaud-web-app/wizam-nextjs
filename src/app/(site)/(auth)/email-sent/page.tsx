import React from "react";
import EmailSent from "@/components/Auth/EmailSent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Sent | Wizam - The Knowledge Academy",
  description:
    "Check your email for password reset instructions. If you've requested a password reset, follow the steps in the email to reset your Wizam account password.",
};

const EmailSentPage = () => {
  return (
    <>
      <EmailSent />
    </>
  );
};

export default EmailSentPage;
