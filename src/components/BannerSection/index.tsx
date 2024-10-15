"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import AliceCarousel from 'react-alice-carousel'; // Importing Alice Carousel
import 'react-alice-carousel/lib/alice-carousel.css'; // Importing carousel styles
import { FC, useState } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

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

  // State to manage if the video should be shown
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayButtonClick = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-12 sm:py-16 lg:py-20"
      style={{
        backgroundImage: `url('/images/banner-wave.png')`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-white opacity-75"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Alice Carousel Section */}
        <div className="relative text-center mb-8">
          <AliceCarousel
            mouseTracking
            infinite
            autoPlay
            autoPlayInterval={3000}
            disableDotsControls
            renderPrevButton={() => (
              <button className="absolute left-0 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full transition">
                <MdOutlineKeyboardArrowLeft  size={36} />
              </button>
            )}
            renderNextButton={() => (
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full transition">
                <MdOutlineKeyboardArrowRight  size={36} />
              </button>
            )}
            items={carouselItems.map((item, index) => (
              <div key={index} className="item">
                <h2
                  className="mb-6 max-w-4xl mx-auto text-2xl sm:text-3xl lg:text-6xl font-bold text-white leading-snug sm:leading-snug lg:leading-tight"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }} // Custom text shadow
                >
                  {item.heading}
                </h2>

                <Link href={item.buttonLink}>
                  <span className="inline-block mt-4 primary-button">
                    {item.buttonText}
                  </span>
                </Link>
              </div>
            ))}
          />
        </div>

        {/* Banner Image Section */}
        <div className="relative mt-6 bg-white/20 p-2 sm:p-3 lg:p-3 rounded-lg max-w-full sm:max-w-[600px] lg:max-w-[900px] h-[300px] sm:h-[400px] lg:h-[480px] mx-auto">
          {isVideoPlaying ? (
            // Render the YouTube video iframe when play button is clicked
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/mc7L3NhitUs"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          ) : (
            // Render the image and play button if the video hasn't started
            <>
              <Image
                src="/images/hero/banner.png"
                alt="Wizam Banner"
                layout="fill"
                objectFit="cover"
                className="mx-auto rounded-lg"
              />

              {/* Play Button and Logo Overlay */}
              <div className="absolute text-center top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 space-y-4 sm:space-y-6 lg:space-y-6 pt-8 sm:pt-12 lg:pt-16">
                <button
                  className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-secondary hover:bg-secondary-dark rounded-full text-primary text-xl sm:text-3xl transition transform duration-300 ease-in-out hover:scale-110 animate-pulse shadow-lg"
                  aria-label="Play Video"
                  onClick={handlePlayButtonClick}
                >
                  <FaPlay />
                </button>

                <Image
                  src="/images/logo/wizam-logo.png"
                  alt="Wizam Logo"
                  width={200}
                  height={60}
                  quality={100}
                  className="w-[160px] sm:w-[200px] lg:w-[260px] h-auto object-contain mx-auto"
                />
                <p className="text-tertiary text-md sm:text-lg lg:text-3xl font-bold">
                  In 2 min...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
