interface SectionData {
  title: string;
  description: string;
  image?: string | null;
}

interface VisionProps {
  data: SectionData;
}

const Vision: React.FC<VisionProps> = ({ data }) => {
  return (
    <section id="vision" className="bg-[#faf9e7] py-16 lg:py-24">
      <div className="container mx-auto text-center">
        {/* Vision Heading */}
        <h2 className="text-4xl font-bold mb-6 text-dark dark:text-white sm:text-5xl">
          {data.title}
        </h2>

        {/* Vision Description */}
        <div
          className="text-lg sm:text-xl text-dark dark:text-dark max-w-2xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </div>
    </section>
  );
};

export default Vision;
