import { useTutor } from "@/contexts/TutorContext";
import { BookOpen, Clock, CheckCircle2, Play, Square, FileText, MessageSquare, ChevronRight, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const escrowColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  refunded: "bg-destructive/10 text-destructive",
};

const escrowLabels: Record<string, string> = {
  pending: "Chờ bắt đầu",
  in_progress: "Đang học",
  completed: "Hoàn thành",
  refunded: "Đã hoàn tiền",
};

const TutorClasses = () => {
  const { classes, trials, confirmTrial, rejectTrial, startSession, endSession } = useTutor();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sessionDialog, setSessionDialog] = useState<{ sessionId: string; classId: string; mode: "start" | "end" } | null>(null);
  const [endForm, setEndForm] = useState({ content: "", notes: "", homework: "" });

  const cls = selectedClass ? classes.find(c => c.id === selectedClass) : null;

  const handleStart = () => {
    if (!sessionDialog) return;
    startSession(sessionDialog.sessionId, sessionDialog.classId);
    toast.success("Đã bắt đầu buổi học!");
    setSessionDialog(null);
  };

  const handleEnd = () => {
    if (!sessionDialog) return;
    endSession(sessionDialog.sessionId, sessionDialog.classId, endForm.content, endForm.notes, endForm.homework);
    toast.success("Đã hoàn thành buổi học! Escrow cập nhật.");
    setSessionDialog(null);
    setEndForm({ content: "", notes: "", homework: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Trial Bookings */}
      {trials.filter(t => t.status === "pending" || t.status === "confirmed").length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Yêu cầu học thử</h3>
          <div className="space-y-3">
            {trials.filter(t => t.status === "pending" || t.status === "confirmed").map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <img src={t.parentAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t.studentName} ({t.subject})</p>
                  <p className="text-xs text-muted-foreground">Phụ huynh: {t.parentName} • {t.requestedDate} {t.requestedTime}</p>
                </div>
                {t.status === "pending" ? (
                  <div className="flex gap-2">
                    <button onClick={() => { confirmTrial(t.id); toast.success("Đã xác nhận!"); }} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"><UserCheck className="w-3 h-3" /> Xác nhận</button>
                    <button onClick={() => { rejectTrial(t.id); toast.info("Đã từ chối"); }} className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-destructive/10 hover:text-destructive"><UserX className="w-3 h-3" /> Từ chối</button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded-lg">Đã xác nhận</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {classes.map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c.id)} className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-elevated transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.subject} • {c.format}</p>
              </div>
              <span className={cn("text-[11px] font-medium px-2 py-1 rounded-lg", escrowColors[c.escrowStatus])}>
                {escrowLabels[c.escrowStatus]}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img src={c.studentAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-sm text-foreground">{c.studentName}</p>
                <p className="text-[11px] text-muted-foreground">PH: {c.parentName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.completedSessions}/{c.totalSessions} buổi</span>
              <span>{c.fee.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${(c.completedSessions / c.totalSessions) * 100}%` }} />
            </div>
            {/* Escrow bar */}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>Escrow:</span>
              <div className="flex-1 bg-muted rounded-full h-1">
                <div className="bg-emerald-500 rounded-full h-1 transition-all" style={{ width: `${(c.escrowReleased / c.escrowAmount) * 100}%` }} />
              </div>
              <span>{Math.round((c.escrowReleased / c.escrowAmount) * 100)}%</span>
            </div>
          </button>
        ))}
      </div>

      {/* Class Detail Dialog */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {cls && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{cls.name}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="sessions">
                <TabsList className="mb-4">
                  <TabsTrigger value="sessions">Buổi học & Điểm danh</TabsTrigger>
                  <TabsTrigger value="escrow">Escrow</TabsTrigger>
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                </TabsList>

                <TabsContent value="sessions" className="space-y-3">
                  {cls.sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Chưa có buổi học nào</p>
                  ) : cls.sessions.map(s => (
                    <div key={s.id} className={cn("p-4 rounded-xl border", s.status === "scheduled" ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30")}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {s.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-primary" />}
                          <span className="text-sm font-medium text-foreground">{s.date} • {s.time}</span>
                        </div>
                        {s.status === "scheduled" && (
                          <button
                            onClick={() => setSessionDialog({ sessionId: s.id, classId: cls.id, mode: "start" })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                          >
                            <Play className="w-3 h-3" /> Bắt đầu buổi học
                          </button>
                        )}
                        {s.status === "completed" && s.startedAt && !s.endedAt && (
                          <button
                            onClick={() => setSessionDialog({ sessionId: s.id, classId: cls.id, mode: "end" })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium"
                          >
                            <Square className="w-3 h-3" /> Xác nhận hoàn thành
                          </button>
                        )}
                      </div>
                      {s.content && (
                        <div className="mt-2 text-xs space-y-1">
                          <p><span className="font-medium text-foreground">Nội dung:</span> <span className="text-muted-foreground">{s.content}</span></p>
                          {s.notes && <p><span className="font-medium text-foreground">Nhận xét:</span> <span className="text-muted-foreground">{s.notes}</span></p>}
                          {s.homework && <p><span className="font-medium text-foreground">BTVN:</span> <span className="text-muted-foreground">{s.homework}</span></p>}
                          {s.startedAt && <p className="text-muted-foreground/70">Thời gian: {s.startedAt} - {s.endedAt || "..."}</p>}
                        </div>
                      )}
                      {s.rating && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < s.rating! ? "text-amber-400" : "text-muted-foreground/30"}>★</span>
                          ))}
                          <span className="text-muted-foreground ml-1">{s.ratingComment}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="escrow">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 bg-muted/50 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground">Tổng escrow</p>
                        <p className="text-lg font-bold text-foreground">{cls.escrowAmount.toLocaleString("vi-VN")}đ</p>
                      </div>
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground">Đã giải ngân</p>
                        <p className="text-lg font-bold text-emerald-600">{cls.escrowReleased.toLocaleString("vi-VN")}đ</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground">Còn giữ</p>
                        <p className="text-lg font-bold text-primary">{(cls.escrowAmount - cls.escrowReleased).toLocaleString("vi-VN")}đ</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Tiến độ giải ngân (mỗi {cls.releaseMilestone} buổi)</p>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-emerald-500 rounded-full h-3 transition-all flex items-center justify-end pr-1" style={{ width: `${(cls.escrowReleased / cls.escrowAmount) * 100}%` }}>
                          {cls.escrowReleased > 0 && <span className="text-[8px] text-white font-bold">{Math.round((cls.escrowReleased / cls.escrowAmount) * 100)}%</span>}
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>0 buổi</span>
                        <span>{cls.completedSessions}/{cls.totalSessions} buổi</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      "Tiền được giữ an toàn trong hệ thống Escrow cho đến khi hoàn thành đủ buổi theo mốc."
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="info">
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Học sinh</span><span className="font-medium">{cls.studentName}</span></div>
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Phụ huynh</span><span className="font-medium">{cls.parentName}</span></div>
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Lịch học</span><span className="font-medium">{cls.schedule}</span></div>
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Hình thức</span><span className="font-medium capitalize">{cls.format}</span></div>
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Học phí</span><span className="font-medium">{cls.fee.toLocaleString("vi-VN")}đ</span></div>
                      <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Ngày tạo</span><span className="font-medium">{cls.createdAt}</span></div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Start/End Session Dialog */}
      <Dialog open={!!sessionDialog} onOpenChange={() => setSessionDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{sessionDialog?.mode === "start" ? "Bắt đầu buổi học" : "Xác nhận hoàn thành"}</DialogTitle>
          </DialogHeader>
          {sessionDialog?.mode === "start" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Hệ thống sẽ ghi nhận thời gian bắt đầu buổi học. Điểm danh sẽ được cập nhật.</p>
              <button onClick={handleStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">Xác nhận bắt đầu</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground">Nội dung đã dạy *</label>
                <input value={endForm.content} onChange={e => setEndForm(p => ({ ...p, content: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="VD: Đạo hàm nâng cao" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Nhận xét</label>
                <textarea value={endForm.notes} onChange={e => setEndForm(p => ({ ...p, notes: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-20 resize-none" placeholder="Nhận xét về buổi học" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Bài tập về nhà</label>
                <input value={endForm.homework} onChange={e => setEndForm(p => ({ ...p, homework: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="VD: Bài 1-5 trang 45" />
              </div>
              <button onClick={handleEnd} disabled={!endForm.content} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">Hoàn thành buổi học</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorClasses;
