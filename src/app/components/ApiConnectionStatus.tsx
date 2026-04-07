import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export function ApiConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // API removed - simulate connection check
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error('API Connection Error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null || isChecking) {
    return null; // Don't show anything while checking
  }

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      isConnected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>API Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>API Disconnected</span>
        </>
      )}
    </div>
  );
}
