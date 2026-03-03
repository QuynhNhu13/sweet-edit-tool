import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertTriangle, CalendarDays, Users, ClipboardCheck, Clock, UserPlus, Inbox, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfficeDashboard = () => {
  const { attendance, incidents, classes, notifications } = useOffice();
  const navigate = useNavigate();

  const activeClasses = classes.filter(c => c.status === "active").length;
  const pendingAttendance = attendance.filter(a => a.status === "pending").length;
  const monthSessions = attendance.filter(a => a.status === "completed").length;
  const frequentAbsent = 2;
  const newRegistrations = 3;
  const pendingRequests = incidents.filter(i => i.status === "pending").length;
  const upcomingSessions = attendance.filter(a => a.status === "upcoming");

  const quickActions = [
    { label: "Quản lý đăng ký", icon: UserPlus, action: () => navigate("/office/registrations") },
    { label: "Điểm danh", icon: ClipboardCheck, action: () => navigate("/office/attendance") },
    { label: "Xử lý sự cố", icon: AlertTriangle, action: () => navigate("/office/incidents") },
    { label: "Quản lý lớp", icon: BookOpen, action: () => navigate("/office/classes") },
    { label: "Lịch hẹn", icon: Calendar, action: () => navigate("/office/appointments") },
    { label: "Xếp lịch AI", icon: CalendarDays, action: () => navigate("/office/ai-schedule") },
  ];

  const stats = [
    { label: "Lớp đang học", value: activeClasses, icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
    { label: "Cảnh báo điểm danh", value: pendingAttendance, icon: AlertTriangle, color: "bg-amber-500/10 text-amber-600" },
    { label: "Buổi học/tháng", value: monthSessions, icon: CalendarDays, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "HS vắng nhiều", value: frequentAbsent, icon: Users, color: "bg-red-500/10 text-red-600" },
    { label: "Đăng ký mới", value: newRegistrations, icon: UserPlus, color: "bg-purple-500/10 text-purple-600" },
    { label: "Yêu cầu chờ", value: pendingRequests, icon: Inbox, color: "bg-orange-500/10 text-orange-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chào mừng trở lại, Trần Minh Tú</h1>
        <p className="text-muted-foreground text-sm">Nhân viên văn phòng • Hôm nay, 03/03/2026</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4" /> Lịch hẹn sắp tới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Không có lịch hẹn sắp tới</p>
            ) : (
              upcomingSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutor} → {s.student}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{s.date}</p>
                    <p className="text-xs text-muted-foreground">{s.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông báo gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  n.type === "error" ? "bg-red-500" : n.type === "warning" ? "bg-amber-500" : n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(a => (
              <Button key={a.label} variant="outline" onClick={a.action} className="h-auto py-4 flex flex-col gap-2 rounded-xl">
                <a.icon className="w-5 h-5" />
                <span className="text-xs">{a.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeDashboard;
