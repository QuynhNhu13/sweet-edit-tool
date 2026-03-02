import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CheckCircle, BookOpen, FileText, CreditCard, BarChart3, ScrollText, Settings, LogOut, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/admin/approvals", icon: CheckCircle, label: "Phê duyệt" },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/classes", icon: BookOpen, label: "Lớp học" },
  { to: "/admin/tests", icon: FileText, label: "Bài test" },
  { to: "/admin/transactions", icon: CreditCard, label: "Giao dịch" },
  { to: "/admin/reports", icon: BarChart3, label: "Báo cáo" },
  { to: "/admin/audit", icon: ScrollText, label: "Audit Log" },
  { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

const pageTitles: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/approvals": "Phê duyệt tài khoản",
  "/admin/users": "Quản lý người dùng",
  "/admin/classes": "Quản lý lớp học",
  "/admin/tests": "Quản lý bài test",
  "/admin/transactions": "Giao dịch",
  "/admin/reports": "Báo cáo & Phân tích",
  "/admin/audit": "Audit Log",
  "/admin/settings": "Cài đặt hệ thống",
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useAdmin();

  const pendingCount = users.filter(u => u.status === "pending").length;
  const currentTitle = pageTitles[location.pathname] || "Admin";

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-card border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">EduConnect</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.to === "/admin/approvals" && pendingCount > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1.5">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Admin profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Admin"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary/20"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground leading-tight">Admin</p>
                <p className="text-[11px] text-muted-foreground leading-tight">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
