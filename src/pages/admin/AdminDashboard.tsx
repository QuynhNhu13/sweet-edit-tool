import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, CreditCard, Clock, FileText, UserCheck, ArrowUpRight, ArrowDownRight, ChevronRight, Plus, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Pie, Cell, PieChart } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--secondary-foreground))", "hsl(var(--destructive))"];

const AdminDashboard = () => {
  const { users, classes, tests, transactions, settings } = useAdmin();
  const navigate = useNavigate();

  const totalUsers = users.length;
  const totalTutorsTeachers = users.filter(u => u.role === "tutor" || u.role === "teacher").length;
  const activeClasses = classes.filter(c => c.status === "active").length;
  const pendingApprovals = users.filter(u => u.status === "pending").length;

  const now = new Date();
  const monthRevenue = transactions
    .filter(t => t.status === "completed" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthTests = tests.filter(t => {
    const d = new Date(t.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const pendingUsers = users.filter(u => u.status === "pending");
  const avgApprovalDays = pendingUsers.length > 0
    ? Math.round(pendingUsers.reduce((sum, u) => sum + Math.ceil((now.getTime() - new Date(u.createdAt).getTime()) / 86400000), 0) / pendingUsers.length)
    : 0;

  const topStats = [
    { label: "Tổng người dùng", value: totalUsers, icon: Users, change: "+12%", up: true },
    { label: "Gia sư & Giáo viên", value: totalTutorsTeachers, icon: GraduationCap, change: "+8%", up: true },
    { label: "Lớp đang hoạt động", value: activeClasses, icon: BookOpen, change: "+5%", up: true },
    { label: "Doanh thu tháng", value: `${(monthRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, change: "+18%", up: true },
  ];

  const recentClasses = classes.filter(c => c.status === "searching" || c.status === "active").slice(0, 4);
  const recentTransactions = transactions.slice(0, 5);

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = `${d.getMonth() + 1}`;
    const revenue = transactions
      .filter((t) => t.status === "completed" && new Date(t.date).getMonth() === d.getMonth())
      .reduce((s, t) => s + t.amount, 0);
    return { month, revenue };
  });

  const usersByRole = ["tutor", "teacher", "student", "parent"].map((role) => ({
    name: role,
    value: users.filter((u) => u.role === role).length,
  }));

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "—";

  const statusLabel: Record<string, string> = { searching: "Đang tìm", active: "Đang học", completed: "Hoàn thành" };
  
  const txStatusLabel: Record<string, string> = { completed: "Hoàn thành", pending: "Đang xử lý", failed: "Thất bại", refunded: "Hoàn tiền" };

  return (
    <div className="p-6 space-y-6">
      {/* Top 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(s => (
          <Card key={s.label} className="border-0 shadow-soft hover:shadow-elevated transition-shadow duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground tracking-tight">{s.value}</p>
                  <div className="flex items-center gap-1">
                    {s.up ? <ArrowUpRight className="w-3.5 h-3.5 text-primary" /> : <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />}
                    <span className={`text-xs font-semibold ${s.up ? "text-primary" : "text-destructive"}`}>{s.change}</span>
                    <span className="text-xs text-muted-foreground">vs tháng trước</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-muted">
                  <s.icon className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-[13px] text-muted-foreground font-medium">Chờ phê duyệt</p>
                  <p className="text-2xl font-bold text-foreground">{pendingApprovals}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs" onClick={() => navigate("/admin/approvals")}>
              Xem ngay <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">Bài test tháng này</p>
                <p className="text-2xl font-bold text-foreground">{monthTests}</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-10">
              {[40, 65, 55, 80, 70, 90, 60].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/20 relative overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full bg-primary rounded-sm" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">TB phê duyệt</p>
                <p className="text-2xl font-bold text-foreground">{avgApprovalDays} ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${Math.min(avgApprovalDays * 10, 125)} 125`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">{avgApprovalDays}d</span>
              </div>
              <p className="text-xs text-muted-foreground">Mục tiêu: &lt; 3 ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><PieChartIcon className="w-4 h-4" /> Cơ cấu người dùng</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usersByRole} dataKey="value" nameKey="name" outerRadius={85} label>
                    {usersByRole.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Quản lý lớp học</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/admin/classes")}>
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentClasses.map(c => (
                <div key={c.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{getUserName(c.tutorId)} · {c.fee.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-foreground">
                    {statusLabel[c.status]}
                  </span>
                </div>
              ))}
              {recentClasses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có lớp học</p>}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 rounded-xl text-xs" onClick={() => navigate("/admin/classes")}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Tạo lớp mới
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Giao dịch gần đây</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/admin/transactions")}>
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                    {user?.avatar && <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{user?.name || "—"} · {tx.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{tx.amount.toLocaleString("vi-VN")}đ</p>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {txStatusLabel[tx.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
