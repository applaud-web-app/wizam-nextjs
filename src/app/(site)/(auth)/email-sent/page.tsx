// app/email-sent/page.tsx

import React from "react";
import EmailSent from "@/Components/Auth/EmailSent";

// Metadata for the page
export const metadata = {
  title: "Email Sent | Wizam - The Knowledge Academy",
  description:
    "Check your email for password reset instructions. If you've requested a password reset, follow the steps in the email to reset your Wizam account password.",
};

// EmailSentPage component
const EmailSentPage = () => {
  return (
    <main>
      <EmailSent />
    </main>
  );
};

export default EmailSentPage;
