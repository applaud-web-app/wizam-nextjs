// components/ClientContent.tsx
"use client";

import { useEffect } from "react";

interface ClientContentProps {
  title: string;
  description: string; // HTML content
}

const ClientContent: React.FC<ClientContentProps> = ({ title, description }) => {
  useEffect(() => {
    // Any client-side interactivity or additional fetching can go here
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto p-4">
      
        {/* Render content with dangerouslySetInnerHTML */}
        <div className="mt-4 text-base" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </section>
  );
};

export default ClientContent;
