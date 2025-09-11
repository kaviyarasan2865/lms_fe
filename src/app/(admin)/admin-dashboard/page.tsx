const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to NEET PG LMS Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        {/* Faculty Members */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600 text-2xl">👨‍🏫</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Faculty Members</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        {/* Active Batches */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-2xl">🎓</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Batches</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        {/* Total Quizzes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left shadow">
            <h3 className="font-semibold">Add New Batch</h3>
            <p className="text-sm opacity-90">Create a new academic batch</p>
          </button>
          <button className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-left shadow">
            <h3 className="font-semibold">Register Student</h3>
            <p className="text-sm opacity-90">Add new student to system</p>
          </button>
          <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left shadow">
            <h3 className="font-semibold">Create Quiz</h3>
            <p className="text-sm opacity-90">Design new assessment</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
