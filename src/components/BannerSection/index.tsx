"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { FC, useState, useEffect, useMemo } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface CarouselItem {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
}

const BannerSection: FC = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  // Fetch banner data from the API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/banners`
        );
        if (response.data.status) {
          setCarouselItems(response.data.data.banner);
          setYoutubeLink(response.data.data.youtube[0]?.description || null);
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  const handlePlayButtonClick = () => {
    setIsVideoPlaying(true);
  };

  // Prepare carousel items
  const preparedItems = useMemo(
    () =>
      carouselItems.map((item, index) => (
        <SwiperSlide key={`carousel-slide-${index}`}>
          <div className="item flex flex-col items-center justify-center">
            <h2
              className="mb-6 max-w-4xl mx-auto text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-snug sm:leading-snug lg:leading-tight"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
            >
              {item.title}
            </h2>
            <p className="mb-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-2xl text-white leading-relaxed">
              {item.description}
            </p>

            <Link
              href={item.button_link}
              className="inline-block mt-4 primary-button"
            >
              {item.button_text}
            </Link>
          </div>
        </SwiperSlide>
      )),
    [carouselItems]
  );

  // Function to sanitize and format YouTube links
  const getYouTubeEmbedLink = (link: string): string => {
    try {
      const url = new URL(link);
      if (url.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${url.pathname.slice(
          1
        )}?autoplay=1`;
      } else if (url.hostname.includes("youtube.com")) {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
      }
      return link;
    } catch (error) {
      console.error("Invalid YouTube URL:", link);
      return link;
    }
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

      <div className="container mx-auto relative z-10">
        {loading ? (
          <div className="text-center text-white py-20">
            <p>Loading banners...</p>
          </div>
        ) : (
          <>
            {/* Swiper Carousel Section with Custom Navigation */}
            <div className="relative text-center mb-8 min-h-[200px]">
              {carouselItems.length > 0 && (
                <>
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    loop
                    autoplay={{ delay: 5000 }}
                    speed={1000}
                    slidesPerView={1}
                    className="w-full"
                    navigation={{
                      prevEl,
                      nextEl,
                    }}
                  >
                    {preparedItems}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <div
                    ref={(node) => setPrevEl(node)}
                    className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 cursor-pointer transition"
                    aria-label="Previous Slide"
                  >
                    <MdOutlineKeyboardArrowLeft className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <div
                    ref={(node) => setNextEl(node)}
                    className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 cursor-pointer transition"
                    aria-label="Next Slide"
                  >
                    <MdOutlineKeyboardArrowRight className="text-white text-2xl sm:text-3xl" />
                  </div>
                </>
              )}
            </div>

            {/* Banner Image Section */}
            <div className="relative mt-6 bg-white/20 p-2 sm:p-3 lg:p-3 rounded-lg max-w-full sm:max-w-[600px] lg:max-w-[835px] h-[190px] sm:h-[400px] lg:h-[480px] mx-auto">
              {isVideoPlaying && youtubeLink ? (
                <div
                  className="video-container"
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    maxWidth: "100%",
                  }}
                >
                  <iframe
                    src={getYouTubeEmbedLink(youtubeLink)}
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                    allowFullScreen
                    title="YouTube video player"
                  ></iframe>
                </div>
              ) : (
                <>
                  <Image
                    src="/images/hero/banner.png"
                    alt="Wizam Banner"
                    layout="fill"
                  
                    objectFit="cover"
                    className="mx-auto h-auto p-3 rounded-lg"
                    priority
                 
                  />

                  {/* Play Button and Logo Overlay */}
                  <div className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-2 sm:space-y-6 lg:space-y-6">
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
                      className="w-[120px] sm:w-[200px] lg:w-[260px] h-auto object-contain mx-auto"
                     
                    />
                    <p className="text-tertiary text-md sm:text-lg lg:text-3xl font-bold">
                      In 1 minute
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
