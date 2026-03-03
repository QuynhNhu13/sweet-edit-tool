import { useStudent } from "@/contexts/StudentContext";
import { CalendarDays, Clock, Video, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const StudentSchedule = () => {
  const { classes } = useStudent();
  const navigate = useNavigate();
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const allSessions = classes.flatMap(c =>
    c.sessions.map(s => ({ ...s, className: c.name, tutorName: c.tutorName, tutorAvatar: c.tutorAvatar, subject: c.subject }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = allSessions.filter(s => s.status === "scheduled");
  const completed = allSessions.filter(s => s.status === "completed");
  const totalWeekSessions = upcoming.length;
  const totalWeekHours = upcoming.length * 2;

  // Build timetable grid
  const getSessionsForDayTime = (day: string, time: string) => {
    return allSessions.filter(s => {
      const d = new Date(s.date);
      const dayIndex = d.getDay();
      const dayMap: Record<number, string> = { 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 0: "CN" };
      const sessionStart = s.time.split("-")[0];
      return dayMap[dayIndex] === day && sessionStart === time && s.status === "scheduled";
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buổi học / tuần</p>
            <p className="text-xl font-bold text-foreground">{totalWeekSessions}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tổng giờ học / tuần</p>
            <p className="text-xl font-bold text-foreground">{totalWeekHours}h</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
            <p className="text-xl font-bold text-foreground">{completed.length} buổi</p>
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
                          <div key={s.id} className={cn("p-1.5 rounded-lg text-[10px] font-medium mb-1",
                            s.format === "online" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary/10 text-primary"
                          )}>
                            <p className="truncate">{s.className}</p>
                            <p className="text-[9px] opacity-70">{s.format === "online" ? "🟢 Online" : "📍 Offline"}</p>
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
            <h3 className="text-sm font-semibold text-foreground mb-3">Sắp tới</h3>
            <div className="space-y-2">
              {upcoming.map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <img src={s.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.date} • {s.time}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                    s.format === "online" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary/10 text-primary"
                  )}>
                    {s.format === "online" ? <><Video className="w-3 h-3" /> Online</> : <><MapPin className="w-3 h-3" /> Offline</>}
                  </span>
                  {s.format === "online" && s.meetingLink && (
                    <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(s.meetingLink!)}>Vào lớp</Button>
                  )}
                </div>
              ))}
              {upcoming.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có buổi học sắp tới</p>}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Đã hoàn thành</h3>
            <div className="space-y-2">
              {completed.slice(0, 10).map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 opacity-75">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className} - {s.content || "Buổi học"}</p>
                    <p className="text-xs text-muted-foreground">{s.date} • {s.time}</p>
                  </div>
                  {s.rating && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(s.rating)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
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
