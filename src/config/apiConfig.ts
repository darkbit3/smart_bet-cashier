/**
 * API Configuration for the Cashier Application
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl && envUrl !== 'undefined') {
    return envUrl;
  }

  // Fallback for production (Hardcoded as requested)
  if (import.meta.env.MODE === 'production' || !import.meta.env.MODE) {
    console.warn('VITE_API_BASE_URL missing, using production fallback');
    return 'https://smart-bet-backend-7wntmhyi0-kaleabs-projects-1bd541ea.vercel.app';
  }

  // Fallback for development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/cashier/login`,
  DASHBOARD: `${API_BASE_URL}/api/cashier/dashboard`,
  // Add other endpoints here
};
