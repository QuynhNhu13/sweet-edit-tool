import { useTutor } from "@/contexts/TutorContext";
import { CalendarDays, Clock, CheckCircle2, Edit2, X, Save, Eye, Monitor, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const allDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const timeSlots = ["7:00-9:00", "9:00-11:00", "14:00-16:00", "17:00-19:00", "19:00-21:00"];

const TutorSchedule = () => {
  const { profile, classes, updateAvailability } = useTutor();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editAvail, setEditAvail] = useState(profile.availability);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const allSessions = classes.flatMap(c =>
    c.sessions.map(s => ({ ...s, className: c.name, studentName: c.studentName, studentAvatar: c.studentAvatar, subject: c.subject, classFormat: c.format }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = allSessions.filter(s => s.status === "scheduled" || s.status === "in_progress");
  const completed = allSessions.filter(s => s.status === "completed").slice(-10).reverse();

  const toggleSlot = (day: string, slot: string) => {
    setEditAvail(prev => {
      const dayEntry = prev.find(a => a.day === day);
      if (dayEntry) {
        const hasSlot = dayEntry.slots.includes(slot);
        return prev.map(a => a.day === day ? { ...a, slots: hasSlot ? a.slots.filter(s => s !== slot) : [...a.slots, slot] } : a);
      }
      return [...prev, { day, slots: [slot] }];
    });
  };

  const saveAvailability = () => {
    updateAvailability(editAvail.filter(a => a.slots.length > 0));
    setEditMode(false);
    toast.success("Đã cập nhật lịch rảnh!");
  };

  const isSlotAvailable = (day: string, slot: string) => {
    const source = editMode ? editAvail : profile.availability;
    return source.find(a => a.day === day)?.slots.includes(slot) || false;
  };

  const getSessionsForDayTime = (day: string, time: string) => {
    return upcoming.filter(s => {
      const sessionDate = new Date(s.date);
      const dayOfWeek = sessionDate.getDay();
      const dayMap: Record<string, number> = { "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6, "Chủ nhật": 0 };
      return dayMap[day] === dayOfWeek && s.time === time;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Timetable */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> Thời khóa biểu & Lịch rảnh
          </h3>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button onClick={saveAvailability} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"><Save className="w-3 h-3" /> Lưu</button>
                <button onClick={() => { setEditMode(false); setEditAvail(profile.availability); }} className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium"><X className="w-3 h-3" /> Hủy</button>
              </>
            ) : (
              <button onClick={() => { setEditMode(true); setEditAvail(profile.availability); }} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium"><Edit2 className="w-3 h-3" /> Chỉnh sửa</button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-[11px] text-muted-foreground font-medium p-2 text-left w-24">Giờ</th>
                {allDays.map(day => <th key={day} className="text-[11px] text-muted-foreground font-medium p-2 text-center">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-t border-border/50">
                  <td className="text-[11px] text-muted-foreground p-2 font-medium">{time}</td>
                  {allDays.map(day => {
                    const available = isSlotAvailable(day, time);
                    const sessions = getSessionsForDayTime(day, time);
                    return (
                      <td key={day} className="p-1 text-center">
                        {editMode ? (
                          <button onClick={() => toggleSlot(day, time)} className={cn("w-full h-12 rounded-lg text-[10px] font-medium transition-all", available ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/30 text-muted-foreground/50 border border-transparent hover:border-primary/20")}>
                            {available ? "✓" : "+"}
                          </button>
                        ) : sessions.length > 0 ? (
                          <button onClick={() => setSelectedSession(sessions[0])} className="w-full p-1.5 bg-primary/10 border border-primary/20 rounded-lg text-left">
                            <p className="text-[10px] font-medium text-primary truncate">{sessions[0].className}</p>
                            <p className="text-[9px] text-muted-foreground truncate">{sessions[0].studentName}</p>
                            <span className={cn("text-[8px] px-1 py-0.5 rounded mt-0.5 inline-flex items-center gap-0.5",
                              sessions[0].format === "online" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {sessions[0].format === "online" ? <Monitor className="w-2 h-2" /> : <MapPin className="w-2 h-2" />}
                              {sessions[0].format === "online" ? "ONL" : "OFF"}
                            </span>
                          </button>
                        ) : available ? (
                          <div className="w-full h-12 rounded-lg bg-success/15 dark:bg-emerald-900/10 border border-success/30/50 dark:border-success/40/50 flex items-center justify-center">
                            <span className="text-[10px] text-success">Rảnh</span>
                          </div>
                        ) : (
                          <div className="w-full h-12" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/20 border border-primary/30" /> Rảnh</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/10 border border-primary/20" /> Có lớp</span>
          <span className="flex items-center gap-1"><Monitor className="w-3 h-3 text-primary" /> Online</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground" /> Offline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Buổi học sắp tới ({upcoming.length})
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Không có buổi nào sắp tới</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(s => (
                <div key={s.id} className="w-full flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.date} • {s.time}</p>
                  </div>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
                    s.format === "online" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {s.format === "online" ? <Monitor className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                    {s.format === "online" ? "ONL" : "OFF"}
                  </span>
                  <button onClick={() => setSelectedSession(s)} className="p-1"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Buổi đã hoàn thành
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Lớp</th>
                  <th className="text-left py-2 text-muted-foreground">Ngày</th>
                  <th className="text-left py-2 text-muted-foreground">Giờ</th>
                  <th className="text-left py-2 text-muted-foreground">Hình thức</th>
                  <th className="text-left py-2 text-muted-foreground">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedSession(s)}>
                    <td className="py-2 text-foreground">{s.className}</td>
                    <td className="py-2 text-muted-foreground">{s.date}</td>
                    <td className="py-2 text-muted-foreground">{s.startedAt}-{s.endedAt}</td>
                    <td className="py-2 text-muted-foreground">{s.format === "online" ? "Online" : "Offline"}</td>
                    <td className="py-2 text-foreground">{s.rating ? `${s.rating}/5` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-md">
          {selectedSession && (
            <>
              <DialogHeader><DialogTitle>{selectedSession.className}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Ngày</span><span className="font-medium">{selectedSession.date}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Giờ</span><span className="font-medium">{selectedSession.time}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Học sinh</span><span className="font-medium">{selectedSession.studentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Hình thức</span><span className="font-medium flex items-center gap-1">
                    {selectedSession.format === "online" ? <><Monitor className="w-3 h-3 text-primary" /> Online</> : <><MapPin className="w-3 h-3" /> Offline</>}
                  </span></div>
                </div>
                {selectedSession.content && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nội dung</span><p className="text-sm">{selectedSession.content}</p></div>}
                {selectedSession.notes && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nhận xét</span><p className="text-sm">{selectedSession.notes}</p></div>}
                {selectedSession.homework && <div className="p-3 bg-primary/5 rounded-xl border border-primary/10"><span className="text-xs text-muted-foreground block mb-1">BTVN</span><p className="text-sm font-medium">{selectedSession.homework}</p></div>}
                {selectedSession.format === "online" && selectedSession.meetingLink && selectedSession.status === "scheduled" && (
                  <button onClick={() => { setSelectedSession(null); navigate(`/tutor/classes/${classes.find(c => c.sessions.some(ss => ss.id === selectedSession.id))?.id || ""}`); }} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" /> Vào phòng họp online
                  </button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorSchedule;
