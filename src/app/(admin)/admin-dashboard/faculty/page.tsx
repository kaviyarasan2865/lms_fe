'use client'
import { useState, useEffect } from "react";

interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  designation: string;
  status: "active" | "inactive";
  subjects: string[];
  educationDetails: string;
  dateAdded: string;
  department: string;
}

const MEDICAL_SUBJECTS = [
  "Anatomy",
  "Physiology", 
  "Biochemistry",
  "Pathology",
  "Internal Medicine",
  "Surgery",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "ENT",
  "Orthopedics",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "Pharmacology",
  "Microbiology",
  "Forensic Medicine",
  "Community Medicine",
  "Emergency Medicine"
];

const DESIGNATIONS = [
  { value: "assistant_professor", label: "Assistant Professor" },
{ value: "professor", label: "Professor" },
{ value: "hod", label: "Head of Department" },
{ value: "dean", label: "Dean" },
{ value: "lecturer", label: "Lecturer" },
{ value: "senior_lecturer", label: "Senior Lecturer" }
];

const DEPARTMENTS = [
  "Basic Sciences",
  "Clinical Sciences",
  "Para Clinical",
  "Community Medicine",
  "Administration"
];

const FacultyManagement = () => {
  // Subject list for mapping names to IDs
  const [subjectList, setSubjectList] = useState<{ id: number; name: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user and college info
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { userApi } = await import("@/lib/api");
        const profile = await userApi.getProfile();
        setCurrentUser(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch subject list on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { facultyApi } = await import("@/lib/api");
        // Try both subjects and subjects_list from first faculty, fallback to empty
        const apiData = await facultyApi.getAll();
        let subjects: { id: number; name: string }[] = [];
        if (apiData && typeof apiData === 'object' && 'results' in apiData && Array.isArray((apiData as any).results)) {
          const first = (apiData as any).results[0];
          subjects = first?.subjects_list || first?.subjects || [];
        } else if (Array.isArray(apiData) && apiData.length > 0) {
          subjects = apiData[0].subjects_list || apiData[0].subjects || [];
        }
        
        // If no subjects from faculty, try to fetch from subjects endpoint
        if (subjects.length === 0) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/subjects/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
              },
            });
            if (response.ok) {
              const subjectsData = await response.json();
              subjects = Array.isArray(subjectsData) ? subjectsData.map((s: any) => ({ id: s.id, name: s.name })) : [];
            }
          } catch (error) {
            console.error("Failed to fetch subjects:", error);
          }
        }
        
        setSubjectList(subjects);
      } catch {
        setSubjectList([]);
      }
    };
    fetchSubjects();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load faculty from backend
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError("");
      try {
        const { facultyApi } = await import("@/lib/api");
        const apiData = await facultyApi.getAll();
        console.log("Raw facultyApi.getAll() response:", apiData);
          // Map API response to local Faculty structure
          const facultyArray = (apiData && typeof apiData === 'object' && 'results' in apiData && Array.isArray((apiData as any).results))
            ? (apiData as any).results
            : Array.isArray(apiData)
              ? apiData
              : [];
          const mappedFaculty = facultyArray.map((f: any) => {
            const firstName = f.user?.first_name || f.first_name || "";
            const lastName = f.user?.last_name || f.last_name || "";
            const mobileNumber = f.user?.phone_number || f.phone_number || "";
            // subjects: backend returns as array of names (['Anatomy', ...])
            let subjects: string[] = [];
            if (Array.isArray(f.subjects)) {
              subjects = f.subjects.map((s: any) => typeof s === 'string' ? s : s?.name || "");
            }
            else if (Array.isArray(f.subjects_list)) {
              subjects = f.subjects_list.map((s: any) => typeof s === 'string' ? s : s?.name || "");
            }
            return {
              id: String(f.id),
              firstName,
              lastName,
              mobileNumber,
              email: f.user?.email || f.email || "",
              designation: f.designation || "",
              status: f.status || "inactive",
              subjects,
              educationDetails: f.education_details || "",
              dateAdded: f.created_at || "",
              department: f.department || ""
            };
          });
        console.log("Mapped faculty for UI:", mappedFaculty);
        setFaculty(mappedFaculty);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load faculty");
        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [showFacultyDetails, setShowFacultyDetails] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState<'name' | 'designation' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    designation: "",
    status: "active" as "active" | "inactive",
    educationDetails: "",
    department: ""
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [faculty, setFaculty] = useState<Faculty[]>([]);

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
    else if (!/^\+91\s\d{10}$/.test(formData.mobileNumber)) errors.mobileNumber = "Invalid mobile format (+91 xxxxxxxxxx)";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.department) errors.department = "Department is required";
    if (selectedSubjects.length === 0) errors.subjects = "At least one subject is required";
    // Check for duplicate email (excluding current editing faculty)
    const duplicateEmail = faculty.find(f => 
      f.email.toLowerCase() === formData.email.toLowerCase() && 
      f.id !== editingFaculty?.id
    );
    if (duplicateEmail) errors.email = "Email already exists";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      designation: "",
      status: "active",
      educationDetails: "",
      department: ""
    });
    setSelectedSubjects([]);
    setFormErrors({});
    setEditingFaculty(null);
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
    if (formErrors.subjects) {
      setFormErrors(prev => ({ ...prev, subjects: "" }));
    }
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects(prev => [...prev, customSubject.trim()]);
      setCustomSubject("");
      if (formErrors.subjects) {
        setFormErrors(prev => ({ ...prev, subjects: "" }));
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const { facultyApi } = await import("@/lib/api");
      // Map selectedSubjects (names) to subject IDs using subjectList
      const subject_ids = selectedSubjects
        .map(name => subjectList.find(s => s.name === name)?.id)
        .filter((id): id is number => !!id);
      const payload = {
        username: formData.email.split("@")[0],
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: "faculty123", // TODO: allow password input if needed
        password_confirm: "faculty123",
        college_id: currentUser?.college_admin_profile?.id || 1, // Get college_id from admin profile
        designation: formData.designation,
        status: formData.status,
        education_details: formData.educationDetails,
        department: formData.department,
        subject_ids,
        phone_number: formData.mobileNumber,
      };
      if (editingFaculty) {
        const updatePayload = { ...payload, id: Number(editingFaculty.id) };
        await facultyApi.update(Number(editingFaculty.id), updatePayload);
        setSuccess("Faculty updated successfully!");
      } else {
        await facultyApi.create(payload);
        setSuccess("Faculty created successfully!");
      }
      // Reload faculty list and map to local structure
      const apiData = await facultyApi.getAll();
      const facultyArray = (apiData && typeof apiData === 'object' && 'results' in apiData && Array.isArray((apiData as any).results))
        ? (apiData as any).results
        : Array.isArray(apiData)
          ? apiData
          : [];
      const mappedFaculty = facultyArray.map((f: any) => {
        const firstName = f.user?.first_name || f.first_name || "";
        const lastName = f.user?.last_name || f.last_name || "";
        const mobileNumber = f.user?.phone_number || f.phone_number || "";
        let subjects: string[] = [];
        if (Array.isArray(f.subjects)) {
          subjects = f.subjects.map((s: any) => typeof s === 'string' ? s : s?.name || "");
        }
        else if (Array.isArray(f.subjects_list)) {
          subjects = f.subjects_list.map((s: any) => typeof s === 'string' ? s : s?.name || "");
        }
        return {
          id: String(f.id),
          firstName,
          lastName,
          mobileNumber,
          email: f.user?.email || f.email || "",
          designation: f.designation || "",
          status: f.status || "inactive",
          subjects,
          educationDetails: f.education_details || "",
          dateAdded: f.created_at || "",
          department: f.department || ""
        };
      });
      setFaculty(mappedFaculty);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save faculty");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: Faculty) => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      mobileNumber: member.mobileNumber,
      email: member.email,
      designation: member.designation,
      status: member.status,
      educationDetails: member.educationDetails,
      department: member.department || ""
    });
    setSelectedSubjects(member.subjects);
    setEditingFaculty(member);
    setShowForm(true);
  };

  const handleRemoveFaculty = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const { facultyApi } = await import("@/lib/api");
      await facultyApi.delete(Number(id));
      setSuccess("Faculty removed successfully!");
      const apiData = await facultyApi.getAll();
      const facultyArray = (apiData && typeof apiData === 'object' && 'results' in apiData && Array.isArray((apiData as any).results))
        ? (apiData as any).results
        : Array.isArray(apiData)
          ? apiData
          : [];
      const mappedFaculty = facultyArray.map((f: any) => ({
        id: String(f.id),
        firstName: f.user?.first_name || f.first_name || "",
        lastName: f.user?.last_name || f.last_name || "",
        mobileNumber: f.user?.phone_number || f.phone_number || f.user?.mobileNumber || f.mobileNumber || "",
        email: f.user?.email || f.email || "",
        designation: f.designation || "",
        status: f.status || "inactive",
        subjects: Array.isArray(f.subjects_list) && f.subjects_list.length > 0
          ? f.subjects_list.map((s: any) => s.name)
          : Array.isArray(f.subjects) && f.subjects.length > 0
            ? f.subjects.map((s: any) => s.name)
            : [],
        educationDetails: f.education_details || "",
        dateAdded: f.created_at || "",
        department: f.department || ""
      }));
      setFaculty(mappedFaculty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove faculty");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleSort = (field: 'name' | 'designation' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort faculty
  const filteredAndSortedFaculty = faculty
    .filter(member => {
      const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDesignation = !designationFilter || member.designation === designationFilter;
      const matchesStatus = !statusFilter || member.status === statusFilter;
      const matchesDepartment = !departmentFilter || member.department === departmentFilter;
      return matchesSearch && matchesDesignation && matchesStatus && matchesDepartment;
    })
    .sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'designation':
          aValue = a.designation;
          bValue = b.designation;
          break;
        case 'date':
          aValue = a.dateAdded;
          bValue = b.dateAdded;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedFaculty.length / itemsPerPage);
  const paginatedFaculty = filteredAndSortedFaculty.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, designationFilter, statusFilter, departmentFilter]);

  const FacultyCard = ({ member }: { member: Faculty }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{member.firstName} {member.lastName}</h3>
          <p className="text-sm text-gray-600">{member.designation}</p>
          <p className="text-xs text-gray-500">{member.department}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          member.status === "active" 
            ? "bg-green-50 text-green-700" 
            : "bg-gray-100 text-gray-600"
        }`}>
          {member.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium w-16 flex-shrink-0">Email:</span>
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium w-16 flex-shrink-0">Mobile:</span>
          <span>{member.mobileNumber}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">Subjects:</div>
        <div className="flex flex-wrap gap-1">
          {member.subjects.slice(0, 3).map(subject => (
            <span key={subject} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
              {subject}
            </span>
          ))}
          {member.subjects.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{member.subjects.length - 3}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => {
            setSelectedFaculty(member);
            setShowFacultyDetails(true);
          }}
          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors text-center"
        >
          View
        </button>
        <button 
          onClick={() => handleEdit(member)}
          className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors text-center"
        >
          Edit
        </button>
        <button 
          onClick={() => setShowDeleteConfirm(member.id)}
          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors text-center"
        >
          Remove
        </button>
      </div>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedFaculty.length)} of {filteredAndSortedFaculty.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Faculty Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage faculty members and their subject assignments</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Total Faculty: {faculty.length}</span>
              <span>Active: {faculty.filter(f => f.status === 'active').length}</span>
              <span>Inactive: {faculty.filter(f => f.status === 'inactive').length}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (showForm && !editingFaculty) {
                setShowForm(false);
                resetForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showForm && !editingFaculty ? 'Cancel' : editingFaculty ? 'Cancel Edit' : 'Add New Faculty'}
          </button>
        </div>

        {/* Add/Edit Faculty Form */}
        {showForm && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
            </h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="+91 9876543210"
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="faculty@medcollege.edu"
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Designation *</label>
                    <select 
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.designation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select designation</option>
                      {DESIGNATIONS.map(d => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.designation && <p className="text-red-500 text-xs mt-1">{formErrors.designation}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Department *</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none ${
                        formErrors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(department => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                    {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Status *</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as "active" | "inactive")}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Education Details</label>
                    <textarea
                      value={formData.educationDetails}
                      onChange={(e) => handleInputChange('educationDetails', e.target.value)}
                      placeholder="e.g., MBBS, MD (Internal Medicine), Fellowship in Cardiology"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Assignment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Assignment *</h3>
                
                {/* Quick Add Subjects */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Select Subjects</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {MEDICAL_SUBJECTS.map(subject => (
                      <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.subjects && <p className="text-red-500 text-xs mt-1">{formErrors.subjects}</p>}
                </div>

                {/* Custom Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Add Custom Subject</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Enter custom subject name"
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSubject()}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSubject}
                      className="w-full sm:w-auto px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Add Subject
                    </button>
                  </div>
                </div>

                {/* Selected Subjects */}
                {selectedSubjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Selected Subjects ({selectedSubjects.length})
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {selectedSubjects.map(subject => (
                        <span
                          key={subject}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => handleSubjectToggle(subject)}
                            className="text-blue-700 hover:text-blue-900 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    editingFaculty ? 'Update Faculty' : 'Add Faculty'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Faculty List */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Faculty Members</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSort('name')}
                  className={`text-sm px-2 py-1 rounded ${
                    sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('designation')}
                  className={`text-sm px-2 py-1 rounded ${
                    sortBy === 'designation' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Title {sortBy === 'designation' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('date')}
                  className={`text-sm px-2 py-1 rounded ${
                    sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search faculty..."
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
              />
              <select 
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Designations</option>
                {DESIGNATIONS.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(department => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {showMobileFilters ? 'Hide Filters' : 'Show Filters & Search'}
            </button>
          </div>
          
          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden mb-4 space-y-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search faculty..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <select 
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Designations</option>
                {DESIGNATIONS.map(designation => (
                  <option key={designation.label} value={designation.value}>
                    {designation.label}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(department => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDesignationFilter('');
                  setStatusFilter('');
                  setDepartmentFilter('');
                }}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredAndSortedFaculty.length} of {faculty.length} faculty members
            {(searchTerm || designationFilter || statusFilter || departmentFilter) && ' (filtered)'}
          </div>
          
          {/* Desktop Table */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-900">Name</th>
                  <th className="p-3 text-left font-medium text-gray-900">Email</th>
                  <th className="p-3 text-left font-medium text-gray-900">Mobile</th>
                  <th className="p-3 text-left font-medium text-gray-900">Designation</th>
                  <th className="p-3 text-left font-medium text-gray-900">Department</th>
                  <th className="p-3 text-left font-medium text-gray-900">Subjects</th>
                  <th className="p-3 text-left font-medium text-gray-900">Status</th>
                  <th className="p-3 text-left font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFaculty.map((member) => (
                  <tr key={member.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-gray-500">Added: {new Date(member.dateAdded).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700">{member.email}</td>
                    <td className="p-3 text-gray-700">{member.mobileNumber}</td>
                    <td className="p-3 text-gray-700">{member.designation}</td>
                    <td className="p-3 text-gray-700">{member.department}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {member.subjects.slice(0, 2).map(subject => (
                          <span key={subject} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                        {member.subjects.length > 2 && (
                          <button
                            onClick={() => {
                              setSelectedFaculty(member);
                              setShowFacultyDetails(true);
                            }}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                          >
                            +{member.subjects.length - 2}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.status === "active" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedFaculty(member);
                            setShowFacultyDetails(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEdit(member)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(member.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
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
          
          {/* Mobile/Tablet Cards */}
          <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFaculty.map((member) => (
              <FacultyCard key={member.id} member={member} />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredAndSortedFaculty.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || designationFilter || statusFilter || departmentFilter
                  ? "No faculty members match your current filters. Try adjusting your search criteria."
                  : "Get started by adding your first faculty member."
                }
              </p>
              {(searchTerm || designationFilter || statusFilter || departmentFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDesignationFilter('');
                    setStatusFilter('');
                    setDepartmentFilter('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
          
          {/* Pagination */}
          <Pagination />
        </div>

        {/* Faculty Details Modal */}
        {showFacultyDetails && selectedFaculty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedFaculty.firstName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedFaculty.firstName} {selectedFaculty.lastName}</h2>
                      <p className="text-lg text-gray-600">{selectedFaculty.designation}</p>
                      <p className="text-sm text-gray-500">{selectedFaculty.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFacultyDetails(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-gray-900">{selectedFaculty.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mobile</p>
                            <p className="text-gray-900">{selectedFaculty.mobileNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            selectedFaculty.status === "active" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {selectedFaculty.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date Added</p>
                          <p className="text-gray-900">{new Date(selectedFaculty.dateAdded).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">{selectedFaculty.educationDetails || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Subjects ({selectedFaculty.subjects.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFaculty.subjects.map(subject => (
                          <span key={subject} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowFacultyDetails(false);
                      handleEdit(selectedFaculty);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Edit Faculty
                  </button>
                  <button
                    onClick={() => setShowFacultyDetails(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to remove{' '}
                  <span className="font-semibold">
                    {faculty.find(f => f.id === showDeleteConfirm)?.firstName} {faculty.find(f => f.id === showDeleteConfirm)?.lastName}
                  </span>{' '}
                  from the faculty list?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleRemoveFaculty(Number(showDeleteConfirm))}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Remove
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement;