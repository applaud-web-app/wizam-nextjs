const Strategy = () => {
  return (
    <section
      id="strategy"
      className=" py-16 flex justify-center items-center"
    >
      <div className="container mx-auto px-4">
        {/* Strategy Section 1 */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8  mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">
            Our Strategy
          </h2>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6">
            The underlying strategy that drives our long-term growth plan is defined by the mantra:
            <br />
            <strong>"YouGov. Best panel - Best data - Best tools."</strong>
          </p>
        </div>

        {/* How We Operate Section */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8  mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">
            How We Operate
          </h2>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6 mb-4">
            Our mission is to supply a continuous stream of accurate data and insight into what the
            world thinks, so that companies, governments, and institutions can better serve the people
            and communities that sustain them.
          </p>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6 mb-4">
            Our vision is for YouGov data to be a valued public resource used by hundreds of millions of people
            on a daily basis, enabling intelligent decision-making and informed conversations.
          </p>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6 mb-4">
            We are driven by a set of shared values. We are fast, fearless, and innovative. We work diligently
            to get it right. We are guided by accuracy, ethics, and proven methodologies. We trust each other and
            bring these values into everything that we do.
          </p>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6 mb-4">
            Our mission is to supply a continuous stream of accurate data and insight into what the world
            thinks, so that companies, governments, and institutions can better serve the people and
            communities that sustain them.
          </p>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6">
            Our vision is for YouGov data to be a valued public resource used by hundreds of millions of people
            on a daily basis, enabling intelligent decision-making and informed conversations.
          </p>
        </div>

        {/* Best Data Section (Third Card) */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8  mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">
            Best Data
          </h2>
          <p className="text-lg leading-relaxed text-dark dark:text-dark-6">
            The YouGov Cube is a unique single-source connected-data library that holds over ten years
            of longitudinal data. We leverage this data using our research expertise, including our
            application of Multilevel Regression with Post-stratification ("MRP") methodology, to make
            accurate predictions at a granular level.
          </p>
        </div>

   
      </div>
    </section>
  );
};

export default Strategy;
