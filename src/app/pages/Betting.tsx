import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Trophy, Clock, History, Calendar, CheckCircle, XCircle, ChevronRight, DollarSign } from "lucide-react";
import { toast } from "sonner";

const mockBets = [
  {
    id: 1,
    event: "Manchester United vs Liverpool",
    type: "Football",
    odds: "2.5",
    amount: 100,
    status: "pending",
    date: "2026-03-25 15:00",
  },
  {
    id: 2,
    event: "Lakers vs Warriors",
    type: "Basketball",
    odds: "1.8",
    amount: 250,
    status: "won",
    date: "2026-03-24 20:00",
  },
  {
    id: 3,
    event: "Nadal vs Djokovic",
    type: "Tennis",
    odds: "3.2",
    amount: 50,
    status: "lost",
    date: "2026-03-23 14:00",
  },
];

export default function Betting() {
  const [betAmount, setBetAmount] = useState("");
  const [selectedOdds, setSelectedOdds] = useState("");
  const [isBettingEnabled, setIsBettingEnabled] = useState(false);

  const upcomingBets = mockBets.filter((bet) => bet.status === 'pending');
  const recentBets = mockBets.filter((bet) => bet.status !== 'pending');

  const handlePlaceBet = () => {
    if (!isBettingEnabled) {
      toast.error("Betting is currently unavailable. Upcoming event mode is active.");
      return;
    }

    if (!betAmount || !selectedOdds) {
      toast.error("Please enter bet amount and select odds");
      return;
    }

    const amount = parseFloat(betAmount);
    const balance = parseFloat(localStorage.getItem("balance") || "0");

    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    const newBalance = balance - amount;
    localStorage.setItem("balance", newBalance.toString());
    window.dispatchEvent(new Event("balanceUpdate"));

    toast.success(`Bet placed: $${amount} at odds ${selectedOdds}`);
    setBetAmount("");
    setSelectedOdds("");
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 font-sans transition-all">
      {/* 🔮 UPCOMING HEADER PILL */}
      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-soft flex items-center justify-between overflow-hidden relative group">
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
               <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Upcoming Feed</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Invoices (Paused)</h1>
            <p className="mt-2 text-slate-500 font-medium max-w-lg">Viewing upcoming events only. Betting systems are temporarily restricted to read-only mode.</p>
         </div>
         <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
         <Calendar size={120} className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-indigo-500 opacity-[0.05] group-hover:rotate-12 transition-transform duration-500" />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 🎫 PLACEMENT SECTION */}
        <Card className="lg:col-span-4 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
            <CardTitle className="flex items-center gap-3 text-lg font-black tracking-tight text-slate-900 uppercase">
              <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                 <Trophy size={18} />
              </div>
              Place New Bet
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Event</Label>
              <Input placeholder="Search upcoming markets..." className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium" />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Market Odds</Label>
              <div className="grid grid-cols-3 gap-3">
                {["1.5", "2.0", "3.5"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedOdds(val)}
                    disabled={!isBettingEnabled}
                    className={`h-12 rounded-xl border-2 font-black text-sm transition-all ${
                       selectedOdds === val 
                         ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                         : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Wager Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="h-14 font-black text-xl rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {betAmount && selectedOdds && (
               <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Return Value</p>
                     <p className="text-2xl font-black text-emerald-600">
                        ${(parseFloat(betAmount) * parseFloat(selectedOdds)).toFixed(2)}
                     </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                     <DollarSign size={20} />
                  </div>
               </div>
            )}

            <Button
              onClick={handlePlaceBet}
              disabled={!isBettingEnabled}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4"
            >
              Sign Transaction
            </Button>
          </CardContent>
        </Card>

        {/* 📚 FEED SECTION */}
        <Card className="lg:col-span-8 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-black tracking-tight text-slate-900 uppercase">
               <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock size={18} />
               </div>
               Live Order Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {/* Upcoming Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                 <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Awaiting Kick-off</h3>
                 <span className="text-[10px] font-bold text-slate-300 uppercase">{upcomingBets.length} Events</span>
              </div>
              <div className="space-y-3">
                 {upcomingBets.length === 0 ? (
                   <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <p className="text-slate-400 text-sm font-medium">No live markets currently polled.</p>
                   </div>
                 ) : (
                    upcomingBets.map((bet) => (
                       <div key={`up-${bet.id}`} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-between">
                          <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 transition-colors">
                                <History size={20} />
                             </div>
                             <div>
                                <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{bet.event}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                   {bet.type} • {bet.date} • Odds: {bet.odds}
                                </p>
                             </div>
                          </div>
                          <ChevronRight size={20} className="text-slate-200 group-hover:translate-x-1 transition-all" />
                       </div>
                    ))
                 )}
              </div>
            </div>

            {/* History Feed */}
            <div className="space-y-4 pt-4 pt-8 border-t border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session History</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  {recentBets.map((bet) => (
                    <div key={bet.id} className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-soft transition-all">
                       <div className="flex items-center justify-between mb-4">
                          <Badge 
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                               bet.status === "won" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                             {bet.status === "won" ? <CheckCircle size={10} className="mr-1 inline" /> : <XCircle size={10} className="mr-1 inline" />}
                             {bet.status}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{bet.date.split(' ')[0]}</span>
                       </div>

                       <h4 className="font-bold text-slate-900 tracking-tight mb-4">{bet.event}</h4>

                       <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[8px] font-bold text-slate-400 uppercase">Odds</p>
                             <p className="text-sm font-black text-slate-600">{bet.odds}</p>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[8px] font-bold text-slate-400 uppercase">Wager</p>
                             <p className="text-sm font-black text-slate-600">${bet.amount}</p>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[8px] font-bold text-slate-400 uppercase text-emerald-500">Net</p>
                             <p className="text-sm font-black text-emerald-600">${(bet.amount * parseFloat(bet.odds)).toFixed(0)}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
