import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import MessageBubble from "@/components/MessageBubble";
import {
  LayoutDashboard, BookOpen, CalendarDays, LogOut, PanelLeftClose, PanelLeft,
  Bell, Check, AlertTriangle, Info, CheckCircle2, XCircle, MessageSquare, Wallet, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudent } from "@/contexts/StudentContext";
import EduLogo from "@/components/EduLogo";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import { useState, useRef, useEffect } from "react";

const navGroups = [
  {
    items: [
      { to: "/student", icon: LayoutDashboard, label: "Tổng quan", end: true },
      { to: "/student/classes", icon: BookOpen, label: "Học tập" },
      { to: "/student/wallet", icon: Wallet, label: "Ví học phí" },
      { to: "/student/reviews", icon: Star, label: "Đánh giá" },
      { to: "/student/chat", icon: MessageSquare, label: "Tin nhắn" },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/student": "Tổng quan",
  "/student/classes": "Học tập",
  "/student/schedule": "Học tập",
  "/student/availability": "Học tập",
  "/student/reviews": "Đánh giá gia sư",
  "/student/wallet": "Ví học phí",
  "/student/chat": "Tin nhắn",
};

const notifIcon: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-4 h-4 text-muted-foreground" />,
  info: <Info className="w-4 h-4 text-muted-foreground" />,
  success: <CheckCircle2 className="w-4 h-4 text-muted-foreground" />,
  error: <XCircle className="w-4 h-4 text-muted-foreground" />,
};

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, notifications, markNotificationRead, markAllNotificationsRead, chatMessages } = useStudent();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotif = notifications.filter(n => !n.read).length;
  const unreadChat = chatMessages.filter(m => !m.read && m.sender !== "student").length;
  const currentTitle = pageTitles[location.pathname] || "Học sinh";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <aside className={cn("sidebar-theme bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]")}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <EduLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight truncate">EduConnect</h1>
              <p className="text-[11px] opacity-70 leading-tight">Học sinh</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors opacity-70", collapsed ? "mx-auto" : "ml-auto")}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-4" : ""}>
              {!collapsed && gi === 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-wider px-3 mb-2 opacity-50">Menu</p>
              )}
              {collapsed && gi > 0 && <div className="border-t border-border my-2 mx-2" />}
              <div className="space-y-0.5">
                {group.items.map(item => (
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
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "opacity-70 hover:bg-muted hover:opacity-100"
                      )
                    }
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {item.to === "/student/chat" && unreadChat > 0 && (
                      <span className={cn(
                        "flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground",
                        collapsed ? "absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[9px]" : "min-w-[20px] h-5 px-1.5"
                      )}>
                        {unreadChat}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            title={collapsed ? "Đăng xuất" : undefined}
            className={cn("flex items-center gap-3 rounded-xl text-[13px] font-medium opacity-70 hover:bg-destructive/20 hover:opacity-100 w-full transition-all duration-200", collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5")}
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
            <ThemeToggle />

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
                      <button onClick={() => markAllNotificationsRead()} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                        <Check className="w-3 h-3" /> Đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map(n => (
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
                    ))}
                  </div>
                </div>
              )}
            </div>

            <UserAvatarDropdown avatar={profile.avatar} name={profile.name} role={profile.grade} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MessageBubble to="/student/chat" unreadCount={unreadChat} />
    </div>
  );
};

export default StudentLayout;
