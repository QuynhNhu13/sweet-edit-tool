import { useTutor } from "@/contexts/TutorContext";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, BookOpen, Clock, CheckCircle2, Play, Square, Users, Wallet, Upload, FileText, Plus, Trash2, AlertTriangle, Monitor, MapPin, ExternalLink, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TutorClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, startSession, endSession, confirmSessionByParent, requestAbsence, addMaterial, removeMaterial } = useTutor();
  const cls = classes.find(c => c.id === classId);

  const [sessionDialog, setSessionDialog] = useState<{ sessionId: string; mode: "start" | "end" | "absence" } | null>(null);
  const [endForm, setEndForm] = useState({ content: "", notes: "", homework: "" });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [materialDialog, setMaterialDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", type: "pdf" as "pdf" | "doc" | "image" | "video" | "link", url: "" });

  if (!cls) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">Không tìm thấy lớp học</p>
      <button onClick={() => navigate("/tutor/classes")} className="mt-4 text-primary text-sm">← Quay lại</button>
    </div>
  );

  const completedSessions = cls.sessions.filter(s => s.status === "completed");
  const scheduledSessions = cls.sessions.filter(s => s.status === "scheduled");
  const inProgressSessions = cls.sessions.filter(s => s.status === "in_progress");
  const pendingConfirmSessions = cls.sessions.filter(s => s.status === "pending_confirm");
  const attendanceRate = cls.sessions.length > 0 ? Math.round((completedSessions.length / Math.max(1, completedSessions.length + cls.sessions.filter(s => s.status === "missed").length)) * 100) : 0;
  const sessionDetail = selectedSession ? cls.sessions.find(s => s.id === selectedSession) : null;
  const escrowPct = cls.escrowAmount > 0 ? Math.round((cls.escrowReleased / cls.escrowAmount) * 100) : 0;

  const handleStart = () => {
    if (!sessionDialog) return;
    startSession(sessionDialog.sessionId, cls.id);
    toast.success("Đã bắt đầu buổi học!");
    setSessionDialog(null);
  };

  const handleEnd = () => {
    if (!sessionDialog) return;
    endSession(sessionDialog.sessionId, cls.id, endForm.content, endForm.notes, endForm.homework, uploadedFiles);
    toast.success("Đã gửi yêu cầu xác nhận hoàn thành đến phụ huynh!");
    setSessionDialog(null);
    setEndForm({ content: "", notes: "", homework: "" });
    setUploadedFiles([]);
  };

  const handleConfirm = (sessionId: string) => {
    confirmSessionByParent(sessionId, cls.id);
    toast.success("Phụ huynh đã xác nhận! Buổi học hoàn thành.");
  };

  const handleAbsence = () => {
    if (!sessionDialog || !absenceReason) return;
    requestAbsence(sessionDialog.sessionId, cls.id, absenceReason, "tutor");
    toast.info("Đã gửi yêu cầu báo vắng, chờ phụ huynh xác nhận.");
    setSessionDialog(null);
    setAbsenceReason("");
  };

  const handleFileUpload = () => {
    const fakeFile = `baitap_${Date.now()}.pdf`;
    setUploadedFiles(prev => [...prev, fakeFile]);
    toast.success(`Đã tải lên: ${fakeFile}`);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name) return;
    addMaterial(cls.id, {
      id: `mat_${Date.now()}`,
      name: newMaterial.name,
      type: newMaterial.type,
      url: newMaterial.url || "#",
      uploadedAt: new Date().toISOString().slice(0, 10),
      size: "1.2 MB",
    });
    setNewMaterial({ name: "", type: "pdf", url: "" });
    setMaterialDialog(false);
    toast.success("Đã thêm tài liệu!");
  };

  const typeIcons: Record<string, string> = { pdf: "📄", doc: "📝", image: "🖼️", video: "🎬", link: "🔗" };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/tutor/classes")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{cls.name}</h2>
          <p className="text-sm text-muted-foreground">{cls.subject} • {cls.format === "online" ? "Online" : cls.format === "offline" ? "Offline" : "Kết hợp"} • {cls.schedule}</p>
        </div>
        <span className={cn("text-xs font-medium px-3 py-1.5 rounded-lg",
          cls.escrowStatus === "completed" ? "bg-emerald-100 text-success dark:bg-emerald-900/30 dark:text-emerald-400" :
          cls.escrowStatus === "in_progress" ? "bg-primary/10 text-primary" : "bg-amber-100 text-warning"
        )}>
          {cls.escrowStatus === "completed" ? "Hoàn thành" : cls.escrowStatus === "in_progress" ? "Đang học" : "Chờ bắt đầu"}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{cls.completedSessions}/{cls.totalSessions}</p>
          <p className="text-xs text-muted-foreground">Buổi hoàn thành</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
          <p className="text-xs text-muted-foreground">Chuyên cần</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Wallet className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-success">{escrowPct}%</p>
          <p className="text-xs text-muted-foreground">Giải ngân</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{cls.studentName}</p>
          <p className="text-xs text-muted-foreground">PH: {cls.parentName}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Wallet className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{(cls.monthlyFee || cls.fee).toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground">Học phí/tháng</p>
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
          <div className="p-2 bg-success/15 dark:bg-emerald-900/20 rounded-lg">
            <p className="font-semibold text-success">{cls.escrowReleased.toLocaleString("vi-VN")}đ</p>
            <p className="text-muted-foreground">Đã giải ngân</p>
          </div>
          <div className="p-2 bg-primary/5 rounded-lg">
            <p className="font-semibold text-primary">{(cls.escrowAmount - cls.escrowReleased).toLocaleString("vi-VN")}đ</p>
            <p className="text-muted-foreground">Còn giữ</p>
          </div>
        </div>
      </div>

      {/* Sessions & Materials Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">Tất cả ({cls.sessions.length})</TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-lg">Sắp tới ({scheduledSessions.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg">Chờ XN ({pendingConfirmSessions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg">Đã xong ({completedSessions.length})</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-lg">Tài liệu ({cls.materials.length})</TabsTrigger>
        </TabsList>

        {["all", "scheduled", "pending", "completed"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {cls.sessions
              .filter(s => tab === "all" ? true : tab === "pending" ? s.status === "pending_confirm" || s.status === "in_progress" : s.status === tab)
              .map(s => (
              <div key={s.id} className={cn("p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all",
                s.status === "scheduled" ? "border-primary/20 bg-primary/5" :
                s.status === "in_progress" ? "border-amber-300 bg-warning/15 dark:bg-amber-900/10" :
                s.status === "pending_confirm" ? "border-warning/30 bg-warning/15/50 dark:bg-amber-900/5" :
                "border-border bg-card"
              )} onClick={() => setSelectedSession(s.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      s.status === "completed" ? "bg-emerald-100 text-success dark:bg-emerald-900/30" :
                      s.status === "in_progress" ? "bg-amber-100 text-warning" :
                      s.status === "pending_confirm" ? "bg-amber-100 text-warning" :
                      "bg-primary/10 text-primary"
                    )}>
                      {cls.sessions.indexOf(s) + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{s.date} • {s.time}</p>
                        {s.format && (
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
                            s.format === "online" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {s.format === "online" ? <Monitor className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                            {s.format === "online" ? "ONL" : "OFF"}
                          </span>
                        )}
                      </div>
                      {s.content && <p className="text-xs text-muted-foreground">{s.content}</p>}
                      {s.absenceReason && <p className="text-xs text-warning">⚠ Báo vắng: {s.absenceReason}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === "pending_confirm" && (
                      <button onClick={e => { e.stopPropagation(); handleConfirm(s.id); }} className="flex items-center gap-1 px-3 py-1.5 bg-success text-white rounded-lg text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" /> PH Xác nhận
                      </button>
                    )}
                    {s.status === "scheduled" && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setSessionDialog({ sessionId: s.id, mode: "absence" }); }} className="text-xs text-warning hover:underline">Báo vắng</button>
                        {s.format === "online" && s.meetingLink && (
                          <button onClick={e => { e.stopPropagation(); navigate(s.meetingLink!); }} className="flex items-center gap-1 px-2 py-1.5 bg-success text-white rounded-lg text-xs font-medium">
                            <Video className="w-3 h-3" /> Meet
                          </button>
                        )}
                        <button onClick={e => { e.stopPropagation(); setSessionDialog({ sessionId: s.id, mode: "start" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                          <Play className="w-3 h-3" /> Bắt đầu
                        </button>
                      </>
                    )}
                    {s.status === "in_progress" && (
                      <button onClick={e => { e.stopPropagation(); setSessionDialog({ sessionId: s.id, mode: "end" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium">
                        <Square className="w-3 h-3" /> Hoàn thành
                      </button>
                    )}
                    {s.status === "completed" && <CheckCircle2 className="w-4 h-4 text-success" />}
                    {s.status === "pending_confirm" && <Clock className="w-4 h-4 text-warning" />}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}

        {/* Materials Tab */}
        <TabsContent value="materials" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Tài liệu môn học</h3>
            <button onClick={() => setMaterialDialog(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
              <Plus className="w-3 h-3" /> Thêm tài liệu
            </button>
          </div>
          {cls.materials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có tài liệu nào</p>
          ) : cls.materials.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
              <span className="text-xl">{typeIcons[m.type]}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-[11px] text-muted-foreground">{m.type.toUpperCase()} • {m.size || "N/A"} • {m.uploadedAt}</p>
              </div>
              <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"><ExternalLink className="w-3.5 h-3.5" /></button>
              <button onClick={() => { removeMaterial(cls.id, m.id); toast.info("Đã xóa tài liệu"); }} className="p-1.5 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </TabsContent>
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
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Trạng thái</span><span className="font-medium">
                    {sessionDetail.status === "completed" ? "Hoàn thành" : sessionDetail.status === "pending_confirm" ? "Chờ PH xác nhận" : sessionDetail.status === "in_progress" ? "Đang diễn ra" : "Đã lên lịch"}
                  </span></div>
                  {sessionDetail.format && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Hình thức</span><span className="font-medium">{sessionDetail.format === "online" ? "Online" : "Offline"}</span></div>}
                  {sessionDetail.startedAt && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Bắt đầu</span><span className="font-medium">{sessionDetail.startedAt}</span></div>}
                  {sessionDetail.endedAt && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Kết thúc</span><span className="font-medium">{sessionDetail.endedAt}</span></div>}
                  {sessionDetail.parentConfirmed !== undefined && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">PH xác nhận</span><span className={cn("font-medium", sessionDetail.parentConfirmed ? "text-success" : "text-warning")}>{sessionDetail.parentConfirmed ? "✓ Đã xác nhận" : "⏳ Chưa xác nhận"}</span></div>}
                </div>
                {sessionDetail.content && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nội dung</span><p className="text-sm">{sessionDetail.content}</p></div>}
                {sessionDetail.notes && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Nhận xét</span><p className="text-sm">{sessionDetail.notes}</p></div>}
                {sessionDetail.homework && <div className="p-3 bg-primary/5 rounded-xl border border-primary/10"><span className="text-xs text-muted-foreground block mb-1">Bài tập về nhà</span><p className="text-sm font-medium">{sessionDetail.homework}</p></div>}
                {sessionDetail.homeworkFiles && sessionDetail.homeworkFiles.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <span className="text-xs text-muted-foreground block mb-1">File đính kèm</span>
                    {sessionDetail.homeworkFiles.map((f, i) => <p key={i} className="text-xs text-primary">📎 {f}</p>)}
                  </div>
                )}
                {sessionDetail.absenceReason && (
                  <div className="p-3 bg-warning/15 dark:bg-amber-900/10 rounded-xl border border-warning/30">
                    <span className="text-xs text-muted-foreground block mb-1">Lý do vắng</span>
                    <p className="text-sm">{sessionDetail.absenceReason}</p>
                    <p className="text-[10px] text-warning mt-1">{sessionDetail.absenceApproved ? "✓ Đã được duyệt" : "⏳ Chờ phụ huynh duyệt"}</p>
                  </div>
                )}
                {sessionDetail.rating && (
                  <div className="p-3 bg-warning/15 dark:bg-amber-900/10 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_, i) => <span key={i} className={cn("text-sm", i < sessionDetail.rating! ? "text-amber-400" : "text-muted-foreground/30")}>★</span>)}</div>
                    {sessionDetail.ratingComment && <p className="text-xs text-muted-foreground">{sessionDetail.ratingComment}</p>}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Start/End/Absence Session Dialog */}
      <Dialog open={!!sessionDialog} onOpenChange={() => setSessionDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>
            {sessionDialog?.mode === "start" ? "Bắt đầu buổi học" : sessionDialog?.mode === "end" ? "Xác nhận hoàn thành" : "Báo vắng"}
          </DialogTitle></DialogHeader>
          {sessionDialog?.mode === "start" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Hệ thống sẽ ghi nhận thời gian bắt đầu.</p>
              <button onClick={handleStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">Xác nhận bắt đầu</button>
            </div>
          ) : sessionDialog?.mode === "end" ? (
            <div className="space-y-3">
              <div className="p-3 bg-warning/15 dark:bg-amber-900/10 rounded-xl border border-warning/30 text-xs text-warning">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                Buổi học sẽ ở trạng thái "Chờ xác nhận" cho đến khi phụ huynh/học sinh xác nhận tham gia.
              </div>
              <div><label className="text-xs font-medium text-foreground">Nội dung đã dạy *</label><input value={endForm.content} onChange={e => setEndForm(p => ({ ...p, content: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /></div>
              <div><label className="text-xs font-medium text-foreground">Nhận xét</label><textarea value={endForm.notes} onChange={e => setEndForm(p => ({ ...p, notes: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-20 resize-none" /></div>
              <div><label className="text-xs font-medium text-foreground">Bài tập về nhà</label><input value={endForm.homework} onChange={e => setEndForm(p => ({ ...p, homework: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /></div>
              <div>
                <label className="text-xs font-medium text-foreground">File bài tập (tùy chọn)</label>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <button onClick={handleFileUpload} className="flex items-center gap-1 px-3 py-2 bg-muted border border-border rounded-xl text-xs hover:bg-primary/5">
                    <Upload className="w-3 h-3" /> Tải file lên
                  </button>
                  {uploadedFiles.map((f, i) => (
                    <span key={i} className="text-xs text-primary bg-primary/5 px-2 py-1 rounded-lg flex items-center gap-1">
                      📎 {f}
                      <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={handleEnd} disabled={!endForm.content} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">Gửi xác nhận hoàn thành</button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Yêu cầu báo vắng sẽ cần phụ huynh xác nhận.</p>
              <div><label className="text-xs font-medium text-foreground">Lý do *</label><textarea value={absenceReason} onChange={e => setAbsenceReason(e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-20 resize-none" placeholder="Nhập lý do vắng..." /></div>
              <button onClick={handleAbsence} disabled={!absenceReason} className="w-full py-2.5 bg-amber-600 text-white rounded-xl font-medium disabled:opacity-50">Gửi yêu cầu báo vắng</button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Material Dialog */}
      <Dialog open={materialDialog} onOpenChange={setMaterialDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Thêm tài liệu</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-foreground">Tên tài liệu *</label><input value={newMaterial.name} onChange={e => setNewMaterial(p => ({ ...p, name: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /></div>
            <div><label className="text-xs font-medium text-foreground">Loại</label>
              <select value={newMaterial.type} onChange={e => setNewMaterial(p => ({ ...p, type: e.target.value as any }))} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm">
                <option value="pdf">PDF</option><option value="doc">Document</option><option value="image">Hình ảnh</option><option value="video">Video</option><option value="link">Link</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">File</label>
              <button onClick={() => setNewMaterial(p => ({ ...p, url: `uploaded_${Date.now()}.pdf` }))} className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-3 bg-muted/50 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:bg-primary/5">
                <Upload className="w-4 h-4" /> {newMaterial.url ? `✓ ${newMaterial.url}` : "Chọn file để tải lên"}
              </button>
            </div>
            <button onClick={handleAddMaterial} disabled={!newMaterial.name} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">Thêm tài liệu</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorClassDetail;
