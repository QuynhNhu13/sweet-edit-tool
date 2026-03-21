import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, BarChart3, Database, LogOut, PanelLeftClose, PanelLeft, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExamManager } from "@/contexts/ExamManagerContext";
import EduLogo from "@/components/EduLogo";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { to: "/exam-manager", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/exam-manager/exams", icon: FileText, label: "Quản lý đề thi" },
  { to: "/exam-manager/ai-config", icon: Settings, label: "Cấu hình AI" },
  { to: "/exam-manager/stats", icon: BarChart3, label: "Thống kê" },
  { to: "/exam-manager/questions", icon: Database, label: "Ngân hàng câu hỏi" },
];

const pageTitles: Record<string, string> = {
  "/exam-manager": "Tổng quan",
  "/exam-manager/exams": "Quản lý đề thi",
  "/exam-manager/ai-config": "Cấu hình AI Generate",
  "/exam-manager/stats": "Thống kê đề thi",
  "/exam-manager/questions": "Ngân hàng câu hỏi",
};

const ExamManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markNotificationRead, markAllNotificationsRead, profile } = useExamManager();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotif = notifications.filter(n => !n.read).length;
  const currentTitle = pageTitles[location.pathname] || "Quản lý đề";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <aside className={cn("sidebar-theme mx-3 my-3 rounded-[1.75rem] border border-sidebar-border/70 bg-card shadow-elevated backdrop-blur-sm flex flex-col shrink-0 transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]")}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border/40">
          <EduLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="min-w-0">
                <h1 className="text-base font-bold leading-tight truncate text-sidebar-foreground">EduConnect</h1>
                <p className="text-[11px] text-sidebar-foreground/70 leading-tight">Quản lý đề thi</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className={cn("p-1.5 rounded-full hover:bg-sidebar-accent/80 transition-all duration-300 text-sidebar-foreground/90 hover:text-sidebar-accent-foreground hover:shadow-soft", collapsed ? "mx-auto" : "ml-auto")}>
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {!collapsed && <p className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 mb-3 text-sidebar-muted-foreground">Menu</p>}
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} title={collapsed ? item.label : undefined}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-full text-[13px] font-semibold transition-all duration-300",
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft" : "text-sidebar-foreground/95 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}>
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border/40">
          <button onClick={() => navigate("/")} title={collapsed ? "Đăng xuất" : undefined}
            className={cn("flex items-center gap-3 rounded-full text-[13px] font-semibold text-sidebar-foreground/95 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-all duration-300", collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5")}>
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
                {unreadNotif > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">{unreadNotif}</span>}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Thông báo</h3>
                    {unreadNotif > 0 && <button onClick={markAllNotificationsRead} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"><Check className="w-3 h-3" /> Đọc tất cả</button>}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => { markNotificationRead(n.id); setShowNotif(false); }}
                        className={cn("w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors", !n.read && "bg-primary/5")}>
                        <p className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.timestamp}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <UserAvatarDropdown avatar={profile.avatar} name={profile.name} role={profile.role} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
};

export default ExamManagerLayout;
