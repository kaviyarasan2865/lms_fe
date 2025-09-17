'use client'
import { useState, useEffect } from "react";
import { batchApi, collegeApi, type Batch, type CreateBatchData, type AcademicYear as ApiAcademicYear } from "@/lib/api";
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
  auto_promote_after_days: number;
  academic_years: ApiAcademicYear[];
}

interface FormAcademicYear {
  year: number;
  label: string;
  start_date: string;
  end_date: string;
  auto_promote: boolean;
  editable: boolean;
}

interface FormData {
  course: string;
  year_of_joining: number;
  name: string;
  auto_promote: boolean;
  auto_promote_after_days: number;
  academic_years: FormAcademicYear[];
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
    academic_years: [
      { year: 1, label: 'Year 1', start_date: '', end_date: '', auto_promote: false, editable: true },
      { year: 2, label: 'Year 2', start_date: '', end_date: '', auto_promote: false, editable: true },
      { year: 3, label: 'Year 3', start_date: '', end_date: '', auto_promote: false, editable: true },
      { year: 4, label: 'Year 4', start_date: '', end_date: '', auto_promote: false, editable: true }
    ],
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

  // Calculate dates for all academic years based on the first year's start date
  const calculateAcademicYearDates = (startDate: string, yearOfJoining: number) => {
    if (!startDate) return formData.academic_years;
    
    const start = new Date(startDate);
    const updatedYears = formData.academic_years.map((year, index) => {
      const yearStart = new Date(start);
      yearStart.setFullYear(yearOfJoining + index);
      
      const yearEnd = new Date(yearStart);
      yearEnd.setFullYear(yearOfJoining + index + 1);
      yearEnd.setDate(yearEnd.getDate() - 1); // Day before next year starts
      
      return {
        ...year,
        start_date: yearStart.toISOString().split('T')[0],
        end_date: yearEnd.toISOString().split('T')[0]
      };
    });
    
    return updatedYears;
  };

  const resetForm = () => {
    setFormData({
      course: 'NEET-PG',
      year_of_joining: new Date().getFullYear(),
      name: '',
      auto_promote: false,
      auto_promote_after_days: 365,
      academic_years: [
        { year: 1, label: 'Year 1', start_date: '', end_date: '', auto_promote: false, editable: true },
        { year: 2, label: 'Year 2', start_date: '', end_date: '', auto_promote: false, editable: true },
        { year: 3, label: 'Year 3', start_date: '', end_date: '', auto_promote: false, editable: true },
        { year: 4, label: 'Year 4', start_date: '', end_date: '', auto_promote: false, editable: true }
      ],
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

    // Check if at least one academic year has dates
    const hasDates = formData.academic_years.some(year => year.start_date && year.end_date);
    if (!hasDates) {
      setError('Please select start and end dates for at least one academic year');
      return;
    }

    if (!formData.college_id) {
      setError('College information not loaded. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Convert form data to API format
      const academicYearsData = formData.academic_years.map(year => ({
        year: year.year,
        label: year.label,
        start_date: year.start_date,
        end_date: year.end_date,
        auto_promote: year.auto_promote,
        editable: year.editable
      }));

      const batchData = {
        course: formData.course,
        year_of_joining: formData.year_of_joining,
        name: formData.name,
        auto_promote_after_days: formData.auto_promote_after_days,
        college: formData.college_id,
        academic_years: academicYearsData
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
    // Convert API academic years to form format
    const academicYears = batch.academic_years.map(apiYear => ({
      year: apiYear.year,
      label: apiYear.label,
      start_date: apiYear.start_date,
      end_date: apiYear.end_date,
      auto_promote: apiYear.auto_promote,
      editable: apiYear.editable
    }));

    // Ensure we have 4 years (fill missing ones with defaults)
    while (academicYears.length < 4) {
      const nextYear = academicYears.length + 1;
      academicYears.push({
        year: nextYear,
        label: `Year ${nextYear}`,
        start_date: '',
        end_date: '',
        auto_promote: false,
        editable: true
      });
    }

    setFormData({
      course: batch.course,
      year_of_joining: batch.year_of_joining,
      name: batch.name,
      auto_promote: false, // Default to false for editing
      auto_promote_after_days: batch.auto_promote_after_days,
      academic_years: academicYears,
      editable: true, // Default to true for editing
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

  const updateAcademicYear = (index: number, field: keyof FormAcademicYear, value: any) => {
    const updatedYears = [...formData.academic_years];
    updatedYears[index] = { ...updatedYears[index], [field]: value };
    
    // If start date is changed for the first year, calculate all other years
    if (field === 'start_date' && index === 0 && value) {
      const calculatedYears = calculateAcademicYearDates(value, formData.year_of_joining);
      setFormData({ ...formData, academic_years: calculatedYears });
    } else {
      setFormData({ ...formData, academic_years: updatedYears });
    }
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
                <p className="text-sm text-gray-600 mb-4">Configure all 4 academic years. When you set the start date for Year 1, the other years will be automatically calculated.</p>
                
                {/* Mobile Card View */}
                <div className="block xl:hidden space-y-3 sm:space-y-4">
                  {formData.academic_years.map((year, index) => (
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
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={year.start_date}
                              onChange={(e) => updateAcademicYear(index, 'start_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                              suppressHydrationWarning
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              value={year.end_date}
                              onChange={(e) => updateAcademicYear(index, 'end_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                              suppressHydrationWarning
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <label className="flex items-center text-sm">
                            <input 
                              type="checkbox" 
                              checked={year.auto_promote}
                              onChange={(e) => updateAcademicYear(index, 'auto_promote', e.target.checked)}
                              className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              suppressHydrationWarning
                            />
                            Auto-Promote
                          </label>
                          <label className="flex items-center text-sm">
                            <input 
                              type="checkbox" 
                              checked={year.editable}
                              onChange={(e) => updateAcademicYear(index, 'editable', e.target.checked)}
                              className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              suppressHydrationWarning
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
                    {formData.academic_years.map((year, index) => (
                      <div key={year.year} className="grid grid-cols-6 gap-0 border-t border-gray-200">
                        <div className="p-3 text-gray-700 text-sm border-r border-gray-200 flex items-center">Year {year.year}</div>
                        <div className="p-3 border-r border-gray-200">
                          <input
                            type="text"
                            value={year.label}
                            onChange={(e) => updateAcademicYear(index, 'label', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="p-3 border-r border-gray-200">
                          <input
                            type="date"
                            value={year.start_date}
                            onChange={(e) => updateAcademicYear(index, 'start_date', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="p-3 border-r border-gray-200">
                          <input
                            type="date"
                            value={year.end_date}
                            onChange={(e) => updateAcademicYear(index, 'end_date', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="p-3 border-r border-gray-200">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={year.auto_promote}
                              onChange={(e) => updateAcademicYear(index, 'auto_promote', e.target.checked)}
                              className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                              suppressHydrationWarning
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
                              suppressHydrationWarning
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promotion Settings */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Promotion Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  
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
                        <p className="text-xs text-gray-500">Academic Years: {batch.academic_years.length}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          batch.academic_years.length > 0 && batch.academic_years[0].auto_promote
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {batch.academic_years.length > 0 ? (batch.academic_years[0].auto_promote ? "Auto-Promote" : "Manual") : "N/A"}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          batch.academic_years.length > 0 && batch.academic_years[0].editable
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {batch.academic_years.length > 0 ? (batch.academic_years[0].editable ? "Editable" : "Locked") : "N/A"}
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
                        <td className="p-3 text-gray-700 text-sm">
                          {batch.academic_years.length} years
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            batch.academic_years.length > 0 && batch.academic_years[0].auto_promote
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {batch.academic_years.length > 0 ? (batch.academic_years[0].auto_promote ? "Yes" : "No") : "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            batch.academic_years.length > 0 && batch.academic_years[0].editable
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {batch.academic_years.length > 0 ? (batch.academic_years[0].editable ? "Yes" : "No") : "N/A"}
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