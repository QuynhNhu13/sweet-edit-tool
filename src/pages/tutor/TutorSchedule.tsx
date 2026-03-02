import { useTutor } from "@/contexts/TutorContext";
import { CalendarDays, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const dayOrder = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const TutorSchedule = () => {
  const { profile, classes } = useTutor();

  // All upcoming sessions sorted
  const allSessions = classes.flatMap(c =>
    c.sessions.map(s => ({ ...s, className: c.name, studentName: c.studentName, studentAvatar: c.studentAvatar }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = allSessions.filter(s => s.status === "scheduled");
  const completed = allSessions.filter(s => s.status === "completed").slice(-10).reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Availability Grid */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" /> Lịch rảnh của bạn
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {profile.availability.map(av => (
            <div key={av.day} className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs font-semibold text-foreground mb-2">{av.day}</p>
              {av.slots.map(slot => (
                <span key={slot} className="block text-[11px] text-primary font-medium bg-primary/10 rounded-lg px-2 py-1 mb-1">{slot}</span>
              ))}
            </div>
          ))}
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
                <div key={s.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.date} • {s.time}</p>
                  </div>
                  <img src={s.studentAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent completed */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Buổi đã hoàn thành
          </h3>
          <div className="space-y-2">
            {completed.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{s.className} — {s.content || "N/A"}</p>
                  <p className="text-[11px] text-muted-foreground">{s.date} • {s.startedAt}-{s.endedAt}</p>
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
    </div>
  );
};

export default TutorSchedule;
