"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { FC, useState, useEffect, useMemo } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";

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
  const [carouselInitialized, setCarouselInitialized] = useState(false);

  // Fetch banner data from the API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
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

  // Function to handle carousel initialization
  const handleCarouselInitialized = () => {
    setCarouselInitialized(true);
  };

  // Prepare carousel items with unique keys and optimized styles
  const preparedItems = useMemo(
    () =>
      carouselItems.map((item, index) => (
        <div
          key={`carousel-item-${index}`}
          className="item flex flex-col items-center justify-center"
        >
          <h2
            className="mb-6 max-w-4xl mx-auto text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-snug sm:leading-snug lg:leading-tight"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
          >
            {item.title}
          </h2>
          <p className="mb-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-2xl text-white leading-relaxed">
            {item.description}
          </p>

          <Link href={item.button_link} className="inline-block mt-4 primary-button">
            {item.button_text}
          </Link>
        </div>
      )),
    [carouselItems]
  );

  // Function to sanitize and format YouTube links
  const getYouTubeEmbedLink = (link: string): string => {
    try {
      const url = new URL(link);
      if (url.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${url.pathname.slice(1)}?autoplay=1`;
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

      <div className="container mx-auto  relative z-10">
        {loading ? (
          <div className="text-center text-white py-20">
            <p>Loading banners...</p>
          </div>
        ) : (
          <>
            {/* Alice Carousel Section */}
            <div className="relative text-center mb-8 min-h-[200px]">
              {carouselItems.length > 0 && (
                <AliceCarousel
                  mouseTracking
                  infinite
                  autoPlay
                  autoPlayInterval={3000}
                  disableDotsControls
                  disableButtonsControls={false} // Enable buttons controls
                  autoPlayStrategy="none" // Improve looping behavior
                  responsive={{
                    0: { items: 1 },
                    600: { items: 1 },
                    1024: { items: 1 },
                  }}
                  onInitialized={handleCarouselInitialized}
                  renderPrevButton={() => (
                    <button
                      className={`absolute lg:left-0 -left-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full transition ${
                        carouselInitialized ? "opacity-100" : "opacity-0"
                      }`}
                      aria-label="Previous Slide"
                    >
                      <MdOutlineKeyboardArrowLeft size={36} />
                    </button>
                  )}
                  renderNextButton={() => (
                    <button
                      className={`absolute lg:right-0 -right-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full transition ${
                        carouselInitialized ? "opacity-100" : "opacity-0"
                      }`}
                      aria-label="Next Slide"
                    >
                      <MdOutlineKeyboardArrowRight size={36} />
                    </button>
                  )}
                  items={preparedItems}
                  animationDuration={1000} // Smooth transitions
                  controlsStrategy="responsive"
                  touchMoveDefaultEvents={false}
                />
              )}
            </div>

            {/* Banner Image Section */}
            <div className="relative mt-6 bg-white/20 p-2 sm:p-3 lg:p-3 rounded-lg max-w-full sm:max-w-[600px] lg:max-w-[835px] h-[190px] sm:h-[400px] lg:h-[480px] mx-auto">
              {isVideoPlaying && youtubeLink ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedLink(youtubeLink)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              ) : (
                <>
                  <Image
                    src="/images/hero/banner.png"
                    alt="Wizam Banner"
                    layout="fill"
                    objectFit="cover"
                    className="mx-auto p-3 rounded-lg"
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
