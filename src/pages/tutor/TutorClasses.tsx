import { useTutor } from "@/contexts/TutorContext";
import { BookOpen, Clock, CheckCircle2, Play, Square, FileText, UserCheck, UserX, Search, Filter, ChevronRight, MapPin, Monitor, Users2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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

// Mock data: "Đang tìm gia sư" (open requests from parents)
const seekingTutor = [
  { id: "seek1", studentName: "Nguyễn Thị Hà", parentName: "Nguyễn Văn Bình", subject: "Toán", grade: "Lớp 11", format: "online" as const, budget: "200.000 - 300.000đ/buổi", schedule: "T3, T5 - 19:00-21:00", location: "TP.HCM", note: "Con cần ôn thi giữa kỳ, yếu phần hình học", postedDate: "2026-02-28", avatar: "" },
  { id: "seek2", studentName: "Trần Đức Anh", parentName: "Trần Thị Ngọc", subject: "Lý", grade: "Lớp 12", format: "offline" as const, budget: "250.000 - 350.000đ/buổi", schedule: "T7, CN - 9:00-11:00", location: "Quận 7, TP.HCM", note: "Ôn thi ĐH, cần gia sư có kinh nghiệm", postedDate: "2026-03-01", avatar: "" },
  { id: "seek3", studentName: "Phạm Minh Khôi", parentName: "Phạm Thị Thu", subject: "Toán", grade: "Lớp 10", format: "hybrid" as const, budget: "180.000 - 250.000đ/buổi", schedule: "T2, T4 - 17:00-19:00", location: "Quận 1, TP.HCM", note: "Mới chuyển trường, cần bổ trợ kiến thức", postedDate: "2026-03-01", avatar: "" },
  { id: "seek4", studentName: "Lê Hồng Nhung", parentName: "Lê Văn Tú", subject: "Anh", grade: "Lớp 9", format: "online" as const, budget: "200.000 - 280.000đ/buổi", schedule: "T3, T6 - 19:30-21:00", location: "Hà Nội", note: "Luyện thi vào 10 chuyên Anh", postedDate: "2026-02-27", avatar: "" },
];

const formatIcons = { online: Monitor, offline: MapPin, hybrid: Users2 };
const formatLabels = { online: "Online", offline: "Offline", hybrid: "Kết hợp" };

const TutorClasses = () => {
  const { classes, trials, confirmTrial, rejectTrial, startSession, endSession } = useTutor();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sessionDialog, setSessionDialog] = useState<{ sessionId: string; classId: string; mode: "start" | "end" } | null>(null);
  const [endForm, setEndForm] = useState({ content: "", notes: "", homework: "" });
  const [activeTab, setActiveTab] = useState("my-classes");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [selectedSeeking, setSelectedSeeking] = useState<string | null>(null);
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);

  const cls = selectedClass ? classes.find(c => c.id === selectedClass) : null;
  const seekingDetail = selectedSeeking ? seekingTutor.find(s => s.id === selectedSeeking) : null;
  const trialDetail = selectedTrial ? trials.find(t => t.id === selectedTrial) : null;

  // Filters
  const subjects = [...new Set(classes.map(c => c.subject))];
  const filteredClasses = classes.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.studentName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && c.escrowStatus !== filterStatus) return false;
    if (filterSubject !== "all" && c.subject !== filterSubject) return false;
    return true;
  });

  const filteredSeeking = seekingTutor.filter(s => {
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase()) && !s.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSubject !== "all" && s.subject !== filterSubject) return false;
    return true;
  });

  const filteredTrials = trials.filter(t => {
    if (search && !t.studentName.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

  const trialStatusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    confirmed: "bg-primary/10 text-primary",
    rejected: "bg-destructive/10 text-destructive",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  const trialStatusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    rejected: "Đã từ chối",
    completed: "Hoàn thành",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên lớp, học sinh, môn học..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả môn</option>
            {["Toán", "Lý", "Hóa", "Anh"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {activeTab === "my-classes" && (
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ bắt đầu</option>
              <option value="in_progress">Đang học</option>
              <option value="completed">Hoàn thành</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="my-classes" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Lớp của tôi ({classes.length})
          </TabsTrigger>
          <TabsTrigger value="seeking" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Đang tìm gia sư ({seekingTutor.length})
          </TabsTrigger>
          <TabsTrigger value="trials" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Yêu cầu học thử ({trials.filter(t => t.status === "pending").length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: My Classes */}
        <TabsContent value="my-classes" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClasses.map(c => (
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
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{c.completedSessions}/{c.totalSessions} buổi</span>
                  <span>{c.fee.toLocaleString("vi-VN")}đ</span>
                </div>
                <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-1.5" />
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>Escrow:</span>
                  <div className="flex-1 bg-secondary rounded-full h-1 overflow-hidden">
                    <div className="bg-emerald-500 rounded-full h-1 transition-all" style={{ width: `${(c.escrowReleased / c.escrowAmount) * 100}%` }} />
                  </div>
                  <span>{Math.round((c.escrowReleased / c.escrowAmount) * 100)}%</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{c.schedule}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
            {filteredClasses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Không tìm thấy lớp học nào</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Seeking Tutor */}
        <TabsContent value="seeking" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSeeking.map(s => {
              const FormatIcon = formatIcons[s.format];
              return (
                <button key={s.id} onClick={() => setSelectedSeeking(s.id)} className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-elevated transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{s.subject} - {s.grade}</p>
                      <p className="text-xs text-muted-foreground">{s.parentName}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">
                      <FormatIcon className="w-3 h-3" /> {formatLabels[s.format]}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-foreground">Học sinh: {s.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.note}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Ngân sách</span>
                      <span className="font-medium text-foreground">{s.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lịch học</span>
                      <span className="font-medium text-foreground">{s.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Khu vực</span>
                      <span className="font-medium text-foreground">{s.location}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Đăng: {s.postedDate}</span>
                    <span className="text-xs text-primary font-medium group-hover:underline">Ứng tuyển →</span>
                  </div>
                </button>
              );
            })}
            {filteredSeeking.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Không tìm thấy yêu cầu nào</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Trial Bookings */}
        <TabsContent value="trials" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrials.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <img src={t.parentAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-foreground">{t.studentName}</p>
                      <span className={cn("text-[11px] font-medium px-2 py-1 rounded-lg", trialStatusColors[t.status])}>
                        {trialStatusLabels[t.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Phụ huynh: {t.parentName}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} • {t.requestedDate} • {t.requestedTime}</p>
                  </div>
                </div>

                {t.feedback && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Phản hồi: {t.feedback}</p>
                    {t.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={cn("text-xs", i < t.rating! ? "text-amber-400" : "text-muted-foreground/30")}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {t.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => { confirmTrial(t.id); toast.success("Đã xác nhận buổi học thử!"); }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
                    >
                      <UserCheck className="w-4 h-4" /> Xác nhận
                    </button>
                    <button
                      onClick={() => { rejectTrial(t.id); toast.info("Đã từ chối"); }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-medium hover:bg-destructive/10 hover:text-destructive"
                    >
                      <UserX className="w-4 h-4" /> Từ chối
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredTrials.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Không có yêu cầu học thử</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Seeking Detail Dialog */}
      <Dialog open={!!selectedSeeking} onOpenChange={() => setSelectedSeeking(null)}>
        <DialogContent className="max-w-md">
          {seekingDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{seekingDetail.subject} - {seekingDetail.grade}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Học sinh</span><span className="font-medium">{seekingDetail.studentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Phụ huynh</span><span className="font-medium">{seekingDetail.parentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Hình thức</span><span className="font-medium">{formatLabels[seekingDetail.format]}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Khu vực</span><span className="font-medium">{seekingDetail.location}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl col-span-2"><span className="text-xs text-muted-foreground block">Lịch học</span><span className="font-medium">{seekingDetail.schedule}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl col-span-2"><span className="text-xs text-muted-foreground block">Ngân sách</span><span className="font-medium">{seekingDetail.budget}</span></div>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <span className="text-xs text-muted-foreground block mb-1">Ghi chú</span>
                  <p className="text-sm">{seekingDetail.note}</p>
                </div>
                <button
                  onClick={() => { toast.success("Đã gửi ứng tuyển!"); setSelectedSeeking(null); }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium"
                >
                  Ứng tuyển dạy lớp này
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
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
