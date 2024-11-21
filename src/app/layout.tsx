// app/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import PreLoader from "@/components/Common/PreLoader";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/MainHeader";
import Footer from "@/components/MainFooter";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteProvider } from "@/context/SiteContext";
import { SyllabusProvider } from "@/context/SyllabusContext";
import { SeoProvider } from "@/context/SeoContext"; // Import SeoProvider

const plus_jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    // Axios interceptors for attaching tokens and handling unauthorized responses
    const token = localStorage.getItem("token");

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      clearTimeout(timer);
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  // Determine if Header and Footer should be hidden on certain pages
  const noHeaderFooter =
    pathname === "/login" ||
    pathname === "/register" ||
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
            <SiteProvider>
              <SeoProvider> {/* Wrap with SeoProvider */}
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
              </SeoProvider>
            </SiteProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
