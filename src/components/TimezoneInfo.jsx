import { useState, useEffect } from 'react';
import { formatIndonesianTime, getWIBOffset } from '../utils/timezone';

const TimezoneInfo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const wibTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
      setCurrentTime(wibTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
      <div className="flex items-center">
        <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-800">
          <p><strong>Current Time (WIB):</strong> {formatIndonesianTime(currentTime)}</p>
          <p className="text-xs text-blue-600 mt-1">
            Timezone: GMT{getWIBOffset()} - Waktu Indonesia Barat
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimezoneInfo;