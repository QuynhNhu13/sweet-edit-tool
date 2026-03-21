import { useParent } from "@/contexts/ParentContext";
import { Wallet, Users, Bell, Star, CreditCard, MessageSquare, HelpCircle, CalendarDays, TrendingUp, BookOpen, CheckCircle2, BarChart3, UserRoundSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ParentDashboard = () => {
  const { profile, children, notifications, walletBalance, transactions, childProgress } = useParent();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const totalSpent = Math.abs(
    transactions.filter(t => t.type === "tuition_payment" && t.status === "completed").reduce((s, t) => s + t.amount, 0)
  );
  const avgGpa = children.length > 0 ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1) : "0";
  const totalClasses = children.reduce((s, c) => s + c.totalClasses, 0);
  const avgAttendance = children.length > 0 ? Math.round(children.reduce((s, c) => s + c.attendance, 0) / children.length) : 0;

  const quickActions = [
    { label: "Con em & tiến độ", icon: Users, action: () => navigate("/parent/children"), desc: "Theo dõi lớp học, lịch học, báo cáo" },
    { label: "Thanh toán học phí", icon: CreditCard, action: () => navigate("/parent/wallet"), desc: "Quản lý học phí và lịch sử giao dịch" },
    { label: "Tin nhắn", icon: MessageSquare, action: () => navigate("/parent/chat"), desc: "Trao đổi với gia sư và trung tâm" },
    { label: "Hỗ trợ & khiếu nại", icon: HelpCircle, action: () => navigate("/parent/support"), desc: "Tạo yêu cầu hỗ trợ hoặc khiếu nại" },
    { label: "Tìm gia sư", icon: UserRoundSearch, action: () => navigate("/find-tutor"), desc: "Chuyển tới hệ thống tìm gia sư" },
  ];

  const latestReports = Object.values(childProgress)
    .map((series) => series[series.length - 1])
    .filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Chào mừng trở lại, {profile.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Theo dõi việc học của con em</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Wallet, label: "Tổng chi tiêu", value: `${totalSpent.toLocaleString("vi-VN")}đ`, sub: `Số dư: ${walletBalance.toLocaleString("vi-VN")}đ` },
          { icon: Users, label: "Số con đang học", value: String(children.length), sub: `${totalClasses} lớp học` },
          { icon: Bell, label: "Thông báo mới", value: String(unreadNotifs), sub: "Chưa đọc" },
          { icon: Star, label: "GPA trung bình", value: avgGpa, sub: `Chuyên cần: ${avgAttendance}%` },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><s.icon className="w-5 h-5 text-foreground" /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Children Overview */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Tổng quan con em</h3>
          <button onClick={() => navigate("/parent/children")} className="text-xs text-primary font-medium hover:text-primary/80">Xem chi tiết</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children.map(child => (
            <div key={child.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/parent/children")}>
              <img src={child.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{child.name}</p>
                <p className="text-xs text-muted-foreground">{child.grade} • {child.school}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="w-3 h-3" /> {child.totalClasses} lớp</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {child.attendance}%</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-foreground">{child.gpa}</p>
                <p className="text-[10px] text-muted-foreground">GPA</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Báo cáo tiến độ tích hợp
          </h3>
          <button onClick={() => navigate("/parent/reports")} className="text-xs text-primary font-medium hover:text-primary/80">Xem báo cáo chi tiết</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {latestReports.map((report, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground">{report.month}</p>
              <p className="text-lg font-bold text-foreground">GPA {report.gpa}</p>
              <p className="text-xs text-muted-foreground">Chuyên cần {report.attendance}% • {report.sessionsCompleted} buổi</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Thông báo gần đây</h3>
        <div className="space-y-2">
          {notifications.slice(0, 5).map(n => (
            <div key={n.id} className={cn("flex items-start gap-3 p-3 rounded-xl transition-colors", !n.read ? "bg-primary/5" : "hover:bg-muted/30")}>
              <span className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", n.type === "warning" ? "bg-foreground" : n.type === "success" ? "bg-muted-foreground" : "bg-border")} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", !n.read ? "font-medium text-foreground" : "text-muted-foreground")}>{n.title}</p>
                <p className="text-xs text-muted-foreground truncate">{n.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{n.timestamp.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Hành động nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <button key={i} onClick={a.action} className="bg-card border border-border rounded-2xl p-4 hover:bg-muted/50 hover:shadow-md transition-all text-left group">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors"><a.icon className="w-4 h-4 text-foreground" /></div>
              <p className="text-sm font-medium text-foreground">{a.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
