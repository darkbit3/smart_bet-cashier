import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown, RefreshCw, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";


interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  date: string;
  status: "completed" | "pending";
  playerName?: string;
  phoneNumber?: string;
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [form, setForm] = useState({ phone: "", amount: "" });

  const fetchTransactions = () => {
    setLoading(true);
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored).map((t: any) => ({
        ...t,
        type: t.type || t.transaction_type // compatibility
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAction = (type: 'deposit' | 'withdraw') => {
    if (!form.phone || !form.amount) {
       toast.error("Please provide all interaction details");
       return;
    }
    setLoading(true);
    setTimeout(() => {
       const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          amount: parseFloat(form.amount),
          date: new Date().toISOString(),
          status: 'completed',
          phoneNumber: form.phone
       };
       const updated = [newTx, ...transactions];
       localStorage.setItem('transactions', JSON.stringify(updated));
       setTransactions(updated);
       
       const bal = parseFloat(localStorage.getItem('balance') || '5000');
       const newBal = type === 'deposit' ? bal - newTx.amount : bal + newTx.amount;
       localStorage.setItem('balance', newBal.toString());
       window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { newBalance: newBal } }));

       toast.success(`${type === 'deposit' ? 'Refill' : 'Payout'} successful`);
       setShowDepositModal(false);
       setShowWithdrawModal(false);
       setForm({ phone: "", amount: "" });
       setLoading(false);
    }, 1000);
  };

  const filtered = transactions.filter(t => activeTab === 'all' || t.type === activeTab);

  return (
    <div className="container mx-auto px-6 py-10 space-y-10 font-sans">
      
      {/* 💸 HEADER */}
      <div className="flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <FileSpreadsheet size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transaction Ledger</h1>
               <p className="text-slate-500 font-medium">Authoritative record of all terminal credit flows.</p>
            </div>
         </div>
         <div className="flex gap-3">
            <Button onClick={() => setShowDepositModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-emerald-100 transition-all">
               <ArrowDownToLine size={18} className="mr-2" />
               New Deposit
            </Button>
            <Button onClick={() => setShowWithdrawModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-orange-100 transition-all">
               <ArrowUpFromLine size={18} className="mr-2" />
               New Payout
            </Button>
         </div>
      </div>

      <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
         <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
               <TrendingUp size={16} className="text-indigo-600" />
               Real-time Flow Feed
            </CardTitle>
            <Button variant="ghost" onClick={fetchTransactions} className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
               <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
         </CardHeader>
         <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-50 rounded-xl p-1 mb-8">
                  <TabsTrigger value="all" className="rounded-lg font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:text-indigo-600">Global</TabsTrigger>
                  <TabsTrigger value="deposit" className="rounded-lg font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:text-emerald-600">Deposits</TabsTrigger>
                  <TabsTrigger value="withdraw" className="rounded-lg font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:text-orange-600">Withdrawals</TabsTrigger>
               </TabsList>

               <div className="space-y-4">
                  {filtered.length === 0 ? (
                     <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No records found for active filter</div>
                  ) : (
                     filtered.map((t) => (
                        <div key={t.id} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-soft transition-all flex items-center justify-between">
                           <div className="flex gap-4 items-center">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {t.type === 'deposit' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                              </div>
                              <div>
                                 <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{t.type === 'deposit' ? 'Refill' : 'Payout'}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.phoneNumber} • {new Date(t.date).toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={`text-xl font-black ${t.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                 {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(2)}
                              </p>
                              <Badge className="bg-white border-slate-100 text-slate-400 text-[8px] font-black uppercase rounded-md shadow-none">VERIFIED</Badge>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </Tabs>
         </CardContent>
      </Card>

      {/* TRANSACTION MODALS */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden font-sans">
            <div className="bg-emerald-600 p-10 text-white relative h-32 flex items-center">
               <h2 className="text-2xl font-black tracking-tight">Initiate Refill</h2>
               <div className="absolute -bottom-6 right-10 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-emerald-600">
                  <ArrowDownToLine size={32} />
               </div>
            </div>
            <div className="p-10 pt-16 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Reference</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 font-bold border-r border-transparent pr-2 z-10">+251</span>
                    <Input 
                      value={form.phone} 
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').substring(0, 9);
                        setForm({...form, phone: digits});
                      }} 
                      placeholder="9xxxxxxxx" 
                      className="h-14 w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white font-bold pl-16 text-slate-900"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount</Label>
                  <Input 
                    type="number" 
                    value={form.amount} 
                    onChange={(e) => setForm({...form, amount: e.target.value})} 
                    placeholder="0.00" 
                    className="h-16 rounded-xl bg-slate-50 border-slate-200 text-3xl font-black text-center focus:bg-white"
                  />
               </div>
               <Button onClick={() => handleAction('deposit')} disabled={loading} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-100 transition-all mt-4">
                  {loading ? "Processing..." : "Confirm Deposit"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden font-sans">
            <div className="bg-orange-600 p-10 text-white relative h-32 flex items-center">
               <h2 className="text-2xl font-black tracking-tight">Initiate Payout</h2>
               <div className="absolute -bottom-6 right-10 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-orange-600">
                  <ArrowUpFromLine size={32} />
               </div>
            </div>
            <div className="p-10 pt-16 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Reference</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 font-bold border-r border-transparent pr-2 z-10">+251</span>
                    <Input 
                      value={form.phone} 
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').substring(0, 9);
                        setForm({...form, phone: digits});
                      }} 
                      placeholder="9xxxxxxxx" 
                      className="h-14 w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white font-bold pl-16 text-slate-900"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount</Label>
                  <Input 
                    type="number" 
                    value={form.amount} 
                    onChange={(e) => setForm({...form, amount: e.target.value})} 
                    placeholder="0.00" 
                    className="h-16 rounded-xl bg-slate-50 border-slate-200 text-3xl font-black text-center focus:bg-white"
                  />
               </div>
               <Button onClick={() => handleAction('withdraw')} disabled={loading} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-100 transition-all mt-4">
                  {loading ? "Processing..." : "Confirm Payout"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

    </div>
  );
}