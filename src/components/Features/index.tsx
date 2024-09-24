import Image from "next/image";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";
import SectionTitle from "../Common/SectionTitle";

const Features = () => {
  return (
    <section className="pb-12 pt-20 bg-[#faf9e7] dark:bg-dark lg:pb-[180px] lg:pt-[120px] relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        

        <SectionTitle 
          title="How Can I Help You Pass the Exam" 
         
          align="center" 
        />


        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, i) => (
            <SingleFeature key={i} feature={feature} />
          ))}
        </div>
      </div>

      {/* Decorative Image */}
      <div className="absolute -bottom-8 left-0 right-0 w-full z-10">
        <Image
          src="/images/vector.png"
          alt="decorative vector"
          className="mx-auto w-full"
          width={1920}
          height={300}
        />
      </div>
    </section>
  );
};

export default Features;
