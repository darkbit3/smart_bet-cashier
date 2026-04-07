import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, DollarSign, LogOut, Key, ShieldCheck, Activity } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CashierProfile {
  id: number;
  username: string;
  number_of_players: number;
  balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CashierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const username = localStorage.getItem('username') || 'Cashier';
    const balance = parseFloat(localStorage.getItem('balance') || '5000');
    
    // Simulate fetching from local if API fails
    setProfile({
      id: 1,
      username,
      number_of_players: 12, // mock
      balance,
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Signed out");
    navigate("/login");
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-300">Synchronizing...</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl space-y-10 font-sans">
      {/* 👤 HEADER */}
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100">
         <div className="flex gap-6 items-center">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-black shadow-inner">
               {profile?.username.charAt(0).toUpperCase()}
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile?.username}</h1>
               <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-md flex items-center gap-1">
                     <ShieldCheck size={10} /> {profile?.status}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md">ID: #{profile?.id}039</span>
               </div>
            </div>
         </div>
         <Button onClick={handleLogout} variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl pr-6">
            <LogOut size={18} className="mr-2" />
            Sign Out
         </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Core Stats */}
        <Card className="md:col-span-1 border-none shadow-soft rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity size={100} />
           </div>
           <CardHeader>
              <CardTitle className="text-xs font-black text-white/60 uppercase tracking-widest">Available liquidity</CardTitle>
           </CardHeader>
           <CardContent className="pb-10">
              <p className="text-4xl font-black leading-none">${profile?.balance.toFixed(2)}</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 flex items-center gap-2">
                 <DollarSign size={12} /> Real-time USD Balance
              </p>
           </CardContent>
        </Card>

        {/* Detailed Info */}
        <Card className="md:col-span-2 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
           <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Identity Details</CardTitle>
           </CardHeader>
           <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Role</p>
                    <p className="text-base font-bold text-slate-700">Operational Cashier</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Players</p>
                    <p className="text-base font-bold text-slate-700">{profile?.number_of_players} Managed Accounts</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Start</p>
                    <p className="text-base font-bold text-slate-700">{profile ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Key Access</p>
                    <p className="text-base font-bold text-emerald-600">Enabled</p>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex gap-4">
                 <Button onClick={() => navigate('/change-password')} variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 font-bold bg-slate-50 hover:bg-slate-100">
                    <Key size={16} className="mr-2" />
                    Reset Access Key
                 </Button>
                 <Button onClick={() => navigate('/settings')} variant="ghost" className="flex-1 h-12 rounded-xl font-bold text-indigo-600 hover:bg-indigo-50">
                    Account Preferences
                 </Button>
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
