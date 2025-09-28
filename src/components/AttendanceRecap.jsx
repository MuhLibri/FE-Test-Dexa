import { useState, useEffect } from 'react';
import { attendanceAPI } from '../utils/api';

const AttendanceRecap = ({ onClose }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch all attendance data
  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await attendanceAPI.getAll();
      // Sort by timestamp descending (newest first)
      const sortedData = data.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setAttendanceData(sortedData);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    let data = [...attendanceData];

    // Filter by search term (employeeId or fullName)
    if (searchTerm) {
      data = data.filter(record =>
        (record.employeeId && record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.fullName && record.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by date
    if (filterDate) {
      data = data.filter(record => {
        // Converts record timestamp to YYYY-MM-DD format for comparison
        const recordDate = new Date(record.timestamp).toLocaleDateString('en-CA');
        return recordDate === filterDate;
      });
    }

    setFilteredData(data);
  }, [attendanceData, searchTerm, filterDate]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
  };

  // Handle view photo
  const handleViewPhoto = async (photoPath) => {
    if (!photoPath) return;
    
    setPhotoLoading(true);
    try {
      const photoUrl = attendanceAPI.getPhotoUrl(photoPath);
      console.log('Photo URL:', photoUrl);
      setSelectedPhoto(photoUrl);
    } catch (err) {
      console.error('Error loading photo:', err);
      alert('Failed to load photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900">Attendance Recap - All Employees</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search by ID / Name
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Employee ID or Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Filter by Date
              </label>
              <input
                type="date"
                id="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDate('');
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading attendance data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                  <button 
                    onClick={fetchAttendanceData}
                    className="mt-2 text-sm text-red-700 hover:text-red-500 font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          {!loading && !error && attendanceData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.timestamp)} WIB
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.employeeId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {record.photoUrl ? (
                          <button
                            onClick={() => handleViewPhoto(record.photoUrl)}
                            disabled={photoLoading}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          >
                            {photoLoading ? 'Loading...' : 'View Photo'}
                          </button>
                        ) : (
                          <span className="text-gray-400">No Photo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                {attendanceData.length > 0 ? 'No records match your filters.' : 'No attendance records found.'}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          {!loading && !error && attendanceData.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Records Displayed</p>
                    <p className="text-2xl font-bold text-blue-900">{filteredData.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-800">Total Records</p>
                    <p className="text-2xl font-bold text-green-900">
                      {attendanceData.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8a3 3 0 110-6 3 3 0 010 6z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Today's Attendance</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {attendanceData.filter(record => {
                        const today = new Date().toLocaleDateString('en-CA');
                        const recordDate = new Date(record.timestamp).toLocaleDateString('en-CA');
                        return recordDate === today;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="text-center pt-4 mt-6">
            <button
              onClick={fetchAttendanceData}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedPhoto}
              alt="Attendance Photo"
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={() => {
                alert('Failed to load photo');
                setSelectedPhoto(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecap;