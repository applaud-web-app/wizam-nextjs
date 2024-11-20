
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ArchiveBlogs from "@/components/Blog/ArchiveBlogs";

const ArchivePage = () => {
  const params = useParams();
  const yearParam = params.year;

  // Extract and Validate the 'year' Parameter
  let year: string | undefined;

  if (typeof yearParam === "string") {
    year = yearParam;
  } else if (Array.isArray(yearParam) && yearParam.length > 0) {
    year = yearParam[0];
  }

  // Validate the year parameter
  if (!year || isNaN(Number(year))) {
    return (
      <div className="text-red-500 text-center mt-20">
        Invalid year provided.
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb pageName={`Knowledge Hub ${year}`} />

      <ArchiveBlogs year={year} />
    </>
  );
};

export default ArchivePage;
