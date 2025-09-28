import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user session exists on the server
    const checkUserSession = async () => {
      try {
        // This endpoint should be protected by the cookie.
        // If the cookie is valid, it will return user data.
        // If not, it will return an error (e.g., 401).
        const data = await authAPI.checkSession(); // Assuming you have a `checkSession` method in `api.js`
        
        if (data && data.user) {
          let newData = {
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role || 'EMPLOYEE',
            employeeId: data.user.employeeId || null,
            id: data.user.id || data.userId
          }
          setUser(newData);
        }
      } catch (error) {
        // If there's an error (like 401), it means no active session.
        console.log('No active session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const loginWithAPI = async (email, password) => {
    try {
      // The backend will handle setting the HttpOnly cookie upon successful login.
      // The response should contain the user data, but not the token.
      const data = await authAPI.login(email, password);
      
      const userData = {
        email,
        fullName: data.user.fullName || email,
        role: data.user.role || 'EMPLOYEE',
        employeeId: data.user.employeeId || null,
        id: data.user.id || data.userId
      };
      
      setUser(userData);
      
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call the backend endpoint to clear the HttpOnly cookie
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user state on the frontend
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    // If user object exists, they are authenticated.
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    loginWithAPI,
    logout,
    isAuthenticated,
    hasRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};