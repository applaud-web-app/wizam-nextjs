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
    <div className="rounded-lg shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 bg-white relative border border-gray-200">
      {/* Most Popular Badge */}
      {popular && (
        <div className="absolute -top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}

      {/* Title and Price */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-3xl sm:text-5xl font-bold text-blue-600 mb-4">{price}</p>
      <p className="text-gray-500 mb-6">Per month, billed annually</p>

      {/* Features List */}
      <ul className="text-gray-600 mb-8 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            ✅ <span className="ml-2">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Call to Action Button */}
      <Link href={buttonLink}>
        <span className="block w-full text-center bg-blue-600 text-white py-3 px-5 rounded-full hover:bg-blue-700 transition-colors duration-300">
          {buttonLabel}
        </span>
      </Link>
    </div>
  );
};

export default PricingCard;
