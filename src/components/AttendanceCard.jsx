import { useState, useRef, useEffect } from 'react';
import { attendanceAPI } from '../utils/api';
import { getWIBTimestamp } from '../utils/timezone';

const AttendanceCard = ({ hasAttendanceToday = false, onAttendanceSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fileInputRef = useRef(null);

  // Update current time every second (WIB timezone)
  useEffect(() => {
    const timer = setInterval(() => {
      // Update with WIB time
      const wibTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
      setCurrentTime(wibTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAttendance = async () => {
    if (!selectedFile) {
      setError('Please select a photo first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await attendanceAPI.checkIn(selectedFile);
      setSuccess(true);
      setError('');
      
      // Log the timestamp that was sent
      console.log('Attendance submitted at (WIB):', getWIBTimestamp());
      console.log('Attendance response:', response);
      
      // Notify parent component about successful attendance
      if (onAttendanceSuccess) {
        console.log('Calling onAttendanceSuccess callback to refresh history');
        onAttendanceSuccess();
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit attendance');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">Attendance Check-In</h3>
      </div>

      {/* Show already attended message if user has attendance today */}
      {hasAttendanceToday && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700 font-medium">
              You have already checked in today!
            </p>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your attendance for today has been recorded successfully.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* File Upload Section - Hide if already attended today */}
        {!hasAttendanceToday && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo for Attendance
            </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="photo-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>{previewUrl ? 'Change photo' : 'Upload a photo'}</span>
                  <input
                    id="photo-upload"
                    name="photo-upload"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                </label>
                {!previewUrl && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 5MB
              </p>
            </div>
          </div>
          </div>
        )}

        {/* Selected File Info - Only show if not attended today */}
        {!hasAttendanceToday && selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-800">{selectedFile.name}</p>
                <p className="text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-800">Attendance submitted successfully!</p>
            </div>
          </div>
        )}

        {/* Timestamp Info - Only show if not attended today */}
        {!hasAttendanceToday && selectedFile && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600">
                <p><strong>Check-in time (WIB):</strong> {currentTime.toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'})}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Timestamp will be recorded in WIB timezone when you submit
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Only show if not attended today */}
        {!hasAttendanceToday && (
          <button
            onClick={handleAttendance}
            disabled={loading || !selectedFile}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !selectedFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Attendance'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;