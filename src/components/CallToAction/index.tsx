import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="relative z-10 overflow-hidden bg-[#faf8ed] py-20">
      <div className="container mx-auto">
        <div className="text-center">
          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Ready to Get Started?
          </h2>

          {/* Description */}
          <p className="mb-8 max-w-xl mx-auto text-lg leading-relaxed text-gray-600">
            Study at your own pace, at the comforts of your own home, and get
            instant feedback from more than 600 high-quality questions.
          </p>

          {/* Button */}
          <Link
            href="/"
            className="inline-block rounded-full bg-secondary px-8 py-4 text-lg  text-white shadow-md transition hover:bg-[#56a528]"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Background SVG Decorations */}
      <div>
        <span className="absolute left-0 top-0">
          <svg
            width="495"
            height="470"
            viewBox="0 0 495 470"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="55"
              cy="442"
              r="138"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="50"
            />
            <circle
              cx="446"
              r="39"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="20"
            />
            <path
              d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z"
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="12"
            />
          </svg>
        </span>
        <span className="absolute bottom-0 right-0">
          <svg
            width="493"
            height="470"
            viewBox="0 0 493 470"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="462"
              cy="5"
              r="138"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="50"
            />
            <circle
              cx="49"
              cy="470"
              r="39"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="20"
            />
            <path
              d="M222.393 226.701L272.808 213.192L259.299 263.607L222.393 226.701Z"
              stroke="white"
              strokeOpacity="0.06"
              strokeWidth="13"
            />
          </svg>
        </span>
      </div>
    </section>
  );
};

export default CallToAction;
