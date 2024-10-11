import Image from "next/image";

interface MissionProps {
  data: {
    title: string;
    description: string;
    image?: string | null;
  };
}

const Mission: React.FC<MissionProps> = ({ data }) => {
  return (
    <section
      id="mission"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Left Side: Image */}
          {data.image && (
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 lg:mb-0">
                <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Side: Text Content */}
          <div className={`w-full px-4 ${data.image ? 'lg:w-1/2' : 'lg:w-full'}`}>
            <div className="max-w-[500px]">
              <h2 className="mb-5 text-5xl font-bold leading-tight text-dark dark:text-white sm:text-[45px] sm:leading-[1.2]">
                {data.title}
              </h2>
              <div
                className="mb-8 text-xl leading-relaxed text-body-color dark:text-dark"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
