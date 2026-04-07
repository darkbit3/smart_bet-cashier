import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DollarSign, ArrowDownToLine, ArrowUpFromLine, Receipt, User, LogOut, TrendingUp, TrendingDown, RefreshCw, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";


interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  date: string;
  status: "completed" | "pending";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [realBalance, setRealBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchRealBalance = () => {
    const stored = localStorage.getItem('balance');
    setRealBalance(stored ? parseFloat(stored) : 5000);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedTransactions = localStorage.getItem("transactions");
    if (storedUsername) setUsername(storedUsername);
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    fetchRealBalance();
  }, []);

  useEffect(() => {
    const handleBalanceUpdate = () => fetchRealBalance();
    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
  }, []);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const newBalance = realBalance + amount;
    setRealBalance(newBalance);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "deposit",
      amount: amount,
      date: new Date().toISOString(),
      status: "completed",
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success(`Deposited $${amount.toFixed(2)} successfully!`);
    setDepositAmount("");
    setShowDepositModal(false);
    setTimeout(() => fetchRealBalance(), 1000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > realBalance) {
      toast.error("Insufficient balance");
      return;
    }
    const newBalance = realBalance - amount;
    setRealBalance(newBalance);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "withdraw",
      amount: amount,
      date: new Date().toISOString(),
      status: "completed",
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success(`Withdrawn $${amount.toFixed(2)} successfully!`);
    setWithdrawAmount("");
    setShowWithdrawModal(false);
    setTimeout(() => fetchRealBalance(), 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {/* 🧭 NAVIGATION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                <LayoutDashboard className="text-white" size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">SmartBet</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cashier Dashboard</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Desktop Balance Pill */}
             <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 pl-4 pr-2 py-1.5 rounded-2xl">
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Balance</span>
                   <span className="text-sm font-bold text-slate-900 leading-none">
                      {balanceLoading ? "..." : `$${realBalance.toFixed(2)}`}
                   </span>
                </div>
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="w-8 h-8 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                   onClick={fetchRealBalance}
                   disabled={balanceLoading}
                >
                   <RefreshCw size={14} className={balanceLoading ? "animate-spin" : ""} />
                </Button>
             </div>

             <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

             {/* Action Group */}
             <div className="flex items-center gap-2">
                <Button onClick={() => setShowDepositModal(true)} variant="default" className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 rounded-xl px-4">
                   <ArrowDownToLine size={16} className="mr-2" />
                   <span className="hidden sm:inline">Deposit</span>
                </Button>
                <Button onClick={() => setShowWithdrawModal(true)} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl px-4">
                   <ArrowUpFromLine size={16} className="mr-2 text-indigo-600" />
                   <span className="hidden sm:inline">Withdraw</span>
                </Button>
             </div>

             {/* Profile */}
             <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
             >
                <Avatar className="h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm">
                   <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs uppercase">
                      {username.charAt(0)}
                   </AvatarFallback>
                </Avatar>
             </button>
          </div>
        </div>
      </header>

      {/* 🚀 MAIN CONTENT */}
      <main className="container mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
           <h2 className="text-2xl font-bold text-slate-900">Welcome back, {username}!</h2>
           <p className="text-slate-500 font-medium">Manage your cashier operations and transactions.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Main Balance Card */}
          <Card className="border-none shadow-soft overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <DollarSign size={120} className="text-slate-900" />
            </div>
            <CardHeader className="relative">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Current Operations Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pb-10">
              <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-black text-slate-900">
                    {balanceLoading ? "..." : realBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
                 <span className="text-xl font-bold text-slate-300">USD</span>
              </div>
              <div className="mt-8 flex items-center gap-2">
                 <Button variant="link" onClick={fetchRealBalance} className="p-0 h-auto text-indigo-600 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <RefreshCw size={12} />
                    Sync with Server
                 </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Insights Card */}
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Receipt size={16} />
                 Recent Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="py-6 text-center">
                   <p className="text-slate-400 text-sm font-medium">No activity reported yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === "deposit" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                           {transaction.type === "deposit" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-700 capitalize">{transaction.type}</p>
                           <p className="text-[10px] font-bold text-slate-400">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-black ${transaction.type === "deposit" ? "text-emerald-600" : "text-orange-600"}`}>
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info Card */}
          <Card className="border-none shadow-soft bg-indigo-600 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Receipt size={140} />
             </div>
             <CardHeader className="relative">
                <CardTitle className="text-xs font-bold text-white/60 uppercase tracking-widest">Global Overview</CardTitle>
             </CardHeader>
             <CardContent className="relative pb-10">
                <div className="space-y-6">
                   <div>
                      <p className="text-3xl font-black">{transactions.length}</p>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Processed Invoices</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <Button onClick={() => setShowTransactionsModal(true)} variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-slate-100 font-bold rounded-xl border-none">
                         View Ledger
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </main>

      {/* 🪟 MODALS */}
      
      {/* Deposit */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Deposit Operations</DialogTitle>
            <DialogDescription className="font-medium">Enter the amount to credit to the operational balance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-8 mt-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Funding Amount</Label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                 <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="h-16 pl-10 text-2xl font-black bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 placeholder:text-slate-200"
                    placeholder="0.00"
                 />
              </div>
            </div>
            <div className="flex gap-2">
              {["100", "500", "1000"].map(val => (
                <button key={val} onClick={() => setDepositAmount(val)} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 hover:border-indigo-500 transition-all text-slate-600 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600">
                  ${val}
                </button>
              ))}
            </div>
            <Button onClick={handleDeposit} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
              Finalize Deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Withdrawal Operations</DialogTitle>
            <DialogDescription className="font-medium">Enter the amount to debit from the operational balance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-8 mt-6">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Available Credit</p>
                  <p className="text-xl font-black text-orange-600">${realBalance.toFixed(2)}</p>
               </div>
               <div className={`w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center text-orange-600 ${balanceLoading ? "animate-spin" : ""}`}>
                  <RefreshCw size={14} />
               </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Withdraw Amount</Label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                 <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="h-16 pl-10 text-2xl font-black bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 placeholder:text-slate-200"
                    placeholder="0.00"
                 />
              </div>
            </div>
            <Button onClick={handleWithdraw} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg shadow-slate-100 transition-all active:scale-[0.98]">
              Confirm Withdrawal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ledger / Transactions */}
      <Dialog open={showTransactionsModal} onOpenChange={setShowTransactionsModal}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-8 pb-0">
             <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Ledger Operations</DialogTitle>
             <DialogDescription className="font-medium mt-1">Detailed history of all operational events.</DialogDescription>
          </div>
          <Tabs defaultValue="all" className="w-full mt-6">
            <div className="px-8 mb-6">
               <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-50 rounded-xl p-1">
                 <TabsTrigger value="all" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">All</TabsTrigger>
                 <TabsTrigger value="deposits" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Deposits</TabsTrigger>
                 <TabsTrigger value="withdrawals" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Withdrawals</TabsTrigger>
               </TabsList>
            </div>
            <div className="px-8 pb-8">
               <TabsContent value="all" className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar outline-none">
                 {transactions.length === 0 ? (
                   <p className="text-center text-slate-400 py-12 font-medium">No records found.</p>
                 ) : (
                   transactions.map((t) => (
                     <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                       <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === "deposit" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                           {t.type === "deposit" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-slate-800 capitalize leading-none mb-1">{t.type}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                             {new Date(t.date).toLocaleString()}
                           </p>
                         </div>
                       </div>
                       <p className={`text-base font-black ${t.type === "deposit" ? "text-emerald-600" : "text-orange-600"}`}>
                         {t.type === "deposit" ? "+" : "-"}${t.amount.toFixed(2)}
                       </p>
                     </div>
                   ))
                 )}
               </TabsContent>
               {/* Simplified Tab Contents for brevity, same structure as above */}
               <TabsContent value="deposits" className="space-y-3 max-h-[400px] overflow-y-auto pr-2 outline-none">
                  {transactions.filter(t => t.type === "deposit").map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                               <TrendingUp size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800 capitalize leading-none mb-1">Deposit</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <p className="text-base font-black text-emerald-600">+${t.amount.toFixed(2)}</p>
                      </div>
                  ))}
               </TabsContent>
               <TabsContent value="withdrawals" className="space-y-3 max-h-[400px] overflow-y-auto pr-2 outline-none">
                  {transactions.filter(t => t.type === "withdraw").map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                               <TrendingDown size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800 capitalize leading-none mb-1">Withdrawal</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <p className="text-base font-black text-orange-600">-${t.amount.toFixed(2)}</p>
                      </div>
                  ))}
               </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Profile */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 max-w-sm">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
               <Avatar className="h-24 w-24 rounded-[2rem] border border-slate-200">
                 <AvatarFallback className="bg-indigo-50 text-indigo-600 text-3xl font-black">
                   {username.charAt(0).toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
               </div>
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{username}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Cashier</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-600">Active</p>
               </div>
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Access</p>
                  <p className="text-sm font-bold text-indigo-600">Full</p>
               </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="w-full h-14 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-2xl mt-4">
              <LogOut size={18} className="mr-2" />
              Terminate Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}