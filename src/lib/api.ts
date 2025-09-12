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

// Auth helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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