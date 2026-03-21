import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Wallet, CalendarDays, Users, Star,
  MessageSquare, UserCircle, LogOut, PanelLeftClose, PanelLeft, Bell,
  Check, AlertTriangle, Info, CheckCircle2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTutor } from "@/contexts/TutorContext";
import EduLogo from "@/components/EduLogo";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import { useState, useRef, useEffect } from "react";
import MessageBubble from "@/components/MessageBubble";

const navItems = [
  { to: "/tutor", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/tutor/classes", icon: BookOpen, label: "Lớp học" },
  { to: "/tutor/students", icon: Users, label: "Học sinh" },
  { to: "/tutor/wallet", icon: Wallet, label: "Thu nhập" },
  { to: "/tutor/schedule", icon: CalendarDays, label: "Lịch dạy" },
  { to: "/tutor/reviews", icon: Star, label: "Đánh giá" },
  { to: "/tutor/chat", icon: MessageSquare, label: "Tin nhắn" },
  { to: "/tutor/profile", icon: UserCircle, label: "Hồ sơ" },
];

const pageTitles: Record<string, string> = {
  "/tutor": "Tổng quan",
  "/tutor/classes": "Quản lý lớp học",
  "/tutor/students": "Tiến độ học sinh",
  "/tutor/wallet": "Thu nhập",
  "/tutor/schedule": "Lịch dạy",
  "/tutor/reviews": "Đánh giá",
  "/tutor/chat": "Tin nhắn",
  "/tutor/profile": "Hồ sơ cá nhân",
};

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const seedNotifications: Notification[] = [
  { id: "tn1", type: "success", title: "Buổi học đã hoàn thành", message: "Buổi Toán 12 ngày 01/03 đã được phụ huynh xác nhận.", timestamp: "01/03/2026 21:30", read: false },
  { id: "tn2", type: "info", title: "Yêu cầu học thử mới", message: "Phụ huynh Nguyễn Văn B yêu cầu học thử Lý 11 cho con.", timestamp: "02/03/2026 10:15", read: false },
  { id: "tn3", type: "warning", title: "Lịch dạy sắp tới", message: "Bạn có buổi dạy Toán 12 lúc 19:00 hôm nay.", timestamp: "03/03/2026 08:00", read: false },
  { id: "tn4", type: "success", title: "Thanh toán đã nhận", message: "Bạn đã nhận 500.000đ từ buổi dạy Lý 11.", timestamp: "28/02/2026 15:00", read: true },
  { id: "tn5", type: "info", title: "Đánh giá mới", message: "Phụ huynh Trần C đã đánh giá 5 sao cho buổi học.", timestamp: "27/02/2026 20:00", read: true },
];

const notifIcon: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-4 h-4 text-muted-foreground" />,
  info: <Info className="w-4 h-4 text-muted-foreground" />,
  success: <CheckCircle2 className="w-4 h-4 text-muted-foreground" />,
  error: <XCircle className="w-4 h-4 text-muted-foreground" />,
};

const TutorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, chatMessages } = useTutor();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadChat = chatMessages.filter(m => !m.read && m.sender !== "tutor").length;
  const unreadNotif = notifications.filter(n => !n.read).length;
  const currentTitle = pageTitles[location.pathname] || "Gia sư";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <aside className={cn("sidebar-theme bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]")}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <EduLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="min-w-0">
                <h1 className="text-base font-bold leading-tight truncate text-sidebar-foreground">EduConnect</h1>
                <p className="text-[11px] text-sidebar-muted-foreground leading-tight">Gia sư</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/80", collapsed ? "mx-auto" : "ml-auto")}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {!collapsed && <p className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-3 text-sidebar-muted-foreground">Menu</p>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 relative",
                  collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {item.to === "/tutor/chat" && unreadChat > 0 && (
                <span className={cn(
                  "flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground",
                  collapsed ? "absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[9px]" : "min-w-[20px] h-5 px-1.5"
                )}>
                  {unreadChat}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            title={collapsed ? "Đăng xuất" : undefined}
            className={cn("flex items-center gap-3 rounded-xl text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-all duration-200", collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5")}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{currentTitle}</h2>
          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button className="relative p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setShowNotif(!showNotif)}>
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadNotif > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
                    {unreadNotif}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Thông báo</h3>
                    {unreadNotif > 0 && (
                      <button onClick={markAllNotificationsRead} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                        <Check className="w-3 h-3" /> Đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Không có thông báo</p>
                    ) : (
                      notifications.map(n => (
                        <button
                          key={n.id}
                          onClick={() => { markNotificationRead(n.id); setShowNotif(false); }}
                          className={cn("w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3", !n.read && "bg-primary/5")}
                        >
                          <div className="mt-0.5 shrink-0">{notifIcon[n.type]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1">{n.timestamp}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <UserAvatarDropdown avatar={profile.avatar} name={profile.name} role="Gia sư" profilePath="/tutor/profile" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MessageBubble to="/tutor/chat" unreadCount={unreadChat} />
    </div>
  );
};

export default TutorLayout;
