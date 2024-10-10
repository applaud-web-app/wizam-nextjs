import React from "react";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className=" flex items-center justify-center  dark:bg-dark-2 py-20 lg:py-[60px]">
      <div className="container mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          {/* Left Side: 404 Illustration */}
          <div className="mb-0">
            <div className="relative mx-auto aspect-[129/138] max-w-[357px]">
              <Image
                src="/images/404.svg"
                alt="404 Not Found"
                fill
                className="mx-auto max-w-full dark:hidden"
              />
              <Image
                src="/images/404-dark.svg"
                alt="404 Not Found"
                fill
                className="mx-auto hidden max-w-full dark:block"
              />
            </div>
          </div>
          {/* Right Side: Text and Button */}
          <div className="w-full ">
            <div className="mb-8 animate-bounce">
              <svg
                width="327"
                height="132"
                viewBox="0 0 327 132"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* You can add the SVG design here */}
              </svg>
            </div>
            <h3 className="mb-4 text-3xl font-bold text-dark dark:text-white">
              Oops! We can't find the page you're looking for.
            </h3>
            <p className="mb-8 text-lg text-body-color dark:text-dark-6">
              The page might have been moved, deleted, or you may have mistyped the URL.
              Don't worry! You can head back to the homepage and continue exploring.
            </p>
            <Link href="/">
              <span className="inline-block rounded-full bg-primary px-8 py-3 text-base font-semibold text-white transition duration-300 transform hover:bg-primary-dark hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50">
                Go Back Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
