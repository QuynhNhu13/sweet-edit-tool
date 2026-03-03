import { useStudent } from "@/contexts/StudentContext";
import { BookOpen, CheckCircle2, Clock, Star, Video, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentClasses = () => {
  const { classes, rateSession } = useStudent();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState<{ sessionId: string; } | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const activeClasses = classes.filter(c => c.status === "active");
  const completedClasses = classes.filter(c => c.status === "completed");
  const detail = selectedClass ? classes.find(c => c.id === selectedClass) : null;

  const handleRate = () => {
    if (ratingModal) {
      rateSession(ratingModal.sessionId, ratingValue, ratingComment);
      setRatingModal(null);
      setRatingValue(5);
      setRatingComment("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setRatingModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Đánh giá buổi học</h3>
            <div className="flex gap-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setRatingValue(v)}>
                  <Star className={cn("w-7 h-7", v <= ratingValue ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                </button>
              ))}
            </div>
            <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Nhận xét..." className="w-full p-3 border border-border rounded-xl text-sm bg-background resize-none h-20 mb-4" />
            <div className="flex gap-2">
              <Button className="flex-1 rounded-xl" onClick={handleRate}>Gửi đánh giá</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setRatingModal(null)}>Hủy</Button>
            </div>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setSelectedClass(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">{detail.name}</h2>
                <p className="text-sm text-muted-foreground">{detail.tutorName} • {detail.schedule}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)}>✕</Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Hoàn thành</p>
                <p className="text-lg font-bold text-foreground">{detail.completedSessions}/{detail.totalSessions}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Hình thức</p>
                <p className="text-sm font-semibold text-foreground">{detail.format === "online" ? "Online" : "Tại nhà"}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Học phí</p>
                <p className="text-sm font-semibold text-foreground">{detail.fee.toLocaleString("vi-VN")}đ</p>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-3">Lịch sử buổi học</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {detail.sessions.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                    s.status === "completed" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                    s.status === "scheduled" ? "bg-primary/10" :
                    "bg-destructive/10"
                  )}>
                    {s.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                     s.status === "scheduled" ? <Clock className="w-4 h-4 text-primary" /> :
                     <span className="text-destructive text-xs">✕</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{s.content || "Buổi học"}</p>
                    <p className="text-[10px] text-muted-foreground">{s.date} • {s.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === "completed" && !s.rating && (
                      <button onClick={() => setRatingModal({ sessionId: s.id })} className="text-xs text-primary font-medium hover:underline">Đánh giá</button>
                    )}
                    {s.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(s.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      </div>
                    )}
                    {s.status === "scheduled" && s.format === "online" && s.meetingLink && (
                      <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(s.meetingLink!)}>Vào lớp</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Classes */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Lớp đang học ({activeClasses.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeClasses.map(c => {
            const nextSession = c.sessions.find(s => s.status === "scheduled");
            return (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-elevated transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <img src={c.tutorAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">{c.name}</h4>
                    <p className="text-xs text-muted-foreground">{c.tutorName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                        {c.format === "online" ? <><Video className="w-3 h-3" /> Online</> : <><MapPin className="w-3 h-3" /> Tại nhà</>}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{c.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">Tiến độ</span>
                    <span className="text-xs font-semibold text-foreground">{c.completedSessions}/{c.totalSessions} buổi</span>
                  </div>
                  <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-2" />
                </div>

                {nextSession && (
                  <div className="p-3 bg-primary/5 rounded-xl mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Buổi tiếp theo</p>
                      <p className="text-xs font-medium text-foreground">{nextSession.date} • {nextSession.time}</p>
                    </div>
                    {nextSession.format === "online" && nextSession.meetingLink && (
                      <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(nextSession.meetingLink!)}>Vào lớp</Button>
                    )}
                  </div>
                )}

                <Button variant="outline" className="w-full rounded-xl text-xs gap-1" size="sm" onClick={() => setSelectedClass(c.id)}>
                  Chi tiết <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã hoàn thành ({completedClasses.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedClasses.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5 opacity-80">
                <div className="flex items-center gap-4">
                  <img src={c.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{c.name}</h4>
                    <p className="text-xs text-muted-foreground">{c.tutorName} • {c.totalSessions} buổi</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">Hoàn thành</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
