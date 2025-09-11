'use client'
import { useState } from "react";

interface Student {
  id: string;
  fullName: string;
  rollNo: string;
  phoneNumber: string;
  email: string;
  batch: string;
  course: string;
  status: "active" | "inactive";
}

const StudentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [students] = useState<Student[]>([
    {
      id: "1",
      fullName: "John Doe",
      rollNo: "MBBS001",
      phoneNumber: "+91 9876543210",
      email: "john.doe@example.com",
      batch: "MBBS 2021",
      course: "MBBS",
      status: "active"
    },
    {
      id: "2",
      fullName: "Jane Smith",
      rollNo: "MBBS002",
      phoneNumber: "+91 9876543211",
      email: "jane.smith@example.com",
      batch: "MBBS 2021",
      course: "MBBS",
      status: "active"
    },
    {
      id: "3",
      fullName: "Mike Johnson",
      rollNo: "MBBS003",
      phoneNumber: "+91 9876543212",
      email: "mike.johnson@example.com",
      batch: "MBBS 2022",
      course: "MBBS",
      status: "inactive"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">Manage student registrations and batch assignments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
            >
              Bulk Upload CSV
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Add New Student
            </button>
          </div>
        </div>

        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Bulk Upload Students</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">CSV Template Format</h3>
                <p className="text-sm text-gray-600 mb-3">Your CSV file should contain the following columns:</p>
                <div className="bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                  <code className="text-xs text-gray-800 whitespace-nowrap">
                    full_name,roll_no,phone_number,email,year_of_joining
                  </code>
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">
                  Example: John Doe,MBBS001,+91 9876543210,john@example.com,2021
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                  Upload Students
                </button>
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Individual Student Form */}
        {showForm && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Add New Student</h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter student's full name"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Roll Number *</label>
                    <input
                      type="text"
                      placeholder="e.g., MBBS001"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* College & Course Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">College & Course Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">College Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      defaultValue="Medical College"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Course</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      defaultValue="MBBS"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Batch Assignment */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Batch Assignment</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Year of Joining / Batch Name *</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base">
                    <option value="">Select batch</option>
                    <option value="2024">2024 - MBBS 2024</option>
                    <option value="2023">2023 - MBBS 2023</option>
                    <option value="2022">2022 - MBBS 2022</option>
                    <option value="2021">2021 - MBBS 2021</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                  Add Student
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Students */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Registered Students</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                <option value="">All Batches</option>
                <option value="2024">MBBS 2024</option>
                <option value="2023">MBBS 2023</option>
                <option value="2022">MBBS 2022</option>
                <option value="2021">MBBS 2021</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {students.map((student) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.fullName}</h3>
                    <p className="text-sm text-gray-600">{student.rollNo}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                    student.status === "active" 
                      ? "bg-green-50 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {student.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex flex-wrap gap-4">
                    <span className="break-all">{student.email}</span>
                    <span className="whitespace-nowrap">{student.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Batch:</span> {student.batch}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Name</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Roll No</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Email</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Phone</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Batch</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Status</th>
                  <th className="p-3 text-left font-medium text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-gray-200">
                    <td className="p-3 font-medium text-gray-900 text-sm">{student.fullName}</td>
                    <td className="p-3 text-gray-700 text-sm">{student.rollNo}</td>
                    <td className="p-3 text-gray-700 text-sm break-all">{student.email}</td>
                    <td className="p-3 text-gray-700 text-sm whitespace-nowrap">{student.phoneNumber}</td>
                    <td className="p-3 text-gray-700 text-sm">{student.batch}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        student.status === "active" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State (when no students) */}
          {students.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first student.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;