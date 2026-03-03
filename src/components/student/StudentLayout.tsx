import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Search, CalendarDays, Clock, ClipboardCheck,
  FileText, BarChart3, Trophy, UserCircle, LogOut, PanelLeftClose, PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudent } from "@/contexts/StudentContext";
import EduLogo from "@/components/EduLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

const navItems = [
  { to: "/student", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/student/find-tutor", icon: Search, label: "Tìm gia sư" },
  { to: "/student/classes", icon: BookOpen, label: "Lớp học" },
  { to: "/student/schedule", icon: CalendarDays, label: "Lịch học" },
  { to: "/student/availability", icon: Clock, label: "Khung giờ rảnh" },
  { to: "/student/tests", icon: ClipboardCheck, label: "Bài kiểm tra" },
  { to: "/student/mock-exam", icon: FileText, label: "Thi thử" },
  { to: "/student/results", icon: Trophy, label: "Kết quả" },
  { to: "/student/report", icon: BarChart3, label: "Báo cáo" },
];

const pageTitles: Record<string, string> = {
  "/student": "Tổng quan",
  "/student/find-tutor": "Tìm gia sư",
  "/student/classes": "Lớp học của tôi",
  "/student/schedule": "Lịch học",
  "/student/availability": "Khung giờ rảnh",
  "/student/tests": "Bài kiểm tra",
  "/student/mock-exam": "Thi thử",
  "/student/results": "Kết quả thi",
  "/student/report": "Báo cáo học tập",
};

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useStudent();
  const [collapsed, setCollapsed] = useState(false);

  const currentTitle = pageTitles[location.pathname] || "Học sinh";

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <aside className={cn("bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]")}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <EduLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground leading-tight truncate">EduConnect</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">Học sinh</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground", collapsed ? "mx-auto" : "ml-auto")}
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
                  "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 relative",
                  collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{currentTitle}</h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="pl-3 border-l border-border flex items-center gap-3">
              <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{profile.name}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{profile.grade}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
