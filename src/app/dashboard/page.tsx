export default function DashboardPage() {
    return (
      <div className="dashboard-page p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4 md:text-3xl lg:text-4xl">Dashboard Overview</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Users */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">Users</h2>
            <p className="text-gray-500 mt-2">1,200 Active Users</p>
          </div>
  
          {/* Card 2: Reports */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">Reports</h2>
            <p className="text-gray-500 mt-2">150 Reports Generated</p>
          </div>
  
          {/* Card 3: Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">Analytics</h2>
            <p className="text-gray-500 mt-2">5 New Analytics Reports</p>
          </div>
        </div>
      </div>
    );
  }
  