import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertTriangle, CalendarDays, Users, ClipboardCheck, Clock, UserPlus, Inbox, Calendar, ArrowUpRight } from "lucide-react";
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
  const quickActionsList = [
    { label: "Quản lý đăng ký", icon: UserPlus, action: () => navigate("/office/registrations") },
    { label: "Điểm danh", icon: ClipboardCheck, action: () => navigate("/office/attendance") },
    { label: "Xử lý sự cố", icon: AlertTriangle, action: () => navigate("/office/incidents") },
    { label: "Quản lý lớp", icon: BookOpen, action: () => navigate("/office/classes") },
    { label: "Lịch hẹn", icon: Calendar, action: () => navigate("/office/appointments") },
    { label: "Xếp lịch AI", icon: CalendarDays, action: () => navigate("/office/ai-schedule") },
  ];

  const schedulingQueue = [
    { id: "sq1", tutor: "Nguyễn Văn An", className: "Toán 12 - Ôn thi ĐH", testScore: 84, acceptedAt: "03/03/2026 09:10", status: "Chờ xếp lịch" },
    { id: "sq2", tutor: "Võ Minh Tuấn", className: "Lý 11 - Nâng cao", testScore: 78, acceptedAt: "03/03/2026 11:25", status: "Chờ xếp lịch" },
  ];

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý văn phòng</h1>
        <p className="text-muted-foreground text-sm">Nhân viên văn phòng · Hôm nay, 03/03/2026</p>
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Lớp đang học */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{activeClasses}</p>
              <p className="text-xs text-white/80 mt-1">Lớp đang học</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Cảnh báo điểm danh */}
        <Card className="border-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{pendingAttendance}</p>
              <p className="text-xs text-white/80 mt-1">Cảnh báo điểm danh</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Buổi học/tháng */}
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{monthSessions}</p>
              <p className="text-xs text-white/80 mt-1">Buổi học/tháng</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: HS vắng nhiều */}
        <Card className="border-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{frequentAbsent}</p>
              <p className="text-xs text-white/80 mt-1">HS vắng nhiều</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Đăng ký mới */}
        <Card className="border-0 bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{newRegistrations}</p>
              <p className="text-xs text-white/80 mt-1">Đăng ký mới</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Yêu cầu chờ */}
        <Card className="border-0 bg-gradient-to-r from-cyan-500 to-blue-400 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{pendingRequests}</p>
              <p className="text-xs text-white/80 mt-1">Yêu cầu chờ</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Inbox className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>
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
                  n.type === "error" ? "bg-destructive" : n.type === "warning" ? "bg-muted-foreground" : n.type === "success" ? "bg-primary" : "bg-border"
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
          <CardTitle className="text-base">Queue xếp lịch sau khi gia sư đạt test tháng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedulingQueue.map((item) => (
            <div key={item.id} className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.className}</p>
                <p className="text-xs text-muted-foreground">{item.tutor} • Test tháng: {item.testScore}% • Nhận lớp: {item.acceptedAt}</p>
              </div>
              <Button size="sm" onClick={() => navigate("/office/appointments")}>Xếp lịch ngay</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActionsList.map(a => (
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
