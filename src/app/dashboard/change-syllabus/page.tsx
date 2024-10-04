import { useState } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie to check cookies if necessary
import ChangeSyllabus from '@/components/ChangeSyllabus';

export default function ChangeSyllabusPage() {
  const [syllabusStatus, setSyllabusStatus] = useState<boolean>(false);

  // Function to update the syllabus status
  const updateSyllabusStatus = () => {
    const categoryId = Cookies.get("category_id");
    const categoryName = Cookies.get("category_name");
    setSyllabusStatus(!!(categoryId && categoryName)); // Update status if both cookies exist
  };

  return (
    <div className="dashboard-page">
      <ChangeSyllabus updateSyllabusStatus={updateSyllabusStatus} />
    </div>
  );
}
