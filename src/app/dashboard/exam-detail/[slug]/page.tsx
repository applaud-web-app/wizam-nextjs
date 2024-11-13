"use client"; // Ensure this component is client-side rendered

import SingleExam from "@/Components/Dashboard/SingleExam";

interface ExamDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { slug } = params; // Extract the slug from the params
  
  return (
    <div className="dashboard-page">
      <SingleExam slug={slug} />
    </div>
  );
}
