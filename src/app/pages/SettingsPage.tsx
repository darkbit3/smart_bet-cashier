import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { User, Shield, LogOut, ChevronRight, Settings } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function SettingsPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Cashier User";
  
  const handleSaveSettings = () => {
    toast.success("Preferences updated successfully");
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Session terminated");
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl space-y-10 font-sans">
      {/* ⚙️ HEADER */}
      <div className="flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <Settings size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Control</h1>
               <p className="text-slate-500 font-medium">Manage your personal settings and security protocols.</p>
            </div>
         </div>
         <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl px-6 h-12">
            <LogOut size={18} className="mr-2" />
            Terminate
         </Button>
      </div>

      <div className="grid gap-8">
        {/* Profile */}
        <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900 uppercase tracking-tight">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={18} />
               </div>
               Identity Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username Reference</Label>
                  <Input defaultValue={username} className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-bold text-slate-900" />
               </div>
               <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Phone</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-bold" />
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Territory</Label>
                  <Input placeholder="Global Support" className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-bold" />
               </div>
               <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Protocol</Label>
                  <Input defaultValue="Secure Web Access" disabled className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold text-slate-300" />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900 uppercase tracking-tight">
               <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Shield size={18} />
               </div>
               Access Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
               <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Update Password</Label>
               <Button onClick={() => navigate('/change-password')} variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-black flex justify-between px-6">
                  Re-initialize Security Credential
                  <ChevronRight size={18} className="text-slate-300" />
               </Button>
            </div>
            <Separator className="bg-slate-100" />
            <div className="flex items-center justify-between py-2">
               <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900 tracking-tight">Two-Factor Encryption (2FA)</p>
                  <p className="text-xs font-medium text-slate-500">Add an secondary layer of verification to your login.</p>
               </div>
               <Switch className="data-[state=checked]:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        {/* Sync */}
        <div className="flex flex-col items-center pt-10">
           <Button onClick={handleSaveSettings} className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
              Push Global Updates
           </Button>
           <p className="mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Version v1.2.5 • SmartBet Operational Core</p>
        </div>
      </div>
    </div>
  );
}
