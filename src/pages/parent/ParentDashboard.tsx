import { useParent } from "@/contexts/ParentContext";
import { Wallet, Users, Bell, Star, Search, CreditCard, MessageSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ParentDashboard = () => {
  const { profile, children, notifications, walletBalance } = useParent();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const totalSpent = Math.abs(
    useParent().transactions.filter(t => t.type === "tuition_payment" && t.status === "completed").reduce((s, t) => s + t.amount, 0)
  );
  const avgGpa = children.length > 0 ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1) : "0";

  const quickActions = [
    { label: "Tìm gia sư mới", icon: Search, action: () => navigate("/student/find-tutor") },
    { label: "Thanh toán học phí", icon: CreditCard, action: () => navigate("/parent/wallet") },
    { label: "Đánh giá gia sư", icon: Star, action: () => navigate("/parent/reports") },
    { label: "Hỗ trợ", icon: HelpCircle, action: () => navigate("/help") },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Chào mừng trở lại, {profile.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Theo dõi việc học của con em</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Wallet, label: "Tổng quan chi tiêu", value: `${totalSpent.toLocaleString("vi-VN")}đ`, sub: "Đã thanh toán" },
          { icon: Users, label: "Số con đang học", value: String(children.length), sub: `${children.reduce((s, c) => s + c.totalClasses, 0)} lớp học` },
          { icon: Bell, label: "Thông báo mới", value: String(unreadNotifs), sub: "Chưa đọc" },
          { icon: Star, label: "Đánh giá trung bình", value: avgGpa, sub: "GPA" },
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
            <button key={i} onClick={a.action} className="bg-card border border-border rounded-2xl p-4 hover:bg-muted/50 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center mb-3"><a.icon className="w-4 h-4 text-foreground" /></div>
              <p className="text-sm font-medium text-foreground">{a.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
