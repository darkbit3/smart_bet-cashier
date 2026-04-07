import { toast } from 'sonner';
import SessionManager from './sessionManager';

export const logoutUser = () => {
  // Get current session info
  const currentSession = SessionManager.getCurrentSession();
  const currentDeviceName = SessionManager.getDeviceName();
  
  // Clear all localStorage data
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("cashier_token");
  localStorage.removeItem("cashier_user");
  localStorage.removeItem("username");
  localStorage.removeItem("balance");
  
  // Close current session
  if (currentSession) {
    SessionManager.closeSession(currentSession.deviceId);
  }
  
  // Show toast instead of alert
  toast.success(`Signed out from ${currentDeviceName}`, {
    description: 'Your session has been closed securely.',
    duration: 3000,
  });
  
  // Redirect to login page after brief delay so toast is visible
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};


export const getCurrentDeviceInfo = () => {
  return {
    deviceId: SessionManager.generateDeviceId(),
    deviceName: SessionManager.getDeviceName(),
    currentSession: SessionManager.getCurrentSession()
  };
};

export const checkSessionValidity = () => {
  const currentSession = SessionManager.getCurrentSession();
  if (!currentSession) return false;
  
  // Check if session is still valid (you can add time-based checks here)
  const sessionAge = Date.now() - new Date(currentSession.loginTime).getTime();
  const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (sessionAge > maxSessionAge) {
    SessionManager.closeSession(currentSession.deviceId);
    return false;
  }
  
  return true;
};
