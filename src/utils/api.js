import env from './env.js';
import { getWIBTimestamp } from './timezone.js';

const API_BASE_URL = env.API_BASE_URL;

export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', 
    };

    const response = await fetch(url, config);
    console.log(`API call to ${endpoint} responded with ${response.status}`);
    
    // Handle unauthorized access
    if (response.status === 401) {
      console.error("Authentication Error: Received 401 Unauthorized. The server rejected the session. Check browser cookies and backend CORS settings.");
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // For 204 No Content responses, return a success indicator
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // This function is called by AuthContext to check if a session cookie is valid
  checkSession: async () => {
    return apiCall('/auth/check-session');
  },

  // This function tells the backend to clear the HttpOnly cookie
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
  
  register: async (email, password, fullName, employeeId) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        fullName, 
        employeeId 
      })
    });
  },
};

// Attendance API functions
export const attendanceAPI = {
  checkIn: async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    // Add timestamp in WIB (GMT+7)
    const timestamp = getWIBTimestamp();
    console.log('Check-in timestamp (WIB):', timestamp);
    formData.append('timestamp', timestamp);
    
    return apiCall('/attendances/clock-in', {
      method: 'POST',
      body: formData,
    });
  },

  getHistory: async () => {
    try {
      return await apiCall('/attendances/me');
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('HTTP error! status: 404')) {
        console.log('Attendance history not found, returning empty array');
        return [];
      }
      console.warn('Failed to fetch attendance history:', error.message);
      return [];
    }
  },
  
  getAll: async () => {
    try {
      return await apiCall('/attendances/all');
    } catch (error) {
      console.error('Failed to fetch all attendance:', error);
      throw error;
    }
  },
  
  // Helper function to get photo URL
  getPhotoUrl: (photoPath) => {
    if (!photoPath) return null;
    const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
    return `${API_BASE_URL}/attendances/${cleanPath}`;
  },
};

// Employee API functions
export const employeeAPI = {
  getAll: async () => {
    try {
      return await apiCall('/employees');
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  },
  
  addEmployee: async (fullEmployeeData) => {
    console.log('Adding new employee with data:', fullEmployeeData);
    try {
      return await apiCall('/employees', {
        method: 'POST',
        body: JSON.stringify(fullEmployeeData)
      });
    } catch (error) {
      console.error('Failed to add new employee:', error);
      throw error;
    }
  },
  
  update: async (id, employeeData) => {
    try {
      return await apiCall(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData)
      });
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      throw error;
    }
  }
};


export default {
  auth: authAPI,
  attendance: attendanceAPI,
  employee: employeeAPI,
};