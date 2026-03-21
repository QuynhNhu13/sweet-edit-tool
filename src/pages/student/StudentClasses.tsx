import { useStudent } from "@/contexts/StudentContext";
import { BookOpen, CheckCircle2, Clock, Star, Video, MapPin, ChevronRight, Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentClasses = () => {
  const { classes, rateSession } = useStudent();
  const navigate = useNavigate();
  const [ratingModal, setRatingModal] = useState<{ sessionId: string } | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = classes.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.tutorName.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeClasses = filtered.filter(c => c.status === "active");
  const completedClasses = filtered.filter(c => c.status === "completed");

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
      {/* Search & Filter */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm lớp học, gia sư, môn..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "completed"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {s === "all" ? "Tất cả" : s === "active" ? "Đang học" : "Hoàn thành"}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setRatingModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Đánh giá buổi học</h3>
            <div className="flex gap-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setRatingValue(v)}>
                  <Star className={cn("w-7 h-7", v <= ratingValue ? "fill-current text-foreground" : "text-muted-foreground/30")} />
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

      {/* Active Classes */}
      {activeClasses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" /> Lớp đang học ({activeClasses.length})
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
                    <div className="p-3 bg-muted/50 rounded-xl mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Buổi tiếp theo</p>
                        <p className="text-xs font-medium text-foreground">{nextSession.date} • {nextSession.time}</p>
                      </div>
                      {nextSession.format === "online" && nextSession.meetingLink && (
                        <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(nextSession.meetingLink!)}>Vào lớp</Button>
                      )}
                    </div>
                  )}

                  <Button variant="outline" className="w-full rounded-xl text-xs gap-1" size="sm" onClick={() => navigate(`/student/classes/${c.id}`)}>
                    Chi tiết <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Đã hoàn thành ({completedClasses.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedClasses.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <img src={c.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{c.name}</h4>
                    <p className="text-xs text-muted-foreground">{c.tutorName} • {c.totalSessions} buổi</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Hoàn thành</Badge>
                </div>
                 <Button variant="outline" className="w-full rounded-xl text-xs gap-1 mt-3" size="sm" onClick={() => navigate(`/student/classes/${c.id}`)}>
                  Chi tiết <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">Không tìm thấy lớp học nào</p>}
    </div>
  );
};

export default StudentClasses;
