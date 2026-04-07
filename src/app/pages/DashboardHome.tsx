import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { DollarSign, ArrowDownToLine, TrendingUp, TrendingDown, Users, Trophy, RefreshCw, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchBalance = () => {
    setLoading(true);
    const stored = localStorage.getItem('balance');
    setBalance(stored ? parseFloat(stored) : 5000);
    const txs = localStorage.getItem('transactions');
    if (txs) setTransactions(JSON.parse(txs));
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();
    const handleUpdate = () => fetchBalance();
    window.addEventListener('balanceUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('balanceUpdated', handleUpdate as EventListener);
  }, []);

  const deposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
  const withdraws = transactions.filter(t => t.type === 'withdraw').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 font-sans transition-all">
      
      {/* 🚀 WELCOME SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 font-medium">Terminal performance and high-level operational statistics.</p>
         </div>
         <div className="flex gap-3">
            <Button onClick={() => navigate('/transactions')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-indigo-100 flex items-center gap-2">
               <Zap size={18} /> Quick Action
            </Button>
            <Button variant="outline" onClick={fetchBalance} className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 p-0">
               <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </Button>
         </div>
      </div>

      {/* 📊 KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Available Credit", value: `$${balance.toFixed(2)}`, icon: <DollarSign size={16} />, color: "text-slate-900", sub: "Operational balance" },
          { label: "Period Deposits", value: `$${deposits.toFixed(2)}`, icon: <TrendingUp size={16} />, color: "text-emerald-600", sub: "Total credit inflow" },
          { label: "Period Payouts", value: `$${withdraws.toFixed(2)}`, icon: <TrendingDown size={16} />, color: "text-orange-600", sub: "Total credit outflow" },
          { label: "Nodes Active", value: "1,234", icon: <Users size={16} />, color: "text-indigo-600", sub: "Connected accounts" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-soft rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  {stat.icon} {stat.label}
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
               <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* QUICK ACTIONS CARD */}
         <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
               <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <ArrowDownToLine size={16} className="text-emerald-500" />
                  Terminal Shortcuts
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/transactions?action=deposit&amount=500")}
                    className="h-20 rounded-[2rem] border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                     <p className="text-xs font-black text-slate-400 uppercase group-hover:text-indigo-600 transition-colors">Deposit</p>
                     <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">$500</p>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/transactions?action=deposit&amount=1000")}
                    className="h-20 rounded-[2rem] border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                     <p className="text-xs font-black text-slate-400 uppercase group-hover:text-indigo-600 transition-colors">Deposit</p>
                     <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">$1000</p>
                  </Button>
               </div>
               <Button onClick={() => navigate('/transactions')} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center gap-2">
                  Comprehensive Ledger Access <ArrowRight size={18} />
               </Button>
            </CardContent>
         </Card>

         {/* RECENT FEED CARD */}
         <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row justify-between items-center">
               <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" />
                  Activity Stream
               </CardTitle>
               <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg flex items-center gap-1 border border-emerald-100"><ShieldCheck size={10}/> Authenticated</span>
            </CardHeader>
            <CardContent className="p-8">
               {transactions.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">Waiting for initial terminal flow...</div>
               ) : (
                  <div className="space-y-4">
                     {transactions.slice(0, 4).map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                           <div className="flex gap-4 items-center">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {t.type === 'deposit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-900 capitalize">{t.type} Authorized</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.date).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <p className={`font-black ${t.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}`}>
                              {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(0)}
                           </p>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
