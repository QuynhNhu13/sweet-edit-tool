import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { useMemo } from "react";
import { CreditCard, BookOpen, Users, TrendingUp } from "lucide-react";

const AdminReports = () => {
  const { transactions, users, classes, settings } = useAdmin();

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const escrowProfit = Math.round(totalRevenue * settings.escrowPercent / 100);
  const activeClasses = classes.filter(c => c.status === "active").length;
  const newUsersMonth = users.filter(u => {
    const d = new Date(u.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Tổng doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, color: "bg-primary/10 text-primary" },
    { label: "Lớp đang mở", value: activeClasses, icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Người dùng mới", value: newUsersMonth, icon: Users, color: "bg-amber-500/10 text-amber-600" },
    { label: "Lợi nhuận Escrow", value: `${(escrowProfit / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.status === "completed").forEach(t => {
      const key = t.date.slice(0, 7);
      map[key] = (map[key] || 0) + t.amount;
    });
    return Object.entries(map).sort().map(([month, total]) => ({
      month: month.slice(5),
      revenue: total,
      profit: Math.round(total * settings.escrowPercent / 100),
    }));
  }, [transactions, settings.escrowPercent]);

  const weeklyUsers = useMemo(() => {
    const weeks: Record<string, number> = {};
    users.forEach(u => {
      const d = new Date(u.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(5, 10);
      weeks[key] = (weeks[key] || 0) + 1;
    });
    return Object.entries(weeks).sort().slice(-8).map(([week, count]) => ({ week, count }));
  }, [users]);

  const chartConfig = {
    revenue: { label: "Doanh thu", color: "hsl(var(--primary))" },
    profit: { label: "Lợi nhuận", color: "hsl(var(--neon))" },
    count: { label: "Người dùng mới", color: "hsl(var(--primary))" },
  };

  return (
    <div className="p-6 space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Doanh thu theo tháng</h3>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Người dùng mới theo tuần</h3>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={weeklyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
