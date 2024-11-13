"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/Components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import PreLoader from "@/Components/Common/PreLoader";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter for redirection if needed
import Header from "@/Components/MainHeader";
import Footer from "@/Components/MainFooter";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import axios from "axios";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

// Import the Nunito font from next/font/google
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteProvider } from "@/context/SiteContext"; // Import SiteProvider
import { SyllabusProvider } from "@/context/SyllabusContext";

// Load the Nunito font
const plus_jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // You can load multiple weights as needed
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

    // Add Axios interceptor to attach tokens for API requests
    const token = localStorage.getItem("token");

    // Attach token to Axios requests
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor to handle errors like 401 (Unauthorized)
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear token and redirect to the login page if token is invalid
          localStorage.removeItem("token");
          router.push("/signin"); // Redirect to sign-in if unauthorized
        }
        return Promise.reject(error);
      }
    );
  }, [router]);

  // Decide whether to hide the header and footer on certain pages
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
      className={`${plus_jakarta.className} !scroll-smooth`}
      lang="en"
    >
      <head />
      <body className="light">
        {loading ? (
          <PreLoader />
        ) : (
          <SessionProvider>
            <SiteProvider> {/* Wrap the entire app with SiteProvider */}
            <SyllabusProvider>
              <ThemeProvider
                attribute="class"
                enableSystem={false}
                forcedTheme="light"
                defaultTheme="light"
              >
                <ProgressBar
                  height="4px"
                  color="#3394c6"
                  options={{ showSpinner: true }}
                  shallowRouting
                />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                {!noHeaderFooter && <Header />}
                {children}
                {!noHeaderFooter && <Footer />}
                <ScrollToTop />
              </ThemeProvider>
              </SyllabusProvider>
            </SiteProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
