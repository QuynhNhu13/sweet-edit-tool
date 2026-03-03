import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpRight, Clock, TrendingUp, ArrowLeftRight, Banknote, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "T10", revenue: 28000000 },
  { month: "T11", revenue: 32000000 },
  { month: "T12", revenue: 35000000 },
  { month: "T1", revenue: 30000000 },
  { month: "T2", revenue: 38000000 },
  { month: "T3", revenue: 42000000 },
];

const FinanceDashboard = () => {
  const { transactions, withdrawals } = useFinance();
  const navigate = useNavigate();

  const totalRevenue = transactions.filter(t => t.type === "tuition" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const todayTx = transactions.filter(t => t.date === "03/03/2026").length;
  const pendingPayouts = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const growth = 12.5;

  const recentTx = transactions.slice(0, 5);

  const quickActions = [
    { label: "Giao dịch", icon: ArrowLeftRight, action: () => navigate("/finance/transactions") },
    { label: "Thanh toán GS", icon: Banknote, action: () => navigate("/finance/payouts") },
    { label: "Báo cáo", icon: BarChart3, action: () => navigate("/finance/reports") },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tổng quan tài chính</h1>
        <p className="text-muted-foreground text-sm">Kế toán · Hôm nay, 03/03/2026</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3"><DollarSign className="w-5 h-5 text-foreground" /></div>
          <p className="text-xl font-bold text-foreground">{totalRevenue.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground mt-1">Doanh thu tháng</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3"><ArrowLeftRight className="w-5 h-5 text-foreground" /></div>
          <p className="text-xl font-bold text-foreground">{todayTx}</p>
          <p className="text-xs text-muted-foreground mt-1">Giao dịch hôm nay</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-foreground" /></div>
          <p className="text-xl font-bold text-foreground">{pendingPayouts.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground mt-1">Chờ thanh toán</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5 text-foreground" /></div>
          <p className="text-xl font-bold text-foreground flex items-center gap-1">+{growth}% <ArrowUpRight className="w-4 h-4 text-primary" /></p>
          <p className="text-xs text-muted-foreground mt-1">Tăng trưởng</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Doanh thu 6 tháng gần nhất</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Giao dịch gần đây</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentTx.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-xs font-medium text-foreground">{t.description}</p>
                  <p className="text-[10px] text-muted-foreground">{t.date}</p>
                </div>
                <span className={`text-xs font-bold ${t.type === "tuition" || t.type === "deposit" ? "text-primary" : "text-foreground"}`}>
                  {t.type === "refund" ? "-" : "+"}{t.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base">Hành động nhanh</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(a => (
              <Button key={a.label} variant="outline" onClick={a.action} className="h-auto py-4 flex flex-col gap-2 rounded-xl">
                <a.icon className="w-5 h-5" />
                <span className="text-xs">{a.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
