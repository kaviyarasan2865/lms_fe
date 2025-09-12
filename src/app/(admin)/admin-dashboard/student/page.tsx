'use client'
import { useState, useEffect } from "react";
import { studentApi, batchApi, collegeApi, type Student, type CreateStudentData, type Batch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LocalStudent {
  id: number;
  fullName: string;
  rollNo: string;
  phoneNumber: string;
  email: string;
  batch: number | null;
  batchName: string | null;
  course: string;
  collegeName: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface FormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  roll_no: string;
  phone_number: string;
  batch: number | null;
  college_id?: number;
}

const StudentManagement = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<LocalStudent[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    roll_no: '',
    phone_number: '',
    batch: null,
    college_id: undefined
  });

  // Load students, batches, and college info on component mount
  useEffect(() => {
    loadStudents();
    loadBatches();
    loadCollegeInfo();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAll();
      
      // Handle paginated response
      let dataArray = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response && typeof response === 'object' && 'results' in response && Array.isArray((response as any).results)) {
        dataArray = (response as any).results;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        dataArray = (response as any).data;
      }

      const localStudents = dataArray.map((student: any) => ({
        id: student.id,
        fullName: `${student.user.first_name} ${student.user.last_name}`,
        rollNo: student.roll_no,
        phoneNumber: student.phone_number,
        email: student.user.email,
        batch: student.batch,
        batchName: student.batch_name,
        course: 'NEET-PG', // Default course
        collegeName: student.college_name,
        status: student.status,
        created_at: student.created_at,
        updated_at: student.updated_at
      }));

      setStudents(localStudents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    try {
      const response = await batchApi.getAll();
      
      // Handle paginated response
      let dataArray = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response && typeof response === 'object' && 'results' in response && Array.isArray((response as any).results)) {
        dataArray = (response as any).results;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        dataArray = (response as any).data;
      }

      setBatches(dataArray);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const loadCollegeInfo = async () => {
    try {
      const response = await collegeApi.getCurrent();
      
      // Handle paginated response
      let dataArray = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response && typeof response === 'object' && 'results' in response && Array.isArray((response as any).results)) {
        dataArray = (response as any).results;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        dataArray = (response as any).data;
      }

      if (dataArray.length > 0) {
        const college = dataArray[0];
        setCollegeName(college.name);
        setFormData(prev => ({ ...prev, college_id: college.id }));
      }
    } catch (err) {
      console.error('Failed to load college info:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirm: '',
      roll_no: '',
      phone_number: '',
      batch: null,
      college_id: formData.college_id // Preserve college_id
    });
    setEditingStudent(null);
    setError("");
    setSuccess("");
  };

  const handleFormSubmit = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Please enter first name and last name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter email address');
      return;
    }

    if (!formData.roll_no.trim()) {
      setError('Please enter roll number');
      return;
    }

    if (!formData.phone_number.trim()) {
      setError('Please enter phone number');
      return;
    }

    if (!formData.college_id) {
      setError('College information not loaded. Please refresh the page.');
      return;
    }

    // Password validation for new students
    if (!editingStudent) {
      if (!formData.password.trim()) {
        setError('Please enter a password');
        return;
      }
      if (formData.password !== formData.password_confirm) {
        setError('Passwords do not match');
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      const studentData = {
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password || 'student123', // Default password
        password_confirm: formData.password_confirm || formData.password || 'student123',
        roll_no: formData.roll_no,
        phone_number: formData.phone_number,
        college_id: formData.college_id,
        batch_id: formData.batch
      };

      if (editingStudent) {
        // Update existing student
        await studentApi.update(editingStudent, { ...studentData, id: editingStudent });
        setSuccess('Student updated successfully!');
      } else {
        // Create new student
        await studentApi.create(studentData);
        setSuccess('Student created successfully!');
      }

      // Reload students
      await loadStudents();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student: LocalStudent) => {
    setFormData({
      username: student.email.split('@')[0], // Generate username from email
      email: student.email,
      first_name: student.fullName.split(' ')[0] || '',
      last_name: student.fullName.split(' ').slice(1).join(' ') || '',
      password: '', // Don't pre-fill password
      password_confirm: '', // Don't pre-fill password confirmation
      roll_no: student.rollNo,
      phone_number: student.phoneNumber,
      batch: student.batch,
      college_id: formData.college_id
    });
    setEditingStudent(student.id);
    setShowForm(true);
  };

  const deleteStudent = async (id: number) => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        setLoading(true);
        await studentApi.delete(id);
        setSuccess('Student deleted successfully!');
        await loadStudents();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete student');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      setError('Please select a CSV file to upload');
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await studentApi.bulkUpload(uploadFile);
      setSuccess(`Bulk upload completed! ${result.created} students created.`);
      setUploadFile(null);
      setShowBulkUpload(false);
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload students');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const blob = await studentApi.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download template');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Filter students based on search and batch filter
  const filteredStudents = Array.isArray(students) ? students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter === "" || student.batchName === batchFilter;
    return matchesSearch && matchesBatch;
  }) : [];

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

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

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
                    first_name,last_name,email,roll_no,phone_number,year_of_joining
                  </code>
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">
                  Example: John,Doe,john@example.com,MBBS001,+91 9876543210,2021
                </p>
                <button
                  onClick={downloadTemplate}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                >
                  Download Template
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  suppressHydrationWarning
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleBulkUpload}
                  disabled={!uploadFile || loading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {loading ? 'Uploading...' : 'Upload Students'}
                </button>
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                  suppressHydrationWarning
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      placeholder="Enter student's first name"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      placeholder="Enter student's last name"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Roll Number *</label>
                    <input
                      type="text"
                      value={formData.roll_no}
                      onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                      placeholder="e.g., MBBS001"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="+91 9876543210"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="student@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  {!editingStudent && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Password *</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Enter password"
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password *</label>
                        <input
                          type="password"
                          value={formData.password_confirm}
                          onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                          placeholder="Confirm password"
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                          suppressHydrationWarning
                        />
                      </div>
                    </>
                  )}
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
                      value={collegeName}
                      disabled
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Course</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      value="NEET-PG"
                      disabled
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Batch Assignment */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Batch Assignment</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Select Batch</label>
                  <select 
                    value={formData.batch || ""}
                    onChange={(e) => setFormData({...formData, batch: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    suppressHydrationWarning
                  >
                    <option value="">Select batch (optional)</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({batch.year_of_joining})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={handleFormSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {loading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                </button>
                <button
                  onClick={handleCancelForm}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                  suppressHydrationWarning
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                suppressHydrationWarning
              />
              <select 
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                suppressHydrationWarning
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.name}>
                    {batch.name} ({batch.year_of_joining})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading && students.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : (
            <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
                {filteredStudents.map((student) => (
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
                        <span className="font-medium">Batch:</span> {student.batchName || 'Not assigned'}
                  </div>
                </div>
                
                <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditStudent(student)}
                        className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                        suppressHydrationWarning
                      >
                    Edit
                  </button>
                      <button 
                        onClick={() => deleteStudent(student.id)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                        suppressHydrationWarning
                      >
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
                    {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-gray-200">
                    <td className="p-3 font-medium text-gray-900 text-sm">{student.fullName}</td>
                    <td className="p-3 text-gray-700 text-sm">{student.rollNo}</td>
                    <td className="p-3 text-gray-700 text-sm break-all">{student.email}</td>
                    <td className="p-3 text-gray-700 text-sm whitespace-nowrap">{student.phoneNumber}</td>
                        <td className="p-3 text-gray-700 text-sm">{student.batchName || 'Not assigned'}</td>
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
                            <button 
                              onClick={() => handleEditStudent(student)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                              suppressHydrationWarning
                            >
                          Edit
                        </button>
                            <button 
                              onClick={() => deleteStudent(student.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                              suppressHydrationWarning
                            >
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
              {filteredStudents.length === 0 && !loading && (
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
                    suppressHydrationWarning
              >
                Add Student
              </button>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;