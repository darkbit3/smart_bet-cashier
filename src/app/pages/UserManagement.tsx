import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Search, UserPlus, DollarSign, CreditCard, Users, RefreshCw, X, Check, Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/apiConfig";

interface Player {
  id: number;
  name: string;
  username: string;
  phoneNumber: string;
  balance: number;
  withdrawable: number;
  non_withdrawable: number;
  bonusBalance: number;
  status: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [cashierBalance, setCashierBalance] = useState<number>(0);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [newPlayer, setNewPlayer] = useState({
    username: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('cashier_token');
    const storedBalance = localStorage.getItem('balance');
    setCashierBalance(storedBalance ? parseFloat(storedBalance) : 5000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cashier/playerlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setUsers(data.data.players.map((p: any) => ({
          ...p,
          name: p.name || p.username,
          phoneNumber: p.phoneNumber || p.phone_number || ''
        })));
      }
    } catch (e) {
      console.error(e);
      // fallback
      setUsers([
        { id: 1, name: "Sample User", username: "sample", phoneNumber: "0911000000", balance: 500, withdrawable: 400, non_withdrawable: 100, bonusBalance: 0, status: "active" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPlayer = async () => {
    if (!newPlayer.username || !newPlayer.phoneNumber || !newPlayer.password) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('cashier_token');
      const response = await fetch(`${API_BASE_URL}/api/cashier/create/player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newPlayer.username,
          phoneNumber: `+251${newPlayer.phoneNumber}`,
          password: newPlayer.password
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to provision account. The username or phone number may already exist.");
      } else {
        toast.success("Player account provisioned successfully");
        setShowAddModal(false);
        setNewPlayer({ username: "", phoneNumber: "", password: "" });
        fetchData();
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    const amount = parseFloat(transactionAmount);
    if (!amount || amount <= 0) {
       toast.error("Invalid amount");
       return;
    }
    if (type === 'withdraw' && amount > (selectedUser?.withdrawable || 0)) {
       toast.error("Insufficient withdrawable balance");
       return;
    }
    if (type === 'deposit' && amount > cashierBalance) {
       toast.error("Insufficient terminal liquidity");
       return;
    }

    setSubmitting(true);
    // Simulation
    setTimeout(() => {
      const newBal = type === 'deposit' ? cashierBalance - amount : cashierBalance + amount;
      localStorage.setItem('balance', newBal.toString());
      setCashierBalance(newBal);
      toast.success(`${type === 'deposit' ? 'Refill' : 'Payout'} authorized: $${amount}`);
      setShowDepositModal(false);
      setShowWithdrawModal(false);
      setTransactionAmount("");
      setSubmitting(false);
      fetchData();
    }, 1200);
  };

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-6 py-10 space-y-10 font-sans">
      
      {/* 👤 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <Users size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Node Fleet</h1>
               <p className="text-slate-500 font-medium">Manage player access and terminal liquidity flow.</p>
            </div>
         </div>
         <div className="flex gap-3">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <Wallet size={16} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Available liquidity</p>
                  <p className="text-sm font-black text-slate-900">${cashierBalance.toFixed(2)}</p>
               </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-slate-100">
               <UserPlus size={18} className="mr-2" />
               New Node
            </Button>
         </div>
      </div>

      {/* SEARCH / TOOLBAR */}
      <div className="flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <Input 
              placeholder="Query by identifier or phone reference..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl bg-white border-slate-200 pl-12 font-medium shadow-soft focus:ring-2 focus:ring-indigo-100 transition-all"
            />
         </div>
         <Button variant="outline" onClick={fetchData} className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-0">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
         </Button>
      </div>

      {/* USER GRID */}
      {loading ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 rounded-[2.5rem] bg-slate-50 animate-pulse" />)}
         </div>
      ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(user => (
               <Card key={user.id} className="border-none shadow-soft rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-center">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">
                              {user.username.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <p className="font-black text-slate-900 tracking-tight">{user.username}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.phoneNumber}</p>
                           </div>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg border-none">ACTIVE</Badge>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Credit</p>
                           <p className="text-lg font-black text-slate-900">${user.balance.toFixed(0)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Claimable</p>
                           <p className="text-lg font-black text-emerald-600">${user.withdrawable.toFixed(0)}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                           onClick={() => { setSelectedUser(user); setShowDepositModal(true); }}
                           className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                           <ArrowUpRight size={16} /> Refill
                        </Button>
                        <Button 
                           onClick={() => { setSelectedUser(user); setShowWithdrawModal(true); }}
                           variant="outline"
                           className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl h-12 font-bold flex items-center justify-center gap-2"
                        >
                           <ArrowDownLeft size={16} /> Payout
                        </Button>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
      )}

      {/* ➕ ADD PLAYER MODAL */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden font-sans">
            <div className="bg-indigo-600 p-10 text-white relative h-32 flex items-center">
               <h2 className="text-2xl font-black tracking-tight">Provision New Node</h2>
               <div className="absolute -bottom-6 right-10 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-indigo-600">
                  <UserPlus size={32} />
               </div>
            </div>
            <div className="p-10 pt-16 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Access Identity</Label>
                  <Input 
                    value={newPlayer.username} 
                    onChange={(e) => setNewPlayer({...newPlayer, username: e.target.value})}
                    placeholder="Username" 
                    className="h-14 rounded-xl bg-slate-50 border-slate-200 focus:bg-white font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Reference</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 font-bold border-r border-transparent pr-2 z-10">+251</span>
                    <Input 
                      value={newPlayer.phoneNumber} 
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').substring(0, 9);
                        setNewPlayer({...newPlayer, phoneNumber: digits});
                      }}
                      placeholder="9xxxxxxxx" 
                      className="h-14 w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white font-bold pl-16 text-slate-900"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={newPlayer.password} 
                      onChange={(e) => setNewPlayer({...newPlayer, password: e.target.value})}
                      placeholder="••••••••" 
                      className="h-14 rounded-xl bg-slate-50 border-slate-200 focus:bg-white font-bold pr-12 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
               </div>
               <Button onClick={handleAddPlayer} disabled={submitting} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-100 transition-all mt-4">
                  {submitting ? "Initializing..." : "Register Account"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

      {/* 💸 DEPOSIT MODAL */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden font-sans">
            <div className="bg-emerald-500 p-10 text-white relative h-32 flex items-center">
               <h2 className="text-2xl font-black tracking-tight">Credit Refill</h2>
               <div className="absolute -bottom-6 right-10 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-emerald-500">
                  <ArrowUpRight size={32} />
               </div>
            </div>
            <div className="p-10 pt-16 space-y-6">
               <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{selectedUser?.username}</p>
                  <p className="text-xs font-bold text-slate-300">{selectedUser?.phoneNumber}</p>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount to Transfer</Label>
                  <Input 
                    type="number" 
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="0.00" 
                    className="h-16 rounded-xl bg-slate-50 border-slate-200 text-3xl font-black text-center focus:bg-white"
                  />
               </div>
               <Button onClick={() => handleTransaction('deposit')} disabled={submitting} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-100 transition-all">
                  {submitting ? "Authorizing..." : "Execute Refill"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

      {/* 💰 WITHDRAW MODAL */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden font-sans">
            <div className="bg-orange-500 p-10 text-white relative h-32 flex items-center">
               <h2 className="text-2xl font-black tracking-tight">Liquidity Payout</h2>
               <div className="absolute -bottom-6 right-10 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-orange-500">
                  <ArrowDownLeft size={32} />
               </div>
            </div>
            <div className="p-10 pt-16 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Max Claimable</p>
                     <p className="text-lg font-black text-emerald-600">${selectedUser?.withdrawable}</p>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Payout Amount</Label>
                  <Input 
                    type="number" 
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="0.00" 
                    className="h-16 rounded-xl bg-slate-50 border-slate-200 text-3xl font-black text-center focus:bg-white"
                  />
               </div>
               <Button onClick={() => handleTransaction('withdraw')} disabled={submitting} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-100 transition-all">
                  {submitting ? "Authorizing..." : "Execute Payout"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

    </div>
  );
}