import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { Download, DollarSign, TrendingUp, TrendingDown, Trophy, Users, ArrowUpRight } from "lucide-react";
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

const COLORS_REV = ["hsl(224, 76%, 48%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 68%, 55%)"];
const COLORS_EXP = ["hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(224, 76%, 48%)", "hsl(142, 71%, 45%)", "hsl(280, 68%, 55%)"];

const tooltipStyle = {
  borderRadius: "1rem",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
};

const FinanceReports = () => {
  const { toast } = useToast();
  const totalRevenue = monthlyData[monthlyData.length - 1].revenue;
  const totalExpense = monthlyData[monthlyData.length - 1].expense;
  const totalProfit = monthlyData[monthlyData.length - 1].profit;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const exportReport = (type: string) => { toast({ title: `Đã xuất ${type}` }); };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo tài chính</h1>
          <p className="text-sm text-muted-foreground">Dữ liệu cập nhật đến tháng 3/2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl text-sm" onClick={() => exportReport("báo cáo PDF")}>
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
          <Button variant="outline" className="rounded-2xl text-sm" onClick={() => exportReport("báo cáo Excel")}>
            <Download className="w-4 h-4 mr-1" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-xl font-bold text-primary">{totalRevenue.toLocaleString("vi-VN")}đ</p>
            <p className="text-xs text-muted-foreground mt-1">Doanh thu T3</p>
            <p className="text-xs text-primary flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +10.5% so với T2</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-xl font-bold text-destructive">{totalExpense.toLocaleString("vi-VN")}đ</p>
            <p className="text-xs text-muted-foreground mt-1">Chi phí T3</p>
            <p className="text-xs text-destructive flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +6.9% so với T2</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{totalProfit.toLocaleString("vi-VN")}đ</p>
            <p className="text-xs text-muted-foreground mt-1">Lợi nhuận T3</p>
            <p className="text-xs text-primary flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +22.2% so với T2</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{profitMargin}%</p>
            <p className="text-xs text-muted-foreground mt-1">Biên lợi nhuận</p>
            <p className="text-xs text-muted-foreground mt-1">Tỷ suất lợi nhuận</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-soft border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Doanh thu, Chi phí & Lợi nhuận 6 tháng</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="hsl(224, 76%, 48%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Chi phí" fill="hsl(0, 84%, 60%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Lợi nhuận" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Cơ cấu nguồn thu</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {revenueBreakdown.map((_, i) => <Cell key={i} fill={COLORS_REV[i % COLORS_REV.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {revenueBreakdown.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_REV[i] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.amount.toLocaleString("vi-VN")}đ ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Cơ cấu chi phí</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS_EXP[i % COLORS_EXP.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {expenseBreakdown.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_EXP[i] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.amount.toLocaleString("vi-VN")}đ ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-soft border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Xu hướng lợi nhuận</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="profit" stroke="hsl(var(--primary))" fill="url(#profitGrad)" strokeWidth={2} name="Lợi nhuận" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2"><Trophy className="w-4 h-4" /> Top gia sư & giáo viên có doanh thu cao</CardTitle>
            <Button variant="outline" size="sm" className="rounded-2xl text-xs" onClick={() => exportReport("bảng xếp hạng")}>
              <Download className="w-3.5 h-3.5 mr-1" /> Xuất
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {topTutors.map((t, i) => (
            <div key={t.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.classes} lớp · {t.students} HS · {t.rating}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-foreground">{t.revenue.toLocaleString("vi-VN")}đ</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceReports;
