// app/layout.tsx

"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import 'flowbite';
import { usePathname } from "next/navigation"; 
import Header from "@/components/MainHeader";
import Footer from "@/components/MainFooter";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  // Ensure loading effects only run on the client side
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Make sure the progress bar is executed only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // This ensures that the document or window is only accessed client-side
      // No need for document or window-specific logic here, but the useEffect ensures client-side only
    }
  }, [pathname]);

  const noHeaderFooter =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forget-password" ||
    pathname === "/reset-password" ||
    pathname === "/email-sent" ||
    pathname.startsWith("/dashboard");

  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">
      <head />
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
            >
              <ProgressBar
                height="4px"
                color="#3394c6"
                options={{ showSpinner: true }}
                shallowRouting
              />
              {!noHeaderFooter && <Header />}
              {children}
              {!noHeaderFooter && <Footer />}
              <ScrollToTop />
            </ThemeProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
