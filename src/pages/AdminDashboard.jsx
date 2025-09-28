import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployeeManagement from '../components/EmployeeManagement';
import AttendanceRecap from '../components/AttendanceRecap';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showAttendanceRecap, setShowAttendanceRecap] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-indigo-100">Welcome, {user?.fullName}!</span>
              <span className="text-sm text-indigo-200">({user?.role})</span>
              <button
                onClick={goToHome}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                HR Management Tools
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Administrative functions available to HR personnel.
              </p>
            </div>
            <ul className="border-t border-gray-200 divide-y divide-gray-200">
              <li>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Employee Management</div>
                      <div className="text-sm text-gray-500">Manage employee records and information</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEmployeeManagement(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Access
                  </button>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Attendance Recap</div>
                      <div className="text-sm text-gray-500">View all employee attendance records</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAttendanceRecap(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Access
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Employee Management Modal */}
      {showEmployeeManagement && (
        <EmployeeManagement 
          onClose={() => setShowEmployeeManagement(false)}
        />
      )}

      {/* Attendance Recap Modal */}
      {showAttendanceRecap && (
        <AttendanceRecap 
          onClose={() => setShowAttendanceRecap(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;