import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trophy,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const monthlyData = [
  { month: "T10", revenue: 28000000, expense: 22000000, profit: 6000000 },
  { month: "T11", revenue: 32000000, expense: 25000000, profit: 7000000 },
  { month: "T12", revenue: 35000000, expense: 27000000, profit: 8000000 },
  { month: "T1", revenue: 30000000, expense: 23000000, profit: 7000000 },
  { month: "T2", revenue: 38000000, expense: 29000000, profit: 9000000 },
  { month: "T3", revenue: 42000000, expense: 31000000, profit: 11000000 },
];

const revenueBreakdown = [
  { name: "Học phí", value: 72, amount: 30240000 },
  { name: "Phí thi thử", value: 12, amount: 5040000 },
  { name: "Nạp ví", value: 10, amount: 4200000 },
  { name: "Khác", value: 6, amount: 2520000 },
];

const expenseBreakdown = [
  { name: "Lương gia sư", value: 55, amount: 17050000 },
  { name: "Lương giáo viên", value: 15, amount: 4650000 },
  { name: "Hoàn tiền", value: 8, amount: 2480000 },
  { name: "Vận hành", value: 12, amount: 3720000 },
  { name: "Marketing", value: 10, amount: 3100000 },
];

const topTutors = [
  { name: "Nguyễn Văn An", role: "Gia sư", revenue: 12800000, classes: 3, students: 8, rating: 4.9 },
  { name: "Trần Thị Bích", role: "Giáo viên", revenue: 9600000, classes: 2, students: 12, rating: 4.8 },
  { name: "Đỗ Quang Minh", role: "Gia sư", revenue: 7200000, classes: 1, students: 3, rating: 4.7 },
  { name: "Vũ Thị Phương", role: "Giáo viên", revenue: 5100000, classes: 1, students: 6, rating: 4.6 },
  { name: "Hoàng Đức Em", role: "Gia sư", revenue: 3600000, classes: 1, students: 2, rating: 4.5 },
];

const COLORS_REV = [
  "hsl(224, 76%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 68%, 55%)",
];

const COLORS_EXP = [
  "hsl(0, 84%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(224, 76%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 68%, 55%)",
];

const tooltipStyle = {
  borderRadius: "1rem",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
};

const FinanceReports = () => {
  const { toast } = useToast();
  useFinance();

  const totalRevenue = monthlyData[monthlyData.length - 1].revenue;
  const totalExpense = monthlyData[monthlyData.length - 1].expense;
  const totalProfit = monthlyData[monthlyData.length - 1].profit;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const exportReport = (type: string) => {
    toast({ title: `Đã xuất ${type}` });
  };

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* HERO */}
      {/* <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Báo cáo tài chính</h1>
            <p className="mt-1 text-sm text-white/80">Dữ liệu cập nhật đến tháng 3/2026</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="rounded-2xl border-0 bg-white/15 text-white backdrop-blur hover:bg-white/20"
              onClick={() => exportReport("báo cáo PDF")}
            >
              <Download className="mr-1 h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="secondary"
              className="rounded-2xl border-0 bg-white/15 text-white backdrop-blur hover:bg-white/20"
              onClick={() => exportReport("báo cáo Excel")}
            >
              <Download className="mr-1 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div> */}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Doanh thu T3",
            value: `${totalRevenue.toLocaleString("vi-VN")}đ`,
            sub: "+10.5% so với T2",
            icon: DollarSign,
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Chi phí T3",
            value: `${totalExpense.toLocaleString("vi-VN")}đ`,
            sub: "+6.9% so với T2",
            icon: TrendingDown,
            color: "from-rose-500 to-pink-500",
          },
          {
            label: "Lợi nhuận T3",
            value: `${totalProfit.toLocaleString("vi-VN")}đ`,
            sub: "+22.2% so với T2",
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Biên lợi nhuận",
            value: `${profitMargin}%`,
            sub: "Tỷ suất lợi nhuận",
            icon: Trophy,
            color: "from-amber-500 to-orange-500",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-white transition-all hover:shadow-lg ${s.color}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/80">
                <ArrowUpRight className="h-3 w-3" />
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <BarChart3 className="h-4 w-4 text-primary" />
          Doanh thu, Chi phí & Lợi nhuận 6 tháng
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`}
              contentStyle={tooltipStyle}
            />
            <Bar dataKey="revenue" name="Doanh thu" fill="hsl(224, 76%, 48%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Chi phí" fill="hsl(0, 84%, 60%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="profit" name="Lợi nhuận" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Cơ cấu nguồn thu
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS_REV[i % COLORS_REV.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-2">
            {revenueBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS_REV[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {item.amount.toLocaleString("vi-VN")}đ ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Cơ cấu chi phí
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS_EXP[i % COLORS_EXP.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-2">
            {expenseBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS_EXP[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {item.amount.toLocaleString("vi-VN")}đ ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AREA CHART */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Xu hướng lợi nhuận</h3>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`}
              contentStyle={tooltipStyle}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(var(--primary))"
              fill="url(#profitGrad)"
              strokeWidth={2}
              name="Lợi nhuận"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* TOP TUTORS */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-primary" />
            Top gia sư & giáo viên có doanh thu cao
          </h3>

          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl text-xs"
            onClick={() => exportReport("bảng xếp hạng")}
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Xuất
          </Button>
        </div>

        <div className="space-y-3">
          {topTutors.map((t, i) => (
            <div
              key={t.name}
              className="flex items-center justify-between rounded-2xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>

                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.classes} lớp · {t.students} HS · {t.rating}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-foreground">{t.revenue.toLocaleString("vi-VN")}đ</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceReports;  