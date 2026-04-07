import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { History, DollarSign, Trophy, Search, Phone, History as HistoryIcon, ArrowRightCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function UserHistory() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const formatPhoneNumber = (input: string): string => {
    return input.replace(/\D/g, '').substring(0, 9);
  };

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Enter a valid identifier");
      return;
    }
    setSearching(true);
    // Simulation
    setTimeout(() => {
      setSearchResults([]);
      setSearching(false);
      toast.info("No records found for this identifier");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-6 py-10 space-y-10 font-sans transition-all">
      
      {/* 🔍 HEADER */}
      <div className="flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <HistoryIcon size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Ledger</h1>
               <p className="text-slate-500 font-medium">Verify historical interactions and transaction flows.</p>
            </div>
         </div>
         <Button onClick={() => setPhoneNumber("")} variant="ghost" className="text-slate-400 font-bold hover:bg-slate-50">
            Reset Filter
         </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Search Filter Card */}
         <Card className="lg:col-span-1 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
               <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Search size={14} />
                  Identifier Probe
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Reference</Label>
                  <div className="relative flex items-center">
                     <Phone size={16} className="absolute left-4 z-10 text-slate-300" />
                     <span className="absolute left-10 text-slate-500 font-bold border-r border-slate-200 pr-2 z-10">+251</span>
                     <Input
                        placeholder="9xxxxxxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        className="h-14 w-full rounded-xl bg-slate-50 border-slate-200 pl-24 font-bold text-slate-900"
                     />
                  </div>
               </div>
               <Button 
                  onClick={handleSearch}
                  disabled={searching || !phoneNumber.trim()}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
               >
                  {searching ? "Scanning..." : "Query History"}
               </Button>
            </CardContent>
         </Card>

         {/* Results Feed */}
         <Card className="lg:col-span-2 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
               <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ArrowRightCircle size={14} />
                  Session Records
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-10 bg-slate-50 rounded-xl p-1 mb-8">
                     <TabsTrigger value="all" className="rounded-lg font-bold text-[10px] uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">All</TabsTrigger>
                     <TabsTrigger value="cash" className="rounded-lg font-bold text-[10px] uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Events</TabsTrigger>
                     <TabsTrigger value="logs" className="rounded-lg font-bold text-[10px] uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Login</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="outline-none">
                     <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mx-auto">
                           <History size={32} />
                        </div>
                        <div>
                           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active sessions found</p>
                           <p className="text-slate-300 text-[10px] font-bold uppercase mt-1">Initiate a probe to view results</p>
                        </div>
                     </div>
                  </TabsContent>
               </Tabs>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
