/**
 * Environment variables utility
 * Centralized access to environment variables with fallbacks
 */

export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Development settings
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Optional settings
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000,
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
  
  // Vite built-in
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL,
};

/**
 * Check if all required environment variables are set
 */
export const validateEnv = () => {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};

/**
 * Get environment info for debugging
 */
export const getEnvInfo = () => {
  return {
    mode: env.MODE,
    isDev: env.DEV,
    isProd: env.PROD,
    apiUrl: env.API_BASE_URL,
    nodeEnv: env.NODE_ENV,
    baseUrl: env.BASE_URL,
    debug: env.DEBUG,
  };
};

export default env;