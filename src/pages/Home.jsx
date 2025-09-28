import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AttendanceCard from '../components/AttendanceCard';
import AttendanceHistory from '../components/AttendanceHistory';

const Home = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [hasAttendanceToday, setHasAttendanceToday] = useState(false);
  const [historyKey, setHistoryKey] = useState(0); // To force re-render of AttendanceHistory
  const historyRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  // Callback when attendance history is loaded
  const handleHistoryLoad = (hasAttendance) => {
    setHasAttendanceToday(hasAttendance);
  };

  // Callback when attendance is successfully submitted
  const handleAttendanceSuccess = () => {
    console.log('Attendance success callback triggered - refreshing history');
    setHasAttendanceToday(true);
    setHistoryKey(prev => prev + 1); // Force refresh of AttendanceHistory
    
    // Also call refresh method directly if available
    if (historyRef.current) {
      console.log('Calling refresh method on AttendanceHistory');
      historyRef.current.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Home</h1>
            </div>
            <div className="flex items-center space-x-8">
              <span className="text-gray-700">Welcome, {user?.fullName}!</span>
              {hasRole('HR') && (
                <button
                  onClick={goToAdmin}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </button>
              )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Profile & Info */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to the Home Page!
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Your Profile:</h3>
                  <div className="text-left">
                    <p><strong>Employee ID:</strong> {user?.employeeId}</p>
                    <p><strong>Name:</strong> {user?.fullName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    {user?.id && <p><strong>ID:</strong> {user.id}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Attendance */}
            <div className="space-y-6">
              <AttendanceCard 
                hasAttendanceToday={hasAttendanceToday}
                onAttendanceSuccess={handleAttendanceSuccess}
              />
              <AttendanceHistory 
                ref={historyRef}
                key={historyKey}
                onHistoryLoad={handleHistoryLoad}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;