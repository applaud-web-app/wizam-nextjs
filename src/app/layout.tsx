"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import PreLoader from "@/components/Common/PreLoader";
import { usePathname } from "next/navigation";
import Header from "@/components/MainHeader";
import Footer from "@/components/MainFooter";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

// Import the Nunito font from next/font/google
import { Nunito } from 'next/font/google';

// Load the Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // You can load multiple weights as needed
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const noHeaderFooter =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forget-password" ||
    pathname === "/reset-password" ||
    pathname === "/email-sent" ||
    pathname.startsWith("/dashboard");

  return (
    <html
      suppressHydrationWarning={true}
      className={`${nunito.className} !scroll-smooth`}  // Apply Nunito font globally
      lang="en"
    >
      <head />
      <body className="light">
        {loading ? (
          <PreLoader />
        ) : (
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false} // Disable system theme detection
              forcedTheme="light" // Force light theme
              defaultTheme="light" // Light theme as default
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
