/**
 * API Configuration for the Cashier Application
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl && envUrl !== 'undefined') {
    return envUrl;
  }

  // Fallback for development if environment variable is missing
  if (import.meta.env.MODE === 'development') {
    console.warn('VITE_API_BASE_URL is not defined, falling back to http://localhost:5000');
    return 'http://localhost:5000';
  }

  // In production, we need a valid URL. If it's missing, let's log use a sane default or throw.
  // Actually, for Render, if the user hasn't set it, we could try to infer it if we knew the backend URL.
  // But for now, let's just make it clear that it's missing.
  console.error('CRITICAL: VITE_API_BASE_URL is not defined in environment variables.');
  
  // Return the current origin as a last resort, which might work if proxying is set up, 
  // though that's unlikely in this setup.
  return ''; 
};

export const API_BASE_URL = getApiBaseUrl();

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/cashier/login`,
  DASHBOARD: `${API_BASE_URL}/api/cashier/dashboard`,
  // Add other endpoints here
};
