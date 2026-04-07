import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  Download,
  RefreshCw,
  BarChart3,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  date: string;
  status: "completed" | "pending";
}

export default function CashierAnalysis() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashierBalance, setCashierBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    const storedBalance = localStorage.getItem('balance');
    if (storedBalance) setCashierBalance(parseFloat(storedBalance));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container mx-auto px-6 py-10 space-y-10 font-sans transition-all">
      
      {/* 📈 HEADER */}
      <div className="flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <BarChart3 size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
               <p className="text-slate-500 font-medium">Deep insights into terminal operations and flow.</p>
            </div>
         </div>
         <div className="flex gap-3">
            <Button variant="outline" onClick={loadData} className="h-12 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 px-6 font-bold">
               <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
               Sync
            </Button>
            <Button className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-12 px-6">
               <Download size={18} className="mr-2" />
               Raw Export
            </Button>
         </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Operations Credit", value: `$${cashierBalance.toFixed(2)}`, icon: <DollarSign size={16} />, color: "text-slate-900", bg: "bg-white" },
          { label: "Period Deposits", value: `$${totalDeposits.toFixed(2)}`, icon: <TrendingUp size={16} />, color: "text-emerald-600", bg: "bg-white" },
          { label: "Period Payouts", value: `$${totalWithdrawals.toFixed(2)}`, icon: <TrendingDown size={16} />, color: "text-orange-600", bg: "bg-white" },
          { label: "System Health", value: "Optimal", icon: <Activity size={16} />, color: "text-indigo-600", bg: "bg-white" },
        ].map((stat, i) => (
          <Card key={i} className={`border-none shadow-soft rounded-[2rem] overflow-hidden ${stat.bg}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {stat.icon}
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Live Feed Component */}
         <Card className="lg:col-span-2 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
               <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  Recent Terminal Events
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               {transactions.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No active records in cache</div>
               ) : (
                  <div className="space-y-4">
                     {transactions.slice(0, 5).map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {t.type === 'deposit' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900 capitalize">{t.type} Processed</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.date).toLocaleString()}</p>
                              </div>
                           </div>
                           <p className={`text-base font-black ${t.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}`}>
                              {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(2)}
                           </p>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Health Metric Side Card */}
         <Card className="border-none shadow-soft rounded-[2.5rem] bg-slate-900 text-white p-10 flex flex-col justify-between">
            <div>
               <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Network Integrity</h3>
               <div className="space-y-8">
                  <div>
                     <p className="text-4xl font-black">100%</p>
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Uptime Certified</p>
                  </div>
                  <div>
                     <p className="text-4xl font-black">0.2s</p>
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Average Latency</p>
                  </div>
               </div>
            </div>
            <div className="pt-10">
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
               </div>
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4 text-center">Protocol V4.2.1-SECURE</p>
            </div>
         </Card>
      </div>
    </div>
  );
}
