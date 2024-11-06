"use client";

import { FC, useEffect } from "react";


import { useRouter } from "next/navigation"; // Use router to redirect
import Cookies from "js-cookie";
import Loader from "../Common/Loader";

const Success: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const returnUrl = Cookies.get("redirect_url");
    if (returnUrl) {
      router.push(returnUrl); // Redirect to the return URL if it exists
    } else {
      router.push("/"); // Otherwise, redirect to the home page
    }
  }, [router]);

 

  return (
    <Loader />
  );
};

export default Success;
