import React from 'react';
import Image from 'next/image';

interface NoDataProps {
  message?: string;
}

const NoData: React.FC<NoDataProps> = ({ message = "No data available" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Image */}
      <Image src="/images/nodata.png" alt="No Data" width={250} height={250} className="mb-4" />
      
      {/* Message */}
      <h2 className="text-2xl font-semibold text-red-500">{message}</h2>
    </div>
  );
};

export default NoData;
