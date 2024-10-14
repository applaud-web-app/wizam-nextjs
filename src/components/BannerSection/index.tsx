"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa"; // Importing the play icon from react-icons/fa

const BannerSection = () => {
  return (
<section className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-300 py-16 sm:py-16 lg:py-20">
<div className="container mx-auto px-4">
        {/* Text Section */}
        <div className="text-center mb-8">
          {/* Dynamic Heading */}
          <h2
            className="mb-6 text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-snug sm:leading-snug lg:leading-tight"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }} // Custom text shadow
            >
            Prepare for Upcoming <br /> Exams with Wizam
            </h2>


          {/* Dynamic Button */}
          <Link
            href="/"
            className="primary-button">
            Get Started
           
          </Link>
        </div>

        {/* Banner Image Section */}
        <div className="relative mt-12 bg-white/20 p-3 rounded-[10px] max-w-[400px] sm:max-w-[600px] lg:max-w-[900px] h-[500px] mx-auto">
          <Image
            src="/images/hero/banner.png" 
            alt="Wizam Banner"
            width={900}
            height={500}
            className="mx-auto w-full  h-full rounded-[10px]"
          />

         
          <div className="absolute text-center top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] space-y-12">
            <button
              className="flex items-center justify-center w-16 h-16 mx-auto bg-secondary hover:bg-secondary-dark rounded-full text-primary text-3xl transition transform duration-300 ease-in-out hover:scale-110 animate-pulse"
              aria-label="Play Video"
            >
              <FaPlay />
            </button>
            
              
                <Image src="/images/logo/wizam-logo.png" alt="" width={260} height={85} quality={100} className="w-[260px] h-auto object-contain" />
                <p className="text-tertiary text-lg font-bold sm:text-xl lg:text-[30px]"> In 2 min... </p>
              

          </div>
        </div>

       
      </div>
    </section>
  );
};

export default BannerSection;
