import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { CreditCard, BookOpen, Users, TrendingUp } from "lucide-react";

const COLORS = [
  "hsl(224, 76%, 48%)",   // primary blue
  "hsl(142, 71%, 45%)",   // emerald
  "hsl(38, 92%, 50%)",    // amber
  "hsl(0, 84%, 60%)",     // red
  "hsl(262, 83%, 58%)",   // purple
  "hsl(199, 89%, 48%)",   // sky blue
];

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
    { label: "Lớp đang mở", value: activeClasses, icon: BookOpen, color: "bg-success/150/10 text-success" },
    { label: "Người dùng mới", value: newUsersMonth, icon: Users, color: "bg-warning/150/10 text-warning" },
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

  // Revenue by type for pie chart
  const revenueByType = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.status === "completed").forEach(t => {
      const label = t.type === "tuition" ? "Học phí" : t.type === "salary" ? "Lương gia sư" : "Phí thi thử";
      map[label] = (map[label] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Users by role for pie chart
  const usersByRole = useMemo(() => {
    const map: Record<string, number> = {};
    const labels: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh" };
    users.forEach(u => {
      const label = labels[u.role] || u.role;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [users]);

  const chartConfig = {
    revenue: { label: "Doanh thu", color: "hsl(224, 76%, 48%)" },
    profit: { label: "Lợi nhuận", color: "hsl(142, 71%, 45%)" },
    count: { label: "Người dùng mới", color: "hsl(224, 76%, 48%)" },
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

      {/* Row 1: Revenue bar + Revenue area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Doanh thu & Lợi nhuận theo tháng</h3>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(224, 76%, 48%)" radius={[6, 6, 0, 0]} name="Doanh thu" />
                <Bar dataKey="profit" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} name="Lợi nhuận" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Xu hướng người dùng mới</h3>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <AreaChart data={weeklyUsers}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(224, 76%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(224, 76%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="count" stroke="hsl(224, 76%, 48%)" strokeWidth={2.5} fill="url(#colorCount)" dot={{ r: 4, fill: "hsl(224, 76%, 48%)" }} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Phân bổ doanh thu theo loại</h3>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Phân bổ người dùng theo vai trò</h3>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {usersByRole.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {usersByRole.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
