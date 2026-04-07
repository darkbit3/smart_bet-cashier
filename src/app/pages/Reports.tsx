import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, BarChart3, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Reports() {
  return (
    <div className="container mx-auto px-6 py-10 space-y-10 font-sans">
      
      {/* 📊 HEADER */}
      <div className="flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <BarChart3 size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
               <p className="text-slate-500 font-medium">Export and review terminal operational data.</p>
            </div>
         </div>
         <Button className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-slate-100 transition-all active:scale-[0.98]">
           <Download size={18} className="mr-2" />
           Master Export
         </Button>
      </div>

      {/* Summary Chips */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Gross Revenue", value: "$45,231.89", color: "text-emerald-600", icon: <DollarSign size={16} />, trend: "+20.1%" },
          { label: "Total Deposits", value: "$52,340.00", color: "text-indigo-600", icon: <TrendingUp size={16} />, trend: "+15.2%" },
          { label: "Total Payouts", value: "$28,450.00", color: "text-orange-600", icon: <TrendingDown size={16} />, trend: "-4.8%" },
          { label: "Active Nodes", value: "1,234", color: "text-slate-900", icon: <Users size={16} />, trend: "+12.1%" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-soft rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {stat.icon}
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
              <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">
                 <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}>{stat.trend}</span> vs previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Ledger Section */}
      <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
           <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-indigo-600" />
              Generated Ledger Documents
           </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-slate-50 rounded-xl p-1 mb-8">
              <TabsTrigger value="daily" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="rounded-lg font-bold text-xs uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600">Yearly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4 outline-none">
              {[
                { title: "Daily Operational Audit", desc: "Full breakdown of today's financial events." },
                { title: "User Interaction Log", desc: "Detailed report of node connectivity today." }
              ].map((report, i) => (
                 <div key={i} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all flex items-center justify-between">
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{report.title}</h3>
                       <p className="text-sm font-medium text-slate-400">{report.desc}</p>
                    </div>
                    <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-0">
                       <Download size={20} />
                    </Button>
                 </div>
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="outline-none">
               <div className="p-12 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem]">
                  <p className="text-slate-300 font-bold text-sm uppercase tracking-widest">Generating weekly rollup...</p>
               </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="outline-none">
               <div className="p-12 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem]">
                  <p className="text-slate-300 font-bold text-sm uppercase tracking-widest">Monthly archive pending...</p>
               </div>
            </TabsContent>

            <TabsContent value="yearly" className="outline-none">
               <div className="p-12 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem]">
                  <p className="text-slate-300 font-bold text-sm uppercase tracking-widest">Annual ledger processing...</p>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
