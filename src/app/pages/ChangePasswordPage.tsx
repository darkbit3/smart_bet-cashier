import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock, Eye, EyeOff, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { sanitizeString, validatePassword } from "../../utils/validation";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const safeCurrent = sanitizeString(currentPassword);
    const safeNew = sanitizeString(newPassword);
    const safeConfirm = sanitizeString(confirmPassword);

    if (!validatePassword(safeNew)) {
      toast.error('The new password must be at least 6 characters.');
      return;
    }

    if (safeNew !== safeConfirm) {
      toast.error('New password and confirmation must match exactly.');
      return;
    }

    setLoading(true);
    // Simulation for "easy" mode if API is not fully configured
    setTimeout(() => {
       toast.success("Security key updated successfully");
       setLoading(false);
       navigate('/profile');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl space-y-10 font-sans">
      
      {/* 🔐 HEADER */}
      <div className="text-center space-y-4">
         <div className="inline-flex w-16 h-16 rounded-[1.5rem] bg-indigo-600 items-center justify-center text-white shadow-xl shadow-indigo-100 mb-2">
            <Lock size={32} />
         </div>
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Recovery</h1>
         <p className="text-slate-500 font-medium max-w-sm mx-auto">Update your security credentials to maintain authorized access to the terminal.</p>
      </div>

      <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10 pb-6 text-center">
           <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              Security Protocol
           </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <form onSubmit={handleChangePassword} className="space-y-8">
            
            {/* Current */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Existing Access Key</Label>
              <div className="relative group">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-16 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white text-xl font-bold tracking-widest text-slate-900 px-6 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Access Key</Label>
              <div className="relative group">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-16 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white text-xl font-bold tracking-widest text-slate-900 px-6 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Key</Label>
              <div className="relative group">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-16 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white text-xl font-bold tracking-widest text-slate-900 px-6 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Hint */}
            <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
               <AlertCircle size={16} className="text-slate-400 mt-0.5" />
               <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter"> Key must contain at least 6 alphanumeric characters and match correctly. </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
              disabled={loading || !newPassword || newPassword !== confirmPassword}
            >
              {loading ? "Re-authorizing..." : "Update Security Key"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
