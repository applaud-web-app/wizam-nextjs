const Vision = () => {
  return (
    <section
      id="vision"
      className="bg-[#faf9e7] py-16 lg:py-24"
    >
      <div className="container mx-auto text-center">
        {/* Vision Heading */}
        <h2 className="text-4xl font-bold mb-6 text-dark dark:text-white sm:text-5xl">
          Our Vision
        </h2>

        {/* Vision Description */}
        <p className="text-lg sm:text-xl text-dark dark:text-dark-6 max-w-2xl mx-auto leading-relaxed">
          Our vision is for YouGov data to be a valued public resource used by
          hundreds of millions of people on a daily basis, enabling intelligent
          decision-making and informed conversations.
        </p>
      </div>
    </section>
  );
};

export default Vision;
