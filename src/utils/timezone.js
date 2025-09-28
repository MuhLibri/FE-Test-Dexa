/**
 * Timezone utility functions for Indonesian time zones
 */

// Indonesian timezone constants
export const TIMEZONES = {
  WIB: 'Asia/Jakarta',    // GMT+7 (Waktu Indonesia Barat)
  WITA: 'Asia/Makassar',  // GMT+8 (Waktu Indonesia Tengah)  
  WIT: 'Asia/Jayapura'    // GMT+9 (Waktu Indonesia Timur)
};

/**
 * Get current time in WIB timezone
 * @returns {Date} Date object in WIB timezone
 */
export const getWIBTime = () => {
  return new Date(new Date().toLocaleString("en-US", {timeZone: TIMEZONES.WIB}));
};

/**
 * Get WIB timestamp - SIMPLE VERSION
 * @returns {string} Simple readable timestamp for WIB
 */
export const getWIBTimestamp = () => {
  return new Date().toLocaleString('sv-SE', {
    timeZone: 'Asia/Jakarta'
  }).replace(' ', 'T') + '+07:00';
};

/**
 * Get WIB timestamp in full ISO format (if needed for API)
 * @returns {string} Full ISO timestamp with WIB timezone
 */
export const getWIBTimestampISO = () => {
  const now = new Date();
  
  // Get WIB time components
  const wibDate = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now);
  
  return wibDate.replace(' ', 'T') + '+07:00';
};

/**
 * Format date to Indonesian locale string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatIndonesianDate = (date = new Date()) => {
  return new Date(date.toLocaleString("en-US", {timeZone: TIMEZONES.WIB}))
    .toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: TIMEZONES.WIB
    });
};

/**
 * Format time only in Indonesian locale
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatIndonesianTime = (date = new Date()) => {
  return new Date(date.toLocaleString("en-US", {timeZone: TIMEZONES.WIB}))
    .toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit', 
      second: '2-digit',
      timeZone: TIMEZONES.WIB
    });
};

/**
 * Get timezone offset for WIB
 * @returns {string} Timezone offset string (e.g., "+07:00")
 */
export const getWIBOffset = () => {
  const date = new Date();
  const wibDate = new Date(date.toLocaleString("en-US", {timeZone: TIMEZONES.WIB}));
  const utcDate = new Date(date.toLocaleString("en-US", {timeZone: "UTC"}));
  
  const offsetMs = wibDate.getTime() - utcDate.getTime();
  const offsetHours = offsetMs / (1000 * 60 * 60);
  
  const sign = offsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(offsetHours);
  const hours = Math.floor(absHours).toString().padStart(2, '0');
  const minutes = ((absHours % 1) * 60).toString().padStart(2, '0');
  
  return `${sign}${hours}:${minutes}`;
};

/**
 * Convert any date to WIB and return ISO string
 * @param {Date|string} date - Date to convert
 * @returns {string} ISO timestamp in WIB
 */
export const toWIBISO = (date = new Date()) => {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const wibTime = new Date(inputDate.toLocaleString("en-US", {timeZone: TIMEZONES.WIB}));
  return wibTime.toISOString();
};

export default {
  getWIBTime,
  getWIBTimestamp,
  formatIndonesianDate,
  formatIndonesianTime,
  getWIBOffset,
  toWIBISO,
  TIMEZONES
};