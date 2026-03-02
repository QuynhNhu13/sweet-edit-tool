import { useTutor } from "@/contexts/TutorContext";
import { BookOpen, Clock, CheckCircle2, Play, Square, Search, MapPin, Monitor, Users2, X, FileText, AlertTriangle, ChevronLeft, ChevronRight, Flag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const escrowColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  refunded: "bg-destructive/10 text-destructive",
};
const escrowLabels: Record<string, string> = { pending: "Chờ bắt đầu", in_progress: "Đang học", completed: "Hoàn thành", refunded: "Đã hoàn tiền" };

const seekingTutor = [
  { id: "seek1", studentName: "Nguyễn Thị Hà", parentName: "Nguyễn Văn Bình", subject: "Toán", grade: "Lớp 11", format: "online" as const, budget: "200.000 - 300.000đ/buổi", schedule: "T3, T5 - 19:00-21:00", location: "TP.HCM", note: "Con cần ôn thi giữa kỳ, yếu phần hình học", postedDate: "2026-02-28" },
  { id: "seek2", studentName: "Trần Đức Anh", parentName: "Trần Thị Ngọc", subject: "Lý", grade: "Lớp 12", format: "offline" as const, budget: "250.000 - 350.000đ/buổi", schedule: "T7, CN - 9:00-11:00", location: "Quận 7, TP.HCM", note: "Ôn thi ĐH, cần gia sư có kinh nghiệm", postedDate: "2026-03-01" },
  { id: "seek3", studentName: "Phạm Minh Khôi", parentName: "Phạm Thị Thu", subject: "Toán", grade: "Lớp 10", format: "hybrid" as const, budget: "180.000 - 250.000đ/buổi", schedule: "T2, T4 - 17:00-19:00", location: "Quận 1, TP.HCM", note: "Mới chuyển trường, cần bổ trợ kiến thức", postedDate: "2026-03-01" },
  { id: "seek4", studentName: "Lê Hồng Nhung", parentName: "Lê Văn Tú", subject: "Anh", grade: "Lớp 9", format: "online" as const, budget: "200.000 - 280.000đ/buổi", schedule: "T3, T6 - 19:30-21:00", location: "Hà Nội", note: "Luyện thi vào 10 chuyên Anh", postedDate: "2026-02-27" },
];

const formatIcons = { online: Monitor, offline: MapPin, hybrid: Users2 };
const formatLabels = { online: "Online", offline: "Offline", hybrid: "Kết hợp" };

const TutorClasses = () => {
  const { classes, trials, confirmTrial, rejectTrial, testQuestions } = useTutor();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-classes");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  // Test state
  const [testDialog, setTestDialog] = useState<{ seekingId: string; subject: string } | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [testFlagged, setTestFlagged] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Trial detail
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const trialDetail = selectedTrial ? trials.find(t => t.id === selectedTrial) : null;

  // Seeking detail (no test)
  const [selectedSeeking, setSelectedSeeking] = useState<string | null>(null);
  const seekingDetail = selectedSeeking ? seekingTutor.find(s => s.id === selectedSeeking) : null;

  const subjects = [...new Set([...classes.map(c => c.subject), ...seekingTutor.map(s => s.subject)])];
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

  // Test logic
  const getTestQuestions = (subject: string) => testQuestions.filter(q => q.subject === subject).slice(0, 10);

  const openTest = (seekingId: string, subject: string) => {
    setTestDialog({ seekingId, subject });
    setTestAnswers({});
    setTestFlagged(new Set());
    setCurrentQuestion(0);
    setTestSubmitted(false);
    setTestScore(0);
  };

  const submitTest = () => {
    if (!testDialog) return;
    const questions = getTestQuestions(testDialog.subject);
    let correct = 0;
    questions.forEach(q => { if (testAnswers[q.id] === q.correctAnswer) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    setTestScore(score);
    setTestSubmitted(true);
  };

  const handleApplyAfterTest = () => {
    if (testScore >= 70) {
      toast.success("Đã gửi ứng tuyển thành công!");
    } else {
      toast.error("Bạn cần đạt ít nhất 70% để ứng tuyển. Hãy ôn luyện thêm!");
    }
    setTestDialog(null);
  };

  const trialStatusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    confirmed: "bg-primary/10 text-primary",
    rejected: "bg-destructive/10 text-destructive",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  const trialStatusLabels: Record<string, string> = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", rejected: "Đã từ chối", completed: "Hoàn thành" };

  const currentTestQuestions = testDialog ? getTestQuestions(testDialog.subject) : [];
  const currentQ = currentTestQuestions[currentQuestion];
  const answeredCount = Object.keys(testAnswers).length;

  return (
    <div className="p-6 space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm theo tên lớp, học sinh, môn học..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <div className="flex gap-2">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
            <option value="all">Tất cả môn</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {activeTab === "my-classes" && (
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ bắt đầu</option>
              <option value="in_progress">Đang học</option>
              <option value="completed">Hoàn thành</option>
            </select>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="my-classes" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Lớp của tôi ({classes.length})</TabsTrigger>
          <TabsTrigger value="seeking" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Đang tìm gia sư ({seekingTutor.length})</TabsTrigger>
          <TabsTrigger value="trials" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Yêu cầu học thử ({trials.filter(t => t.status === "pending").length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: My Classes */}
        <TabsContent value="my-classes" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClasses.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-elevated transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.subject} • {c.format}</p>
                  </div>
                  <span className={cn("text-[11px] font-medium px-2 py-1 rounded-lg", escrowColors[c.escrowStatus])}>{escrowLabels[c.escrowStatus]}</span>
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
                  <button onClick={() => navigate(`/tutor/classes/${c.id}`)} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    Chi tiết <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {filteredClasses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Không tìm thấy lớp học nào</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Seeking Tutor - with test requirement */}
        <TabsContent value="seeking" className="mt-4">
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">Bạn cần hoàn thành bài kiểm tra năng lực (đạt ≥70%) trước khi ứng tuyển.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSeeking.map(s => {
              const FormatIcon = formatIcons[s.format];
              return (
                <div key={s.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-elevated transition-all">
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
                    <div className="flex items-center justify-between"><span>Ngân sách</span><span className="font-medium text-foreground">{s.budget}</span></div>
                    <div className="flex items-center justify-between"><span>Lịch học</span><span className="font-medium text-foreground">{s.schedule}</span></div>
                    <div className="flex items-center justify-between"><span>Khu vực</span><span className="font-medium text-foreground">{s.location}</span></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Đăng: {s.postedDate}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedSeeking(s.id)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Eye className="w-3 h-3" /> Xem</button>
                      <button onClick={() => openTest(s.id, s.subject)} className="text-xs text-primary font-medium flex items-center gap-1"><FileText className="w-3 h-3" /> Làm test & Ứng tuyển</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 3: Trials - with detail view */}
        <TabsContent value="trials" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrials.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <img src={t.parentAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-foreground">{t.studentName}</p>
                      <span className={cn("text-[11px] font-medium px-2 py-1 rounded-lg", trialStatusColors[t.status])}>{trialStatusLabels[t.status]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Phụ huynh: {t.parentName}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} • {t.requestedDate} • {t.requestedTime}</p>
                  </div>
                </div>
                {t.note && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{t.note}</p>}
                {t.feedback && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Phản hồi: {t.feedback}</p>
                    {t.rating && <div className="flex items-center gap-1 mt-1">{[...Array(5)].map((_, i) => <span key={i} className={cn("text-xs", i < t.rating! ? "text-amber-400" : "text-muted-foreground/30")}>★</span>)}</div>}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSelectedTrial(t.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80">
                    <Eye className="w-4 h-4" /> Chi tiết
                  </button>
                  {t.status === "pending" && (
                    <>
                      <button onClick={() => { confirmTrial(t.id); toast.success("Đã xác nhận buổi học thử!"); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Xác nhận
                      </button>
                      <button onClick={() => { rejectTrial(t.id); toast.info("Đã từ chối"); }} className="px-3 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20">
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
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
              <DialogHeader><DialogTitle>{seekingDetail.subject} - {seekingDetail.grade}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Học sinh</span><span className="font-medium">{seekingDetail.studentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Phụ huynh</span><span className="font-medium">{seekingDetail.parentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Hình thức</span><span className="font-medium">{formatLabels[seekingDetail.format]}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Khu vực</span><span className="font-medium">{seekingDetail.location}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl col-span-2"><span className="text-xs text-muted-foreground block">Lịch học</span><span className="font-medium">{seekingDetail.schedule}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl col-span-2"><span className="text-xs text-muted-foreground block">Ngân sách</span><span className="font-medium">{seekingDetail.budget}</span></div>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Ghi chú</span><p className="text-sm">{seekingDetail.note}</p></div>
                <button onClick={() => { setSelectedSeeking(null); openTest(seekingDetail.id, seekingDetail.subject); }} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Làm bài test để ứng tuyển
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Trial Detail Dialog */}
      <Dialog open={!!selectedTrial} onOpenChange={() => setSelectedTrial(null)}>
        <DialogContent className="max-w-lg">
          {trialDetail && (
            <>
              <DialogHeader><DialogTitle>Chi tiết yêu cầu học thử</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <img src={trialDetail.parentAvatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-base font-semibold text-foreground">{trialDetail.studentName}</p>
                    <p className="text-sm text-muted-foreground">{trialDetail.studentGrade} • {trialDetail.subject}</p>
                    <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-lg mt-1 inline-block", trialStatusColors[trialDetail.status])}>{trialStatusLabels[trialDetail.status]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Phụ huynh</span><span className="font-medium">{trialDetail.parentName}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">SĐT</span><span className="font-medium">{trialDetail.parentPhone}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Email</span><span className="font-medium">{trialDetail.parentEmail}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Ngày yêu cầu</span><span className="font-medium">{trialDetail.requestedDate}</span></div>
                  <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Giờ học</span><span className="font-medium">{trialDetail.requestedTime}</span></div>
                  {trialDetail.currentLevel && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block">Trình độ hiện tại</span><span className="font-medium">{trialDetail.currentLevel}</span></div>}
                </div>
                {trialDetail.goals && <div className="p-3 bg-primary/5 rounded-xl border border-primary/10"><span className="text-xs text-muted-foreground block mb-1">Mục tiêu</span><p className="text-sm font-medium text-foreground">{trialDetail.goals}</p></div>}
                {trialDetail.note && <div className="p-3 bg-muted/50 rounded-xl"><span className="text-xs text-muted-foreground block mb-1">Ghi chú thêm</span><p className="text-sm">{trialDetail.note}</p></div>}
                {trialDetail.feedback && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs text-muted-foreground block mb-1">Phản hồi sau buổi thử</span>
                    <p className="text-sm">{trialDetail.feedback}</p>
                    {trialDetail.rating && <div className="flex items-center gap-1 mt-2">{[...Array(5)].map((_, i) => <span key={i} className={cn("text-sm", i < trialDetail.rating! ? "text-amber-400" : "text-muted-foreground/30")}>★</span>)}</div>}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={!!testDialog} onOpenChange={() => setTestDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {testDialog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Bài kiểm tra năng lực - {testDialog.subject}</span>
                  {!testSubmitted && <span className="text-sm font-normal text-muted-foreground">{answeredCount}/{currentTestQuestions.length} đã trả lời</span>}
                </DialogTitle>
              </DialogHeader>

              {!testSubmitted ? (
                <div className="space-y-4">
                  {/* Question navigation */}
                  <div className="flex flex-wrap gap-2">
                    {currentTestQuestions.map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(i)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-xs font-medium border transition-all relative",
                          i === currentQuestion ? "bg-primary text-primary-foreground border-primary" :
                          testAnswers[q.id] !== undefined ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700" :
                          "bg-card text-muted-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {i + 1}
                        {testFlagged.has(q.id) && <Flag className="w-2.5 h-2.5 text-amber-500 absolute -top-1 -right-1" />}
                      </button>
                    ))}
                  </div>

                  {/* Current question */}
                  {currentQ && (
                    <div className="p-5 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-foreground">Câu {currentQuestion + 1}/{currentTestQuestions.length}</p>
                        <button
                          onClick={() => {
                            const f = new Set(testFlagged);
                            if (f.has(currentQ.id)) f.delete(currentQ.id); else f.add(currentQ.id);
                            setTestFlagged(f);
                          }}
                          className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-lg", testFlagged.has(currentQ.id) ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground")}
                        >
                          <Flag className="w-3 h-3" /> {testFlagged.has(currentQ.id) ? "Đã đánh dấu" : "Đánh dấu"}
                        </button>
                      </div>
                      <p className="text-sm text-foreground mb-4">{currentQ.question}</p>
                      <div className="space-y-2">
                        {currentQ.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setTestAnswers(prev => ({ ...prev, [currentQ.id]: oi }))}
                            className={cn(
                              "w-full text-left p-3 rounded-xl border text-sm transition-all",
                              testAnswers[currentQ.id] === oi
                                ? "bg-primary/10 border-primary text-foreground font-medium"
                                : "bg-card border-border text-muted-foreground hover:border-primary/50"
                            )}
                          >
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(p => p - 1)} className="flex items-center gap-1 px-4 py-2 bg-muted text-foreground rounded-xl text-sm disabled:opacity-50">
                      <ChevronLeft className="w-4 h-4" /> Câu trước
                    </button>
                    {currentQuestion < currentTestQuestions.length - 1 ? (
                      <button onClick={() => setCurrentQuestion(p => p + 1)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm">
                        Câu tiếp <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={submitTest} disabled={answeredCount < currentTestQuestions.length} className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                        Nộp bài ({answeredCount}/{currentTestQuestions.length})
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Test Results */
                <div className="space-y-6 text-center">
                  <div className={cn("p-8 rounded-2xl", testScore >= 70 ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-destructive/5")}>
                    <p className={cn("text-5xl font-bold mb-2", testScore >= 70 ? "text-emerald-600" : "text-destructive")}>{testScore}%</p>
                    <p className="text-sm text-muted-foreground">{testScore >= 70 ? "🎉 Chúc mừng! Bạn đã đạt yêu cầu" : "😔 Chưa đạt yêu cầu (cần ≥70%)"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Đúng {Math.round(testScore * currentTestQuestions.length / 100)}/{currentTestQuestions.length} câu</p>
                  </div>

                  {/* Show answers */}
                  <div className="space-y-3 text-left">
                    {currentTestQuestions.map((q, i) => {
                      const isCorrect = testAnswers[q.id] === q.correctAnswer;
                      return (
                        <div key={q.id} className={cn("p-3 rounded-xl border", isCorrect ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10" : "border-destructive/20 bg-destructive/5")}>
                          <p className="text-xs font-medium text-foreground mb-1">Câu {i + 1}: {q.question}</p>
                          <p className="text-xs">
                            <span className="text-muted-foreground">Bạn chọn: </span>
                            <span className={isCorrect ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
                              {q.options[testAnswers[q.id]] || "Chưa trả lời"}
                            </span>
                          </p>
                          {!isCorrect && <p className="text-xs text-emerald-600 mt-0.5">Đáp án đúng: {q.options[q.correctAnswer]}</p>}
                          <p className="text-[11px] text-muted-foreground mt-1 italic">{q.explanation}</p>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={handleApplyAfterTest} className={cn("w-full py-3 rounded-xl font-medium", testScore >= 70 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {testScore >= 70 ? "Ứng tuyển ngay" : "Đóng & Ôn luyện thêm"}
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorClasses;
