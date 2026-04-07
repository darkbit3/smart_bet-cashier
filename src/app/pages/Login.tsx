import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ButtonLoading } from "../../components/Loading";
import { ApiConnectionStatus } from "../components/ApiConnectionStatus";
import { useFormRateLimiter } from "../../utils/useFormRateLimiter";
import { sanitizeString } from "../../utils/validation";
import SessionManager from "../../utils/sessionManager";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    isLocked,
    isSubmitting,
    trySubmit,
  } = useFormRateLimiter({ maxAttempts: 5, lockoutMinutes: 5, cooldownSeconds: 2 });

  useEffect(() => {
    // Guard: only redirect if BOTH a session exists AND isLoggedIn is set.
    // Checking only SessionManager can cause a loop when the session is stale
    // (SessionManager has data but ProtectedRoute sees isLoggedIn=null → redirects back to /login).
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentSession = SessionManager.getCurrentSession();
    if (isLoggedIn && currentSession) {
      navigate("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Too many attempts. Please try again later.");
      return;
    }

    try {
      await trySubmit(async () => {
        const sanitizedUsername = sanitizeString(username);
        const sanitizedPassword = sanitizeString(password);
        if (!sanitizedUsername || !sanitizedPassword) throw new Error("Please enter both username and password.");
        

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cashier/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword })
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Invalid username or password.');

        SessionManager.addSession({
          deviceId: SessionManager.generateDeviceId(),
          deviceName: SessionManager.getDeviceName(),
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          username: sanitizedUsername,
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("cashier_token", data.data.token);
        localStorage.setItem("cashier_user", JSON.stringify(data.data.cashier));
        localStorage.setItem("username", data.data.cashier.username);
        localStorage.setItem("balance", data.data.cashier.balance.toString());

        toast.success(`Welcome back, ${data.data.cashier.username}!`);
        setTimeout(() => navigate("/"), 800);
      });
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] font-sans selection:bg-indigo-100">
      <ApiConnectionStatus />
      
      {/* 🌀 SOFT AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[140px] opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
         
         {/* Simple Header */}
         <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
               Smart<span className="text-indigo-600">Betting</span>
            </h1>
            <p className="mt-2 text-slate-500 font-medium">Please sign in to your account</p>
         </div>

         {/* Clean Login Card */}
         <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50">
            
            <form onSubmit={handleLogin} className="space-y-6">
               
               {/* Username Field */}
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                     </div>
                     <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                        required
                     />
                  </div>
               </div>

               {/* Password Field */}
               <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                     <label className="text-sm font-semibold text-slate-700">Password</label>
                  </div>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                     </div>
                     <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>

               {/* Login Button */}
               <button 
                  type="submit" 
                  disabled={isSubmitting || isLocked}
                  className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
               >
                  {isSubmitting ? (
                     <ButtonLoading size="sm" />
                  ) : (
                     <>
                        <span>Sign In</span>
                        <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                     </>
                  )}
               </button>
            </form>

         </div>

         {/* Light Decorative Element */}
         <p className="mt-8 text-center text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} Smart Betting System. All rights reserved.
         </p>
      </div>

      <style>{`
        body {
          margin: 0;
          background-color: #f8fafc;
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}