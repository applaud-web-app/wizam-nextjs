import Image from "next/image";

interface SectionData {
  title: string;
  description: string;
  image?: string | null;
}

interface ValuesProps {
  data: SectionData;
}

const Values: React.FC<ValuesProps> = ({ data }) => {
  return (
    <section id="values" className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Left Side: Text Content */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[500px]">
              <h2 className="mb-5 text-4xl font-bold leading-tight text-dark dark:text-white sm:text-5xl">
                {data.title}
              </h2>
              <div
                className="mb-8 text-lg sm:text-xl leading-relaxed text-body-color dark:text-dark"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <Image
                src={data.image || "/images/default-image.png"}
                alt="Our Values Image"
                fill
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
