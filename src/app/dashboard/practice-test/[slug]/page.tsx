

"use client"; // Ensure this component is client-side rendered

import SinglePracticeSet from "@/components/Dashboard/SinglePracticeSet";

interface PracticeTestDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PracticeTestDetailPage({ params }: PracticeTestDetailPageProps) {
  const { slug } = params; // Extract the slug from the params

  return (
    <div className="dashboard-page">
      <SinglePracticeSet slug={slug} />
    </div>
  );
}
