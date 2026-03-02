import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, CreditCard, Clock, FileText, UserCheck, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const { users, classes, tests, transactions } = useAdmin();
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
    { label: "Tổng người dùng", value: totalUsers, icon: Users, change: "+12%", up: true, color: "bg-primary/10 text-primary" },
    { label: "Gia sư & Giáo viên", value: totalTutorsTeachers, icon: GraduationCap, change: "+8%", up: true, color: "bg-secondary/20 text-secondary-foreground" },
    { label: "Lớp đang hoạt động", value: activeClasses, icon: BookOpen, change: "+5%", up: true, color: "bg-primary/10 text-primary" },
    { label: "Doanh thu tháng", value: `${(monthRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, change: "+18%", up: true, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  const recentActivities = [
    ...users.filter(u => u.status === "pending").slice(0, 3).map(u => ({
      avatar: u.avatar,
      text: `${u.name} đăng ký làm ${u.role === "tutor" ? "gia sư" : "giáo viên"}`,
      time: u.createdAt,
      type: "pending" as const,
    })),
    ...transactions.slice(0, 3).map(tx => {
      const user = users.find(u => u.id === tx.userId);
      return {
        avatar: user?.avatar || "",
        text: tx.description,
        time: tx.date,
        type: tx.status as string,
      };
    }),
  ].slice(0, 5);

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
                    {s.up ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span className={`text-xs font-semibold ${s.up ? "text-emerald-500" : "text-destructive"}`}>{s.change}</span>
                    <span className="text-xs text-muted-foreground">vs tháng trước</span>
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary row: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending approvals */}
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
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl text-xs"
              onClick={() => navigate("/admin/approvals")}
            >
              Xem ngay <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Month tests */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">Bài test tháng này</p>
                <p className="text-2xl font-bold text-foreground">{monthTests}</p>
              </div>
            </div>
            {/* Mini bar chart representation */}
            <div className="flex items-end gap-1.5 h-10">
              {[40, 65, 55, 80, 70, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/20 relative overflow-hidden"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Avg approval time */}
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
            {/* Circular progress */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(avgApprovalDays * 10, 125)} 125`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
                  {avgApprovalDays}d
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Mục tiêu: &lt; 3 ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activities */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Hoạt động gần đây</h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/admin/audit")}>
              Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                {a.avatar && <img src={a.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
