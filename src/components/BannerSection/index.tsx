"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import AliceCarousel from 'react-alice-carousel'; // Importing Alice Carousel
import 'react-alice-carousel/lib/alice-carousel.css'; // Importing carousel styles
import { FC } from "react";

// Define the type for carousel items
interface CarouselItem {
  heading: string;
  buttonText: string;
  buttonLink: string;
}

const BannerSection: FC = () => {
  // Define the carousel items
  const carouselItems: CarouselItem[] = [
    {
      heading: "Prepare for Upcoming Exams with Wizam",
      buttonText: "Get Started",
      buttonLink: "/",
    },
    {
      heading: "Unlock Your Potential with Expert Guidance",
      buttonText: "Join Now",
      buttonLink: "/join",
    },
    {
      heading: "Achieve Your Goals with Comprehensive Resources",
      buttonText: "Explore Courses",
      buttonLink: "/courses",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-16 sm:py-16 lg:py-20"
      style={{
        backgroundImage: `url('/images/banner-wave.jpg')`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-white opacity-75"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Alice Carousel Section */}
        <div className="text-center mb-8">
          <AliceCarousel
            mouseTracking
            infinite
            autoPlay
            autoPlayInterval={3000}
            disableButtonsControls
            disableDotsControls
            items={carouselItems.map((item, index) => (
              <div key={index} className="item">
                <h2
                  className="mb-6 max-w-4xl mx-auto text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-snug sm:leading-snug lg:leading-tight"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }} // Custom text shadow
                >
                  {item.heading}
                </h2>

                <Link href={item.buttonLink} className="primary-button">
                  {item.buttonText}
                </Link>
              </div>
            ))}
          />
        </div>

        {/* Banner Image Section */}
        <div className="relative mt-6 bg-white/20 p-3 rounded-[10px] max-w-[400px] sm:max-w-[600px] lg:max-w-[900px] h-[500px] mx-auto">
          <Image
            src="/images/hero/banner.png"
            alt="Wizam Banner"
            width={900}
            height={500}
            className="mx-auto w-full h-full rounded-[10px]"
          />

          {/* Play Button and Logo Overlay */}
          <div className="absolute text-center top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] space-y-8">
            <button
              className="flex items-center justify-center w-16 h-16 mx-auto bg-secondary hover:bg-secondary-dark rounded-full text-primary text-3xl transition transform duration-300 ease-in-out hover:scale-110 animate-pulse"
              aria-label="Play Video"
            >
              <FaPlay />
            </button>

            <Image
              src="/images/logo/wizam-logo.png"
              alt="Wizam Logo"
              width={260}
              height={80}
              quality={100}
              className="w-[260px] h-auto object-contain"
            />
            <p className="text-tertiary text-lg font-bold sm:text-xl lg:text-[30px]">
              In 2 min...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
