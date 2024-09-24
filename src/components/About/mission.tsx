import Image from "next/image";

const Mission = () => {
  return (
    <section
      id="about"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Left Side: Image */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 lg:mb-0">
              <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
                <Image
                  src="/images/about/mission.png" 
                  alt="Our Mission Image"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[500px]">
              <h2 className="mb-5 text-5xl font-bold leading-tight text-dark dark:text-white sm:text-[45px] sm:leading-[1.2]">
                Our Mission
              </h2>
              <p className="mb-8 text-xl leading-relaxed text-body-color dark:text-dark-6">
                Our mission is to supply a continuous stream of accurate data
                and insight into what the world thinks, so that companies,
                governments, and institutions can better serve the people and
                communities that sustain them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
