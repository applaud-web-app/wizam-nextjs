interface SectionData {
  title: string;
  description: string;
  image?: string | null;
}

interface StrategyProps {
  data: SectionData;
  operate: SectionData;
  bestData: SectionData;
}

const Strategy: React.FC<StrategyProps> = ({ data, operate, bestData }) => {
  return (
    <section id="strategy" className="py-16 flex justify-center items-center">
      <div className="container mx-auto px-4">
        {/* Strategy Section */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">{data.title}</h2>
          <div
            className="text-lg leading-relaxed text-dark dark:text-dark"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>

        {/* How We Operate Section */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">{operate.title}</h2>
          <div
            className="text-lg leading-relaxed text-dark dark:text-dark"
            dangerouslySetInnerHTML={{ __html: operate.description }}
          />
        </div>

        {/* Best Data Section */}
        <div className="bg-white shadow-xl border border-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-dark sm:text-4xl">{bestData.title}</h2>
          <div
            className="text-lg leading-relaxed text-dark dark:text-dark"
            dangerouslySetInnerHTML={{ __html: bestData.description }}
          />
        </div>
      </div>
    </section>
  );
};

export default Strategy;
