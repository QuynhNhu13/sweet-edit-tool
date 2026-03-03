import { useStudent } from "@/contexts/StudentContext";
import { CalendarDays, Clock, Video, MapPin, CheckCircle2, X as XIcon, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const timeSlots = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const getWeekRange = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
};

const formatWeekLabel = (monday: Date, sunday: Date) => {
  const fmt = (d: Date) => `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  return `${fmt(monday)} - ${fmt(sunday)}/${sunday.getFullYear()}`;
};

const StudentSchedule = () => {
  const { classes } = useStudent();
  const navigate = useNavigate();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeek = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    return getWeekRange(now);
  }, [weekOffset]);

  const allSessions = classes.flatMap(c =>
    c.sessions.map(s => ({ ...s, className: c.name, tutorName: c.tutorName, tutorAvatar: c.tutorAvatar, subject: c.subject }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  const weekSessions = useMemo(() => {
    return allSessions.filter(s => {
      const d = new Date(s.date);
      return d >= currentWeek.monday && d <= currentWeek.sunday;
    });
  }, [allSessions, currentWeek]);

  const upcoming = allSessions.filter(s => s.status === "scheduled");
  const completed = allSessions.filter(s => s.status === "completed");
  const missed = allSessions.filter(s => s.status === "missed");
  const totalWeekSessions = weekSessions.filter(s => s.status === "scheduled").length;
  const totalWeekHours = weekSessions.length * 2;
  const attendanceRate = completed.length + missed.length > 0 ? Math.round((completed.length / (completed.length + missed.length)) * 100) : 100;

  const getSessionsForDayTime = (day: string, time: string) => {
    return weekSessions.filter(s => {
      const d = new Date(s.date);
      const dayIndex = d.getDay();
      const dayMap: Record<number, string> = { 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 0: "CN" };
      const sessionStart = s.time.split("-")[0];
      return dayMap[dayIndex] === day && sessionStart === time;
    });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Hoàn thành";
      case "missed": return "Vắng";
      case "cancelled": return "Hủy";
      default: return "Sắp tới";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-muted text-foreground";
      case "missed": return "bg-destructive/10 text-destructive";
      case "cancelled": return "bg-muted text-muted-foreground";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buổi sắp tới</p>
            <p className="text-xl font-bold text-foreground">{totalWeekSessions}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Clock className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tổng giờ sắp tới</p>
            <p className="text-xl font-bold text-foreground">{totalWeekHours}h</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
            <p className="text-xl font-bold text-foreground">{completed.length} buổi</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <XIcon className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vắng mặt</p>
            <p className="text-xl font-bold text-foreground">{missed.length} buổi</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Star className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tỷ lệ chuyên cần</p>
            <p className="text-xl font-bold text-foreground">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button variant={view === "calendar" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setView("calendar")}>Thời khóa biểu</Button>
        <Button variant={view === "list" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setView("list")}>Danh sách</Button>
      </div>

      {view === "calendar" ? (
        <div className="bg-card border border-border rounded-2xl p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(o => o - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{formatWeekLabel(currentWeek.monday, currentWeek.sunday)}</p>
              {weekOffset !== 0 && <button className="text-xs text-primary hover:underline mt-1" onClick={() => setWeekOffset(0)}>Về tuần hiện tại</button>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(o => o + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-[10px] text-muted-foreground font-medium p-2 text-left w-16">Giờ</th>
                {daysOfWeek.map(d => <th key={d} className="text-[10px] text-muted-foreground font-medium p-2 text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-t border-border/50">
                  <td className="text-[10px] text-muted-foreground p-2 font-mono">{time}</td>
                  {daysOfWeek.map(day => {
                    const sessions = getSessionsForDayTime(day, time);
                    return (
                      <td key={day} className="p-1 text-center">
                        {sessions.map(s => (
                          <div key={s.id} className={cn("p-1.5 rounded-lg text-[10px] font-medium mb-1 border",
                            s.status === "completed" ? "bg-muted border-border text-foreground" :
                            s.status === "missed" ? "bg-destructive/5 border-destructive/20 text-destructive" :
                            "bg-primary/5 border-primary/20 text-foreground"
                          )}>
                            <p className="truncate font-semibold">{s.className}</p>
                            <p className="text-[9px] text-muted-foreground">{s.tutorName}</p>
                            <p className="text-[9px] text-muted-foreground">{s.format === "online" ? "Online" : "Offline"} • {statusLabel(s.status)}</p>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Sắp tới ({upcoming.length})</h3>
            <div className="space-y-2">
              {upcoming.map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <img src={s.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.date} • {s.time}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", statusColor(s.status))}>
                    {s.format === "online" ? "Online" : "Offline"}
                  </Badge>
                  {s.format === "online" && s.meetingLink && (
                    <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(s.meetingLink!)}>Vào lớp</Button>
                  )}
                </div>
              ))}
              {upcoming.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có buổi học sắp tới</p>}
            </div>
          </div>

          {/* Completed & Missed */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Đã hoàn thành / Vắng</h3>
            <div className="space-y-2">
              {[...completed, ...missed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15).map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <img src={s.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className} {s.content ? `- ${s.content}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.date} • {s.time}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", statusColor(s.status))}>
                    {statusLabel(s.status)}
                  </Badge>
                  {s.rating && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(s.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current text-foreground" />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;
