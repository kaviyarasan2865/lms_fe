// Faculty types
export interface Faculty {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  college: number;
  college_name: string;
  designation: string;
  status: 'active' | 'inactive';
  education_details: string;
  department?: string;
  subjects: Array<{ id: number; name: string }>;
  subjects_list?: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

export interface CreateFacultyData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  college_id: number;
  designation: string;
  status: 'active' | 'inactive';
  education_details: string;
  department?: string;
  subject_ids?: number[];
}

export interface UpdateFacultyData extends Partial<CreateFacultyData> {
  id: number;
}
// Faculty API functions
export const facultyApi = {
  // Get all faculty (handles paginated and array responses)
  getAll: async (): Promise<Faculty[]> => {
    const data = await makeRequest('/faculties/');
    if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },

  // Get faculty by ID
  getById: async (id: number): Promise<Faculty> => {
    return makeRequest(`/faculties/${id}/`);
  },

  // Create faculty
  create: async (data: CreateFacultyData): Promise<Faculty> => {
    return makeRequest('/faculties/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update faculty
  update: async (id: number, data: UpdateFacultyData): Promise<Faculty> => {
    return makeRequest(`/faculties/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete faculty
  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/faculties/${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
      }
      throw new Error('Authentication required');
    }
    if (!response.ok) {
      const errorData = await response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch {
          return { error: text || `HTTP error! status: ${response.status}` };
        }
      });
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }
    return;
  },
};
// API service functions for LMS
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';


// Types
export interface AcademicYear {
  id: number;
  year: number;
  label: string;
  start_date: string;
  end_date: string;
  auto_promote: boolean;
  editable: boolean;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: number;
  college: number;
  college_name: string;
  course: string;
  year_of_joining: number;
  name: string;
  auto_promote_after_days: number;
  student_count: number;
  academic_years: AcademicYear[];
  created_at: string;
  updated_at: string;
}

export interface CreateBatchData {
  course: string;
  year_of_joining: number;
  name: string;
  auto_promote_after_days: number;
  college: number;
  academic_years: Omit<AcademicYear, 'id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateBatchData extends Partial<CreateBatchData> {
  id: number;
}

// Student types
export interface Student {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  college: number;
  college_name: string;
  batch: number | null;
  batch_name: string | null;
  roll_no: string;
  phone_number: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  roll_no: string;
  phone_number: string;
  college_id: number;
  batch_id?: number | null;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: number;
}

// Auth helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic request helper
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return handleApiResponse(response);
};

// API response wrapper
const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token expired, clear tokens and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Batch API functions
export const batchApi = {
  // Get all batches
  getAll: async (): Promise<Batch[]> => {
    const response = await fetch(`${API_BASE_URL}/batches/`, {
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get single batch
  getById: async (id: number): Promise<Batch> => {
    const response = await fetch(`${API_BASE_URL}/batches/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Create new batch
  create: async (data: CreateBatchData): Promise<Batch> => {
    const response = await fetch(`${API_BASE_URL}/batches/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  // Update batch
  update: async (id: number, data: Partial<CreateBatchData>): Promise<Batch> => {
    const response = await fetch(`${API_BASE_URL}/batches/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  // Delete batch
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/batches/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
  },
};

// College API functions
export const collegeApi = {
  // Get current user's college
  getCurrent: async () => {
    const response = await fetch(`${API_BASE_URL}/colleges/`, {
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};

// User API functions
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile/`, {
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};

// Student API functions
export const studentApi = {
  // Get all students
  getAll: async (): Promise<Student[]> => {
    return makeRequest('/students/');
  },

  // Get student by ID
  getById: async (id: number): Promise<Student> => {
    return makeRequest(`/students/${id}/`);
  },

  // Create student
  create: async (data: CreateStudentData): Promise<Student> => {
    return makeRequest('/students/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update student
  update: async (id: number, data: UpdateStudentData): Promise<Student> => {
    return makeRequest(`/students/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete student
  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (response.status === 401) {
      // Token expired, clear tokens and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
      }
      throw new Error('Authentication required');
    }
    
    if (!response.ok) {
      const errorData = await response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch {
          return { error: text || `HTTP error! status: ${response.status}` };
        }
      });
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    // Delete operations typically return 204 No Content with no body
    return;
  },

  // Bulk upload students
  bulkUpload: async (file: File): Promise<{ message: string; created: number; errors: any[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/students/bulk-upload/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return handleApiResponse(response);
  },

  // Download student template
  downloadTemplate: async (): Promise<Blob> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/students/download-template/`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    return response.blob();
  },
};