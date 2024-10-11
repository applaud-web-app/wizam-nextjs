import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  popular?: boolean; // Optional prop to add the "Most Popular" badge
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonLabel,
  buttonLink,
  popular = false,
}) => {
  return (
    <div className="relative  rounded-lg shadow-sm p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 bg-white ">
      {/* Most Popular Badge */}
      {popular && (
        <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}

      {/* Title and Price */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <p className="text-4xl sm:text-5xl font-bold text-primary text-center mb-4">
        {price}
      </p>
      <p className="text-gray-500 text-center mb-6">Per month, billed annually</p>

      {/* Features List */}
      <ul className="text-gray-600 mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-3">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Call to Action Button */}
      <Link href={buttonLink}>
        <span className="block w-full text-center bg-primary text-white py-3 px-5 rounded-full hover:bg-primary-dark transition-colors duration-300 font-semibold">
          {buttonLabel}
        </span>
      </Link>
    </div>
  );
};

export default PricingCard;
