import { useParent } from "@/contexts/ParentContext";
import {
  Wallet,
  Users,
  Bell,
  Star,
  CreditCard,
  MessageSquare,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  BarChart3,
  UserRoundSearch,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ParentDashboard = () => {
  const { profile, children, notifications, walletBalance, transactions, childProgress } = useParent();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const totalSpent = Math.abs(
    transactions
      .filter(t => t.type === "tuition_payment" && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0)
  );

  const avgGpa =
    children.length > 0
      ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1)
      : "0";

  const totalClasses = children.reduce((s, c) => s + c.totalClasses, 0);

  const avgAttendance =
    children.length > 0
      ? Math.round(children.reduce((s, c) => s + c.attendance, 0) / children.length)
      : 0;

  const quickActions = [
    { label: "Con em & tiến độ", icon: Users, action: () => navigate("/parent/children"), desc: "Theo dõi lớp học" },
    { label: "Thanh toán học phí", icon: CreditCard, action: () => navigate("/parent/wallet"), desc: "Quản lý học phí" },
    { label: "Tin nhắn", icon: MessageSquare, action: () => navigate("/parent/chat"), desc: "Trao đổi gia sư" },
    { label: "Hỗ trợ", icon: HelpCircle, action: () => navigate("/parent/support"), desc: "Khiếu nại & hỗ trợ" },
    { label: "Tìm gia sư", icon: UserRoundSearch, action: () => navigate("/find-tutor"), desc: "Tìm gia sư phù hợp" },
  ];

  const latestReports = Object.values(childProgress)
    .map(series => series[series.length - 1])
    .filter(Boolean);

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 bg-cyan-300/10 blur-2xl rounded-full" />

        <div className="relative flex flex-col lg:flex-row justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold">
              Xin chào {profile.name}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Theo dõi tình hình học tập và tài chính của con bạn
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
              <p className="text-xs">Tổng chi</p>
              <p className="text-xl font-bold">{totalSpent.toLocaleString("vi-VN")}đ</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
              <p className="text-xs">Số dư</p>
              <p className="text-xl font-bold">{walletBalance.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Số con",
            value: children.length,
            sub: `${totalClasses} lớp`,
            color: "from-blue-500 to-indigo-500",
            icon: Users,
          },
          {
            label: "Thông báo",
            value: unreadNotifs,
            sub: "Chưa đọc",
            color: "from-amber-500 to-orange-500",
            icon: Bell,
          },
          {
            label: "GPA TB",
            value: avgGpa,
            sub: `Chuyên cần ${avgAttendance}%`,
            color: "from-emerald-500 to-teal-500",
            icon: Star,
          },
          {
            label: "Chi tiêu",
            value: `${totalSpent.toLocaleString("vi-VN")}đ`,
            sub: "Học phí",
            color: "from-rose-500 to-pink-500",
            icon: Wallet,
          },
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-white hover:shadow-lg transition-all",
              s.color
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4" />
          </div>
        ))}
      </div>

      {/* CHILDREN */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Con em</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map(child => (
            <div
              key={child.id}
              onClick={() => navigate("/parent/children")}
              className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 transition"
            >
              <img src={child.avatar} className="w-12 h-12 rounded-full object-cover" />

              <div className="flex-1">
                <p className="text-sm font-semibold">{child.name}</p>
                <p className="text-xs text-muted-foreground">{child.grade}</p>

                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {child.totalClasses}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {child.attendance}%
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">{child.gpa}</p>
                <p className="text-[10px] text-muted-foreground">GPA</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Báo cáo gần nhất
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {latestReports.map((r, i) => (
            <div key={i} className="p-3 rounded-2xl bg-muted/30">
              <p className="text-xs text-muted-foreground">{r.month}</p>
              <p className="text-lg font-bold">GPA {r.gpa}</p>
              <p className="text-xs text-muted-foreground">
                {r.attendance}% • {r.sessionsCompleted} buổi
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Thông báo</h3>

        <div className="space-y-2">
          {notifications.slice(0, 5).map(n => (
            <div
              key={n.id}
              className={cn(
                "p-3 rounded-2xl",
                !n.read ? "bg-primary/5" : "hover:bg-muted/50"
              )}
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTION */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Hành động nhanh</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={a.action}
              className="rounded-2xl bg-muted/40 p-4 hover:bg-muted/70 transition"
            >
              <a.icon className="w-5 h-5 mb-2" />
              <p className="text-sm font-medium">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;