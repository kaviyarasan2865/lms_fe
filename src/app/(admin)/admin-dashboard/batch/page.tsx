'use client'
import { useState } from "react";

interface Batch {
  id: string;
  batchName: string;
  yearOfJoining: string;
  collegeName: string;
  course: string;
  studentCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface AcademicYear {
  year: number;
  label: string;
  startDate: string;
  endDate: string;
  autoPromote: boolean;
  editable: boolean;
}

interface FormData {
  course: string;
  yearOfJoining: string;
  batchName: string;
  autoPromote: boolean;
  duration: number;
  academicYears: AcademicYear[];
}

const BatchManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [editingBatch, setEditingBatch] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    course: 'MBBS',
    yearOfJoining: '2024',
    batchName: '',
    autoPromote: false,
    duration: 365,
    academicYears: [
      { year: 1, label: 'Year 1', startDate: '', endDate: '', autoPromote: false, editable: true },
      { year: 2, label: 'Year 2', startDate: '', endDate: '', autoPromote: false, editable: true },
      { year: 3, label: 'Year 3', startDate: '', endDate: '', autoPromote: false, editable: true },
      { year: 4, label: 'Year 4', startDate: '', endDate: '', autoPromote: false, editable: true }
    ]
  });

  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "1",
      batchName: "MBBS 2021",
      yearOfJoining: "2021",
      collegeName: "Medical College",
      course: "MBBS",
      studentCount: 150,
      status: "active",
      createdAt: "2021-06-15"
    },
    {
      id: "2",
      batchName: "MBBS 2022",
      yearOfJoining: "2022",
      collegeName: "Medical College",
      course: "MBBS",
      studentCount: 145,
      status: "active",
      createdAt: "2022-06-15"
    },
    {
      id: "3",
      batchName: "BDS 2021",
      yearOfJoining: "2021",
      collegeName: "Medical College",
      course: "BDS",
      studentCount: 80,
      status: "inactive",
      createdAt: "2021-06-15"
    },
    {
      id: "4",
      batchName: "MD Cardiology 2023",
      yearOfJoining: "2023",
      collegeName: "Medical College",
      course: "MD",
      studentCount: 25,
      status: "active",
      createdAt: "2023-06-15"
    },
    {
      id: "5",
      batchName: "MS Surgery 2022",
      yearOfJoining: "2022",
      collegeName: "Medical College",
      course: "MS",
      studentCount: 30,
      status: "active",
      createdAt: "2022-06-15"
    },
    {
      id: "6",
      batchName: "BAMS 2023",
      yearOfJoining: "2023",
      collegeName: "Medical College",
      course: "BAMS",
      studentCount: 60,
      status: "active",
      createdAt: "2023-06-15"
    }
  ]);

  // Filter batches based on search and course filter
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.yearOfJoining.includes(searchTerm);
    const matchesCourse = courseFilter === "" || batch.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const resetForm = () => {
    setFormData({
      course: 'MBBS',
      yearOfJoining: '2024',
      batchName: '',
      autoPromote: false,
      duration: 365,
      academicYears: [
        { year: 1, label: 'Year 1', startDate: '', endDate: '', autoPromote: false, editable: true },
        { year: 2, label: 'Year 2', startDate: '', endDate: '', autoPromote: false, editable: true },
        { year: 3, label: 'Year 3', startDate: '', endDate: '', autoPromote: false, editable: true },
        { year: 4, label: 'Year 4', startDate: '', endDate: '', autoPromote: false, editable: true }
      ]
    });
    setEditingBatch(null);
  };

  const handleFormSubmit = () => {
    if (!formData.batchName.trim()) {
      alert('Please enter a batch name');
      return;
    }

    if (editingBatch) {
      // Update existing batch
      setBatches(batches.map(batch => 
        batch.id === editingBatch 
          ? {
              ...batch,
              batchName: formData.batchName,
              yearOfJoining: formData.yearOfJoining,
              course: formData.course
            }
          : batch
      ));
      alert('Batch updated successfully!');
    } else {
      // Create new batch
      const newBatch: Batch = {
        id: Date.now().toString(),
        batchName: formData.batchName,
        yearOfJoining: formData.yearOfJoining,
        collegeName: "Medical College",
        course: formData.course,
        studentCount: 0,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBatches([newBatch, ...batches]);
      alert('Batch created successfully!');
    }

    setShowForm(false);
    resetForm();
  };

  const handleEditBatch = (batch: Batch) => {
    setFormData({
      ...formData,
      course: batch.course,
      yearOfJoining: batch.yearOfJoining,
      batchName: batch.batchName
    });
    setEditingBatch(batch.id);
    setShowForm(true);
  };

  const deleteBatch = (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      setBatches(batches.filter(batch => batch.id !== id));
      alert('Batch deleted successfully!');
    }
  };

  const toggleBatchStatus = (id: string) => {
    setBatches(batches.map(batch => 
      batch.id === id 
        ? { ...batch, status: batch.status === "active" ? "inactive" : "active" }
        : batch
    ));
  };

  const updateAcademicYear = (index: number, field: keyof AcademicYear, value: any) => {
    const updatedYears = [...formData.academicYears];
    updatedYears[index] = { ...updatedYears[index], [field]: value };
    setFormData({ ...formData, academicYears: updatedYears });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCourseFilter("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Batch Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage academic batches and their configurations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm sm:text-base shadow-sm"
          >
            {showForm ? 'Cancel' : 'Create New Batch'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* College & Course Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">College & Course Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">College Name</label>
                    <input
                      type="text"
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      value="Medical College"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Course *</label>
                    <select 
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="MBBS">MBBS</option>
                      <option value="BDS">BDS</option>
                      <option value="MD">MD</option>
                      <option value="MS">MS</option>
                      <option value="BAMS">BAMS</option>
                      <option value="BHMS">BHMS</option>
                      <option value="DNB">DNB</option>
                      <option value="DM">DM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Batch Details */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Batch Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Year of Joining *</label>
                    <select 
                      value={formData.yearOfJoining}
                      onChange={(e) => setFormData({...formData, yearOfJoining: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Batch Name *</label>
                    <input
                      type="text"
                      value={formData.batchName}
                      onChange={(e) => setFormData({...formData, batchName: e.target.value})}
                      placeholder={`e.g., ${formData.course} ${formData.yearOfJoining}`}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Academic Phases Configuration - Only show for new batches */}
              {!editingBatch && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Academic Phases Configuration</h3>
                  
                  {/* Mobile Card View */}
                  <div className="block xl:hidden space-y-3 sm:space-y-4">
                    {formData.academicYears.map((year, index) => (
                      <div key={year.year} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-3">Year {year.year}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Default Label</label>
                            <input
                              type="text"
                              value={year.label}
                              onChange={(e) => updateAcademicYear(index, 'label', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={year.startDate}
                                onChange={(e) => updateAcademicYear(index, 'startDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                              <input
                                type="date"
                                value={year.endDate}
                                onChange={(e) => updateAcademicYear(index, 'endDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <label className="flex items-center text-sm">
                              <input 
                                type="checkbox" 
                                checked={year.autoPromote}
                                onChange={(e) => updateAcademicYear(index, 'autoPromote', e.target.checked)}
                                className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              />
                              Auto-Promote
                            </label>
                            <label className="flex items-center text-sm">
                              <input 
                                type="checkbox" 
                                checked={year.editable}
                                onChange={(e) => updateAcademicYear(index, 'editable', e.target.checked)}
                                className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              />
                              Editable
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden xl:block overflow-x-auto">
                    <div className="min-w-full border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 grid grid-cols-6 gap-0">
                        <div className="p-3 text-left font-medium text-gray-900 text-sm border-r border-gray-200">Academic Year</div>
                        <div className="p-3 text-left font-medium text-gray-900 text-sm border-r border-gray-200">Default Label</div>
                        <div className="p-3 text-left font-medium text-gray-900 text-sm border-r border-gray-200">Start Date</div>
                        <div className="p-3 text-left font-medium text-gray-900 text-sm border-r border-gray-200">End Date</div>
                        <div className="p-3 text-left font-medium text-gray-900 text-sm border-r border-gray-200">Auto-Promote?</div>
                        <div className="p-3 text-left font-medium text-gray-900 text-sm">Editable</div>
                      </div>
                      {formData.academicYears.map((year, index) => (
                        <div key={year.year} className="grid grid-cols-6 gap-0 border-t border-gray-200">
                          <div className="p-3 text-gray-700 text-sm border-r border-gray-200 flex items-center">Year {year.year}</div>
                          <div className="p-3 border-r border-gray-200">
                            <input
                              type="text"
                              value={year.label}
                              onChange={(e) => updateAcademicYear(index, 'label', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            />
                          </div>
                          <div className="p-3 border-r border-gray-200">
                            <input
                              type="date"
                              value={year.startDate}
                              onChange={(e) => updateAcademicYear(index, 'startDate', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            />
                          </div>
                          <div className="p-3 border-r border-gray-200">
                            <input
                              type="date"
                              value={year.endDate}
                              onChange={(e) => updateAcademicYear(index, 'endDate', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            />
                          </div>
                          <div className="p-3 border-r border-gray-200">
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={year.autoPromote}
                                onChange={(e) => updateAcademicYear(index, 'autoPromote', e.target.checked)}
                                className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              />
                              <span className="text-sm text-gray-700">Yes</span>
                            </label>
                          </div>
                          <div className="p-3">
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={year.editable}
                                onChange={(e) => updateAcademicYear(index, 'editable', e.target.checked)}
                                className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              />
                              <span className="text-sm text-gray-700">Yes</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Promotion Settings - Only show for new batches */}
              {!editingBatch && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Promotion Settings</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="auto-promote" 
                        checked={formData.autoPromote}
                        onChange={(e) => setFormData({...formData, autoPromote: e.target.checked})}
                        className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                      />
                      <label htmlFor="auto-promote" className="text-gray-900 text-sm sm:text-base">Auto-promote students after specified duration</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                        className="w-full sm:w-32 p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                        min="1"
                        max="1095"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleFormSubmit}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm sm:text-base"
                >
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
                <button
                  onClick={handleCancelForm}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Batches */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Existing Batches ({filteredBatches.length})
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 lg:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              >
                <option value="">All Courses</option>
                <option value="MBBS">MBBS</option>
                <option value="BDS">BDS</option>
                <option value="MD">MD</option>
                <option value="MS">MS</option>
                <option value="BAMS">BAMS</option>
                <option value="BHMS">BHMS</option>
                <option value="DNB">DNB</option>
                <option value="DM">DM</option>
              </select>
              {(searchTerm || courseFilter) && (
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {filteredBatches.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-5xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                {searchTerm || courseFilter ? 'Try adjusting your search or filter criteria.' : 'Create your first batch to get started.'}
              </p>
              {(searchTerm || courseFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3 sm:space-y-4">
                {filteredBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{batch.batchName}</h3>
                        <p className="text-sm text-gray-600">{batch.course} • {batch.yearOfJoining}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(batch.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => toggleBatchStatus(batch.id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          batch.status === "active" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {batch.status}
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">{batch.studentCount}</span> students
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditBatch(batch)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteBatch(batch.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 active:bg-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Created</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch) => (
                      <tr key={batch.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium text-gray-900 text-sm">{batch.batchName}</td>
                        <td className="p-3 text-gray-700 text-sm">{batch.yearOfJoining}</td>
                        <td className="p-3 text-gray-700 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {batch.course}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">
                          <span className="font-medium">{batch.studentCount}</span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleBatchStatus(batch.id)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              batch.status === "active" 
                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {batch.status}
                          </button>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">{new Date(batch.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditBatch(batch)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteBatch(batch.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 active:bg-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;