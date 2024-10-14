interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right'; // Optional alignment prop
}

const SectionTitle = ({ title, subtitle, align = 'center' }: SectionTitleProps) => {
  // Determine alignment class based on the prop
  const textAlignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`mb-12 max-w-2xl mx-auto ${textAlignClass}`}>
      {/* Title */}
      <h2 className="text-3xl text-secondary font-bold mb-3 md:text-4xl lg:text-5xl">{title}</h2>
      
      {/* Optional Subtitle */}
      {subtitle && <p className="text-lg text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
