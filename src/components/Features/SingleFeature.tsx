"use client";

import React from "react";
import Link from "next/link";

// Define the Feature type
interface Feature {
  icon: React.ReactNode; // icon can be a React component or JSX element
  title: string;         // title is a string
  paragraph: string;     // paragraph is a string
  btn?: string;          // btn is optional and is a string
  btnLink?: string;      // btnLink is optional and is a string (URL)
}

// SingleFeature component
const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph, btn, btnLink } = feature;

  return (
    <div className="w-full p-6 bg-white border border-yellow-500 shadow-sm rounded-[20px] transition hover:shadow-lg text-center">
      <div className="wow fadeInUp group mb-8" data-wow-delay=".15s">
        <div className="relative z-10 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-yellow-500 mx-auto mb-5">
          <span className="absolute left-0 top-0 z-[-1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-2xl bg-yellow-400 bg-opacity-20 duration-300 group-hover:rotate-45"></span>
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-dark dark:text-white">
          {title}
        </h3>
        <p className="mb-1 text-body-color dark:text-gray-300">{paragraph}</p>
      
      </div>
    </div>
  );
};



export default SingleFeature;
