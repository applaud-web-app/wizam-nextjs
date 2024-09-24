
interface BreadcrumbProps {
  pageName: string;
  pageDescription?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pageName,
  pageDescription,
}) => {
  return (
    <div className="relative z-10 bg-[#001d21] dark:bg-dark overflow-hidden py-10 sm:py-16 lg:py-20">
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

          {/* Breadcrumb Navigation
          <nav aria-label="breadcrumb">
            <ul className="flex items-center justify-center text-sm sm:text-base gap-2 sm:gap-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition dark:text-gray-400 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-300 dark:text-gray-400">{pageName}</li>
            </ul>
          </nav> */}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
