import { toast } from 'sonner';

interface SessionInfo {
  deviceId: string;
  deviceName: string;
  loginTime: string;
  lastActivity: string;
  username: string;
  isActive: boolean;
}

class SessionManager {
  private static readonly STORAGE_KEY = 'cashier_sessions';
  
  // Get all active sessions
  static getAllSessions(): SessionInfo[] {
    try {
      const sessions = localStorage.getItem(this.STORAGE_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }
  
  // Get current active session
  static getCurrentSession(): SessionInfo | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.isActive) || null;
  }
  
  // Get all sessions for a specific user
  static getUserSessions(username: string): SessionInfo[] {
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.username === username);
  }
  
  // Check if user is already logged in on any device
  static isUserAlreadyLoggedIn(username: string): boolean {
    const sessions = this.getAllSessions();
    return sessions.some(session => session.username === username && session.isActive);
  }
  
  // Add new session
  static addSession(session: Omit<SessionInfo, 'isActive'>): void {
    const sessions = this.getAllSessions();
    
    // Deactivate all existing sessions for this user to allow the new login
    // without multiple simultaneous active sessions on the same browser
    const deactivatedSessions = sessions.map(s => 
      s.username === session.username ? { ...s, isActive: false } : s
    );
    
    // Add new session as active
    const newSession = { ...session, isActive: true };
    deactivatedSessions.push(newSession);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(deactivatedSessions));
  }
  
  // Close specific session
  static closeSession(deviceId: string): void {
    const sessions = this.getAllSessions();
    const updatedSessions = sessions.map(session => 
      session.deviceId === deviceId ? { ...session, isActive: false } : session
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSessions));
  }
  
  // Close all sessions except current
  static closeOtherSessions(currentDeviceId: string): void {
    const sessions = this.getAllSessions();
    const updatedSessions = sessions.map(session => 
      session.deviceId !== currentDeviceId ? { ...session, isActive: false } : session
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSessions));
  }
  
  // Close all sessions for a user
  static closeAllUserSessions(username: string): void {
    const sessions = this.getAllSessions();
    const updatedSessions = sessions.map(session => 
      session.username === username ? { ...session, isActive: false } : session
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSessions));
  }
  
  // Generate unique device ID
  static generateDeviceId(): string {
    return 'device_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }
  
  // Get device name from user agent
  static getDeviceName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android Phone';
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    return 'Unknown Device';
  }
  
  // Check if user is trying to login from new device
  static isNewDeviceLogin(currentDeviceId: string): boolean {
    const sessions = this.getAllSessions();
    return !sessions.some(session => session.deviceId === currentDeviceId);
  }
  
  // Show session warning message
  static showSessionWarning(oldDeviceName: string, newDeviceName: string): void {
    toast.warning(`Session transferred from "${oldDeviceName}" to "${newDeviceName}". Previous session closed.`, {
      duration: 6000,
      description: 'Only one active session is allowed per user. Contact support if this was not you.',
    });
  }
  
  // Show login conflict message
  static showLoginConflictMessage(username: string, existingDeviceName: string): void {
    toast.error(`"${username}" is already logged in on "${existingDeviceName}"`, {
      duration: 7000,
      description: 'Multiple simultaneous sessions are not allowed. Please log out from the other device first.',
    });
  }
  
  // Get active sessions count for user
  static getActiveSessionCount(username: string): number {
    const sessions = this.getAllSessions();
    return sessions.filter(s => s.username === username && s.isActive).length;
  }
  
  // Check if user has exceeded device limit
  static hasExceededDeviceLimit(username: string, maxDevices: number = 2): boolean {
    return this.getActiveSessionCount(username) >= maxDevices;
  }
  
  // Get all active sessions across all users
  static getAllActiveSessions(): SessionInfo[] {
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.isActive);
  }
  
  // Force logout all sessions for a user (emergency)
  static forceLogoutUser(username: string): void {
    this.closeAllUserSessions(username);
    toast.error(`All sessions for "${username}" have been terminated.`, {
      duration: 6000,
      description: 'This action was triggered by a security policy. Contact support if this was unexpected.',
    });
  }
}

export default SessionManager;
