
interface BreadcrumbProps {
  pageName: string;
  pageDescription?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pageName,
  pageDescription,
}) => {
  return (
    <div className="relative z-10 bg-[#2179DE] dark:bg-dark overflow-hidden py-10 sm:py-16 lg:py-20">
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Page Title */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-bold mb-4 dark:text-white">
            {pageName}
          </h1>

          {/* Page Description */}
          {pageDescription && (
            <p className="text-gray-300 dark:text-gray-400 text-sm sm:text-base mb-6">
              {pageDescription}
            </p>
          )}

        
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
