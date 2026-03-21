import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, CreditCard, ScrollText, Settings, LogOut, Bell, Check, ChevronRight, AlertTriangle, Info, CheckCircle2, XCircle, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import EduLogo from "@/components/EduLogo";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/classes", icon: BookOpen, label: "Lớp học" },
  { to: "/admin/transactions", icon: CreditCard, label: "Giao dịch" },
  { to: "/admin/audit", icon: ScrollText, label: "Audit Log" },
  { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

const pageTitles: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/users": "Quản lý người dùng",
  "/admin/classes": "Quản lý lớp học",
  "/admin/transactions": "Giao dịch",
  "/admin/audit": "Audit Log",
  "/admin/settings": "Cài đặt hệ thống",
};

const notifIcon: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  info: <Info className="w-4 h-4 text-info" />,
  success: <CheckCircle2 className="w-4 h-4 text-success" />,
  error: <XCircle className="w-4 h-4 text-destructive" />,
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, notifications, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const [showNotif, setShowNotif] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pendingCount = users.filter(u => u.status === "pending").length;
  const unreadCount = notifications.filter(n => !n.read).length;
  const currentTitle = pageTitles[location.pathname] || "Admin";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn("bg-primary text-primary-foreground border-r border-primary/30 flex flex-col shrink-0 transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]")}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <EduLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground leading-tight truncate">EduConnect</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground", collapsed ? "mx-auto" : "ml-auto")}
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {!collapsed && <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Menu</p>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                  collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive
                    ? "bg-background text-foreground shadow-md"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                )
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.to === "/admin/users" && pendingCount > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1.5">
                  {pendingCount}
                </span>
              )}
              {collapsed && item.to === "/admin/users" && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            title={collapsed ? "Đăng xuất" : undefined}
            className={cn("flex items-center gap-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all duration-200", collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5")}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell with dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                      >
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
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.type === "warning" && n.title.includes("chờ duyệt")) {
                              navigate("/admin/users");
                              setShowNotif(false);
                            }
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3",
                            !n.read && "bg-primary/5"
                          )}
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
                  <div className="px-4 py-2.5 border-t border-border">
                    <button
                      onClick={() => { setShowNotif(false); navigate("/admin/audit"); }}
                      className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary/80"
                    >
                      Xem tất cả hoạt động <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <UserAvatarDropdown name="Quản trị viên" role="Admin" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
