import { useTutor } from "@/contexts/TutorContext";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, BookOpen, Clock, CheckCircle2, Play, Square, Users, Wallet, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TutorClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, startSession, endSession } = useTutor();
  const cls = classes.find(c => c.id === classId);

  const [sessionDialog, setSessionDialog] = useState<{ sessionId: string; mode: "start" | "end" } | null>(null);
  const [endForm, setEndForm] = useState({ content: "", notes: "", homework: "" });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  if (!cls) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">Không tìm thấy lớp học</p>
      <button onClick={() => navigate("/tutor/classes")} className="mt-4 text-primary text-sm">← Quay lại</button>
    </div>
  );

  const completedSessions = cls.sessions.filter(s => s.status === "completed");
  const scheduledSessions = cls.sessions.filter(s => s.status === "scheduled");
  const attendanceRate = cls.sessions.length > 0 ? Math.round((completedSessions.length / (completedSessions.length + cls.sessions.filter(s => s.status === "missed").length || completedSessions.length)) * 100) : 0;
  const sessionDetail = selectedSession ? cls.sessions.find(s => s.id === selectedSession) : null;

  const handleStart = () => {
    if (!sessionDialog) return;
    startSession(sessionDialog.sessionId, cls.id);
    toast.success("Đã bắt đầu buổi học!");
    setSessionDialog(null);
  };

  const handleEnd = () => {
    if (!sessionDialog) return;
    endSession(sessionDialog.sessionId, cls.id, endForm.content, endForm.notes, endForm.homework);
    toast.success("Đã hoàn thành buổi học!");
    setSessionDialog(null);
    setEndForm({ content: "", notes: "", homework: "" });
  };

  const escrowPct = cls.escrowAmount > 0 ? Math.round((cls.escrowReleased / cls.escrowAmount) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/tutor/classes")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{cls.name}</h2>
          <p className="text-sm text-muted-foreground">{cls.subject} • {cls.format} • {cls.schedule}</p>
        </div>
        <span className={cn("text-xs font-medium px-3 py-1.5 rounded-lg",
          cls.escrowStatus === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          cls.escrowStatus === "in_progress" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"
        )}>
          {cls.escrowStatus === "completed" ? "Hoàn thành" : cls.escrowStatus === "in_progress" ? "Đang học" : "Chờ bắt đầu"}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{cls.completedSessions}/{cls.totalSessions}</p>
          <p className="text-xs text-muted-foreground">Buổi hoàn thành</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
          <p className="text-xs text-muted-foreground">Chuyên cần</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Wallet className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-600">{escrowPct}%</p>
          <p className="text-xs text-muted-foreground">Giải ngân</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{cls.studentName}</p>
          <p className="text-xs text-muted-foreground">PH: {cls.parentName}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Tiến độ</h3>
          <span className="text-xs text-muted-foreground">{Math.round((cls.completedSessions / cls.totalSessions) * 100)}%</span>
        </div>
        <Progress value={(cls.completedSessions / cls.totalSessions) * 100} className="h-3 mb-3" />
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground">{cls.escrowAmount.toLocaleString("vi-VN")}đ</p>
            <p className="text-muted-foreground">Tổng Escrow</p>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="font-semibold text-emerald-600">{cls.escrowReleased.toLocaleString("vi-VN")}đ</p>
            <p className="text-muted-foreground">Đã giải ngân</p>
          </div>
          <div className="p-2 bg-primary/5 rounded-lg">
            <p className="font-semibold text-primary">{(cls.escrowAmount - cls.escrowReleased).toLocaleString("vi-VN")}đ</p>
            <p className="text-muted-foreground">Còn giữ</p>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <Tabs defaultValue="all">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">Tất cả ({cls.sessions.length})</TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-lg">Sắp tới ({scheduledSessions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg">Đã xong ({completedSessions.length})</TabsTrigger>
        </TabsList>

        {["all", "scheduled", "completed"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {cls.sessions
              .filter(s => tab === "all" ? true : s.status === tab)
              .map((s, i) => (
              <div key={s.id} className={cn("p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all",
                s.status === "scheduled" ? "border-primary/20 bg-primary/5" : "border-border bg-card"
              )} onClick={() => setSelectedSession(s.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      s.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-primary/10 text-primary"
                    )}>
                      {cls.sessions.indexOf(s) + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.date} • {s.time}</p>
                      {s.content && <p className="text-xs text-muted-foreground">{s.content}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.rating && (
                      <div className="flex items-center gap-0.5">{[...Array(s.rating)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}</div>
                    )}
                    {s.status === "scheduled" && (
                      <button onClick={e => { e.stopPropagation(); setSessionDialog({ sessionId: s.id, mode: "start" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                        <Play className="w-3 h-3" /> Bắt đầu
                      </button>
                    )}
                    {s.status === "completed" && s.startedAt && !s.endedAt && (
                      <button onClick={e => { e.stopPropagation(); setSessionDialog({ sessionId: s.id, mode: "end" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium">
                        <Square className="w-3 h-3" /> Hoàn thành
                      </button>
                    )}
                    {s.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-md">
          {sessionDetail && (
            <>
              <DialogHeader><DialogTitle>Buổi {cls.sessions.indexOf(sessionDetail) + 1} - {sessionDetail.date}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Thời gian</span><span className="font-medium">{sessionDetail.time}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Trạng thái</span><span className="font-medium">{sessionDetail.status === "completed" ? "Hoàn thành" : "Đã lên lịch"}</span></div>
                  {sessionDetail.startedAt && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Bắt đầu</span><span className="font-medium">{sessionDetail.startedAt}</span></div>}
                  {sessionDetail.endedAt && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Kết thúc</span><span className="font-medium">{sessionDetail.endedAt}</span></div>}
                </div>
                {sessionDetail.content && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nội dung</span><p className="text-sm">{sessionDetail.content}</p></div>}
                {sessionDetail.notes && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nhận xét</span><p className="text-sm">{sessionDetail.notes}</p></div>}
                {sessionDetail.homework && <div className="p-3 bg-primary/5 rounded-xl border border-primary/10"><span className="text-xs text-muted-foreground block mb-1">Bài tập về nhà</span><p className="text-sm font-medium">{sessionDetail.homework}</p></div>}
                {sessionDetail.rating && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_, i) => <span key={i} className={cn("text-sm", i < sessionDetail.rating! ? "text-amber-400" : "text-muted-foreground/30")}>★</span>)}</div>
                    {sessionDetail.ratingComment && <p className="text-xs text-muted-foreground">{sessionDetail.ratingComment}</p>}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Start/End Session Dialog */}
      <Dialog open={!!sessionDialog} onOpenChange={() => setSessionDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{sessionDialog?.mode === "start" ? "Bắt đầu buổi học" : "Xác nhận hoàn thành"}</DialogTitle></DialogHeader>
          {sessionDialog?.mode === "start" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Hệ thống sẽ ghi nhận thời gian bắt đầu. Điểm danh sẽ được cập nhật.</p>
              <button onClick={handleStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">Xác nhận bắt đầu</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-foreground">Nội dung đã dạy *</label><input value={endForm.content} onChange={e => setEndForm(p => ({ ...p, content: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /></div>
              <div><label className="text-xs font-medium text-foreground">Nhận xét</label><textarea value={endForm.notes} onChange={e => setEndForm(p => ({ ...p, notes: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-20 resize-none" /></div>
              <div><label className="text-xs font-medium text-foreground">Bài tập về nhà</label><input value={endForm.homework} onChange={e => setEndForm(p => ({ ...p, homework: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /></div>
              <button onClick={handleEnd} disabled={!endForm.content} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">Hoàn thành buổi học</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorClassDetail;
