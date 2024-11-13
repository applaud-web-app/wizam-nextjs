"use client";
import ChangeSyllabus from '@/components/ChangeSyllabus'; // Import the ChangeSyllabus component

export default function ChangeSyllabusPage() {
  return (
    <div className="dashboard-page">
      <h1 className="text-3xl md:text-4xl lg:text-[40px] text-defaultcolor font-bold mb-6">
        Syllabus
      </h1>
      {/* Render the ChangeSyllabus component */}
      <ChangeSyllabus />
    </div>
  );
}
