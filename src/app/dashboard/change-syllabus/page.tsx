import Link from 'next/link';

export default function ChangeSyllabus() {
  const syllabuses = [
    { title: 'Dental', description: 'Explore Dental syllabus and topics.', link: '/dental' },
    { title: 'Nursing', description: 'Learn about Nursing courses and modules.', link: '/nursing' },
    { title: 'English', description: 'Study English syllabus and materials.', link: '/english' },
    { title: 'Math', description: 'Understand Math syllabus for students.', link: '/math' },
    { title: 'Physics', description: 'Explore Physics topics and syllabus.', link: '/physics' },
    { title: 'Chemistry', description: 'Learn about Chemistry syllabus details.', link: '/chemistry' },
    { title: 'Computer Science', description: 'Study CS syllabus and programming topics.', link: '/computer-science' },
    { title: 'History', description: 'Explore History syllabus and subjects.', link: '/history' }
  ];

  return (
    <div className="dashboard-page p-6">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {syllabuses.map((syllabus, index) => (
          <Link key={index} href={syllabus.link}>
            <div className="block bg-white shadow-sm rounded-lg p-6 hover:shadow-lg border border-gray-50 hover:border-primary transition-shadow duration-300 cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">{syllabus.title}</h3>
              <p className="text-gray-600">{syllabus.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
