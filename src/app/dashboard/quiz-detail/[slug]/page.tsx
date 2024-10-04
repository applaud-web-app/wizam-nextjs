"use client"; // Ensure this component is client-side rendered

import SingleQuiz from "@/components/Dashboard/SingleQuiz";

interface ExamDetailPageProps {
  params: {
    slug: string;
  };
}

export default function QuizDetailPage({ params }: ExamDetailPageProps) {
  const { slug } = params; // Extract the slug from the params
  return (
    <div className="dashboard-page">
      <SingleQuiz slug={slug} />
    </div>
  );
}
