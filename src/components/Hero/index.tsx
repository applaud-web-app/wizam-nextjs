"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import axios from "axios";

// Define the structure of the banner data
interface Banner {
  title: string;
  description: string;
  image: string;
  button_text: string;
  button_link: string;
}

const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        if (response.data.status) {
          setBanners(response.data.data);
        } else {
          setError("Failed to fetch banners.");
        }
      } catch (err) {
        setError("An error occurred while fetching banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <p>Loading banners...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Prepare carousel items from fetched banners
  const items = banners.map((banner, index) => (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-6 lg:px-12"
      key={index}
    >
      {/* Left Side: Text Content */}
      <div>
        <div className="hero-content text-left mb-12">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-[70px] lg:leading-snug">
            {banner.title}
          </h1>
          <p className="mb-9 text-base font-medium text-gray-300 sm:text-lg sm:leading-relaxed">
            {banner.description}
          </p>
          <Link
            href={banner.button_link}
            className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg text-white transition duration-300 ease-in-out hover:bg-primary"
          >
            {banner.button_text}
          </Link>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-full max-w-[400px] mx-auto lg:max-w-full">
        <Image
          src={banner.image}
          alt={banner.title}
          className="w-full h-auto"
          width={845}
          height={316}
        />
      </div>
    </div>
  ));

  // Custom Arrow Buttons for Carousel
  const renderPrevButton = () => {
    return (
      <button className="absolute left-0 -translate-x-[120%] top-1/2 transform -translate-y-1/2 text-secondary z-20 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };

  const renderNextButton = () => {
    return (
      <button className="absolute right-0 translate-x-[120%] top-1/2 transform -translate-y-1/2 text-secondary z-20 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };

  return (
    <>
      <section id="home" className="relative overflow-hidden bg-[#001d21] py-16 lg:pb-24 lg:pt-16">
        <div className="container mx-auto px-4 relative">
          {/* Alice Carousel with custom arrows */}
          <AliceCarousel
            autoPlay
            autoPlayInterval={5000}
            infinite
            items={items}
            disableDotsControls={true} // Disable dots
            renderPrevButton={renderPrevButton}
            renderNextButton={renderNextButton}
          />
        </div>

        <div className="absolute -bottom-8 w-full z-10">
          <Image
            src="/images/hero/vector.png"
            alt="hero"
            className="mx-auto w-full max-w-full"
            width={1920}
            height={300}
          />
        </div>
      </section>

      
    </>
  );
};

export default Hero;
