'use client'
import { useState, useEffect } from "react";
import { batchApi, collegeApi, type Batch, type CreateBatchData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LocalBatch {
  id: number;
  name: string;
  year_of_joining: number;
  college: number;
  college_name: string;
  course: string;
  student_count: number;
  created_at: string;
  updated_at: string;
  academic_year: number;
  default_label: string;
  start_date: string;
  end_date: string;
  auto_promote: boolean;
  editable: boolean;
  auto_promote_after_days: number;
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
  year_of_joining: number;
  name: string;
  auto_promote: boolean;
  auto_promote_after_days: number;
  academic_year: number;
  default_label: string;
  start_date: string;
  end_date: string;
  editable: boolean;
  college_id?: number;
}

const BatchManagement = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [editingBatch, setEditingBatch] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collegeName, setCollegeName] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    course: 'NEET-PG',
    year_of_joining: new Date().getFullYear(),
    name: '',
    auto_promote: false,
    auto_promote_after_days: 365,
    academic_year: 1,
    default_label: 'Year 1',
    start_date: '',
    end_date: '',
    editable: true,
    college_id: undefined
  });

  const [batches, setBatches] = useState<LocalBatch[]>([]);

  // Load batches and college info on component mount
  useEffect(() => {
    loadBatches();
    loadCollegeInfo();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const data = await batchApi.getAll();
      console.log('API Response:', data); // Debug log
      
      // Handle different response structures
      let batchesData: LocalBatch[] = [];
      if (Array.isArray(data)) {
        batchesData = data;
      } else if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as any).results)) {
        // Handle paginated response
        batchesData = (data as any).results;
      } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        // Handle wrapped response
        batchesData = (data as any).data;
      }
      
      setBatches(batchesData);
    } catch (err) {
      console.error('Error loading batches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load batches');
      setBatches([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadCollegeInfo = async () => {
    try {
      const response = await collegeApi.getCurrent();
      console.log('College API Response:', response); // Debug log
      
      // Handle paginated response
      let colleges = [];
      if (Array.isArray(response)) {
        colleges = response;
      } else if (response && Array.isArray(response.results)) {
        colleges = response.results;
      } else if (response && Array.isArray(response.data)) {
        colleges = response.data;
      }
      
      if (colleges.length > 0) {
        setCollegeName(colleges[0].name);
        // Store college ID for batch creation
        setFormData(prev => ({ ...prev, college_id: colleges[0].id }));
      }
    } catch (err) {
      console.error('Failed to load college info:', err);
    }
  };

  // Filter batches based on search and course filter
  const filteredBatches = Array.isArray(batches) ? batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.year_of_joining.toString().includes(searchTerm);
    const matchesCourse = courseFilter === "" || batch.course === courseFilter;
    return matchesSearch && matchesCourse;
  }) : [];

  const resetForm = () => {
    setFormData({
      course: 'NEET-PG',
      year_of_joining: new Date().getFullYear(),
      name: '',
      auto_promote: false,
      auto_promote_after_days: 365,
      academic_year: 1,
      default_label: 'Year 1',
      start_date: '',
      end_date: '',
      editable: true,
      college_id: formData.college_id // Preserve college_id
    });
    setEditingBatch(null);
    setError("");
    setSuccess("");
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a batch name');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Please select start and end dates');
      return;
    }

    if (!formData.college_id) {
      setError('College information not loaded. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare data for API call
      const batchData = {
        ...formData,
        college: formData.college_id // Map college_id to college field
      };

      if (editingBatch) {
        // Update existing batch
        await batchApi.update(editingBatch, batchData);
        setSuccess('Batch updated successfully!');
      } else {
        // Create new batch
        await batchApi.create(batchData);
        setSuccess('Batch created successfully!');
      }

      // Reload batches
      await loadBatches();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save batch');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch: LocalBatch) => {
    setFormData({
      course: batch.course,
      year_of_joining: batch.year_of_joining,
      name: batch.name,
      auto_promote: batch.auto_promote,
      auto_promote_after_days: batch.auto_promote_after_days,
      academic_year: batch.academic_year,
      default_label: batch.default_label,
      start_date: batch.start_date,
      end_date: batch.end_date,
      editable: batch.editable,
      college_id: batch.college // Use the college ID from the batch
    });
    setEditingBatch(batch.id);
    setShowForm(true);
  };

  const deleteBatch = async (id: number) => {
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      try {
        setLoading(true);
        await batchApi.delete(id);
        setSuccess('Batch deleted successfully!');
        await loadBatches();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete batch');
      } finally {
        setLoading(false);
      }
    }
  };

  // Remove the updateAcademicYear function as we're simplifying the form

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
            suppressHydrationWarning
          >
            {showForm ? 'Cancel' : 'Create New Batch'}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

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
                      value={collegeName || "Loading..."}
                      disabled
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Course *</label>
                    <select 
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    >
                      <option value="NEET-PG">NEET-PG</option>
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
                      value={formData.year_of_joining}
                      onChange={(e) => setFormData({...formData, year_of_joining: parseInt(e.target.value)})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
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
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={`e.g., ${formData.course} ${formData.year_of_joining}`}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Academic Phases Configuration */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Academic Phases Configuration</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Academic Year</label>
                    <select 
                      value={formData.academic_year}
                      onChange={(e) => setFormData({...formData, academic_year: parseInt(e.target.value)})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Default Label</label>
                    <input
                      type="text"
                      value={formData.default_label}
                      onChange={(e) => setFormData({...formData, default_label: e.target.value})}
                      placeholder="e.g., Year 1, First Year"
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Promotion Settings */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Promotion Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="auto-promote" 
                        checked={formData.auto_promote}
                        onChange={(e) => setFormData({...formData, auto_promote: e.target.checked})}
                        className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                        suppressHydrationWarning
                      />
                    <label htmlFor="auto-promote" className="text-gray-900 text-sm sm:text-base">Auto-promote students after specified duration</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        value={formData.auto_promote_after_days}
                        onChange={(e) => setFormData({...formData, auto_promote_after_days: parseInt(e.target.value) || 0})}
                        className="w-full sm:w-32 p-2.5 sm:p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                        min="1"
                        max="1095"
                        suppressHydrationWarning
                      />
                  </div>
                  <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="editable" 
                        checked={formData.editable}
                        onChange={(e) => setFormData({...formData, editable: e.target.checked})}
                        className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                        suppressHydrationWarning
                      />
                    <label htmlFor="editable" className="text-gray-900 text-sm sm:text-base">Editable (students can modify their details)</label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleFormSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {loading ? 'Saving...' : (editingBatch ? 'Update Batch' : 'Create Batch')}
                </button>
                <button
                  onClick={handleCancelForm}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
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
              Existing Batches ({Array.isArray(filteredBatches) ? filteredBatches.length : 0})
              {loading && <span className="text-sm text-gray-500 ml-2">(Loading...)</span>}
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 lg:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                suppressHydrationWarning
              />
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                suppressHydrationWarning
              >
                <option value="">All Courses</option>
                <option value="NEET-PG">NEET-PG</option>
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
                  suppressHydrationWarning
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-5xl mb-4">⏳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading batches...</h3>
              <p className="text-gray-600 text-sm sm:text-base">Please wait while we fetch your batch data.</p>
            </div>
          ) : !Array.isArray(filteredBatches) || filteredBatches.length === 0 ? (
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
                  suppressHydrationWarning
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3 sm:space-y-4">
                {Array.isArray(filteredBatches) && filteredBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{batch.name}</h3>
                        <p className="text-sm text-gray-600">{batch.course} • {batch.year_of_joining}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(batch.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Academic Year: {batch.academic_year}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          batch.auto_promote 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {batch.auto_promote ? "Auto-Promote" : "Manual"}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          batch.editable 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {batch.editable ? "Editable" : "Locked"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">{batch.student_count}</span> students
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditBatch(batch)}
                          suppressHydrationWarning
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteBatch(batch.id)}
                          suppressHydrationWarning
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
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Batch Name</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Year</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Course</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Students</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Academic Year</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Auto-Promote</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Editable</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Created</th>
                      <th className="p-3 text-left font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(filteredBatches) && filteredBatches.map((batch) => (
                      <tr key={batch.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium text-gray-900 text-sm">{batch.name}</td>
                        <td className="p-3 text-gray-700 text-sm">{batch.year_of_joining}</td>
                        <td className="p-3 text-gray-700 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {batch.course}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">
                          <span className="font-medium">{batch.student_count}</span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">Year {batch.academic_year}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            batch.auto_promote 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {batch.auto_promote ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            batch.editable 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {batch.editable ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">{new Date(batch.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditBatch(batch)}
                              suppressHydrationWarning
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteBatch(batch.id)}
                              suppressHydrationWarning
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