import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { attendanceAPI } from '../utils/api';

const AttendanceHistory = forwardRef(({ onHistoryLoad }, ref) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAllModal, setShowAllModal] = useState(false);

  // Fetch attendance history from API
  const fetchHistory = async () => {
    console.log('Fetching attendance history...');
    setLoading(true);
    setError('');
    
    try {
      const response = await attendanceAPI.getHistory();
      
      // Ensure response is an array, default to empty array if not
      const historyData = Array.isArray(response) ? response : [];
      
      // Sort by timestamp descending (newest first)
      const sortedHistory = historyData.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setHistory(sortedHistory);
      
      // Notify parent component about today's attendance status
      if (onHistoryLoad) {
        const wibFormatter = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'Asia/Jakarta'
        });
        
        const todayString = wibFormatter.format(new Date()); // YYYY-MM-DD in WIB
        
        const hasAttendanceToday = sortedHistory.some(record => {
          const recordDate = new Date(record.timestamp);
          const recordDateString = wibFormatter.format(recordDate); // YYYY-MM-DD in WIB
          return recordDateString === todayString;
        });
        
        onHistoryLoad(hasAttendanceToday);
      }
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
      setError('Failed to load attendance history. Please check your connection.');
      setHistory([]);
      
      if (onHistoryLoad) {
        onHistoryLoad(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchHistory
  }));

  // Helper function to render attendance record
  const renderAttendanceRecord = (record) => {
    const recordDate = new Date(record.timestamp);
    const dateString = recordDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    });
    const timeString = recordDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    });

    return (
      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {dateString}
            </p>
            <p className="text-xs text-gray-500">
              {timeString} WIB - {record.fullName}
            </p>
            <p className="text-xs text-gray-400">
              Employee ID: {record.employeeId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Check In
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance History</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <svg className="h-6 w-6 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">Attendance History</h3>
      </div>

      {error && (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <svg className="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
            <button 
              onClick={fetchHistory}
              className="mt-2 text-sm text-red-700 hover:text-red-500 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!error && history.length === 0 && !loading ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No attendance records found</p>
        </div>
      ) : !error && history.length > 0 && (
        <div className="space-y-3">
          {/* Show only latest 5 records */}
          {history.slice(0, 5).map(renderAttendanceRecord)}
          
          <div className="text-center pt-4 space-x-4">
            {history.length > 5 && (
              <button 
                onClick={() => setShowAllModal(true)}
                className="text-sm text-green-600 hover:text-green-500 font-medium"
              >
                See More ({history.length - 5} more records)
              </button>
            )}
            <button 
              onClick={fetchHistory}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Refresh records
            </button>
          </div>
        </div>
      )}

      {/* Modal for all attendance history */}
      {showAllModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">All Attendance History</h3>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {history.map(renderAttendanceRecord)}
              </div>
              
              <div className="text-center pt-4 border-t mt-4">
                <button
                  onClick={() => setShowAllModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    fetchHistory();
                    setShowAllModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Refresh & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AttendanceHistory.displayName = 'AttendanceHistory';

export default AttendanceHistory;