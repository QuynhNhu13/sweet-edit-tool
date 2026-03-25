import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarDays,
  Video,
  MapPin,
  Wallet,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Upload,
  Eye,
  X,
  FileText,
  Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const classAssignments = Array.from({ length: 14 }).map((_, idx) => ({
  id: `hw-${idx + 1}`,
  classId: idx % 2 === 0 ? "sc1" : "sc2",
  title: `Bài tập tuần ${idx + 1}`,
  dueDate: `2026-03-${String((idx % 20) + 5).padStart(2, "0")}`,
  status: idx % 3 === 0 ? "completed" : "pending",
}));

// Mock data for assignment details
const assignmentDetails = {
  "hw-1": {
    title: "Bài tập tuần 1",
    description: "Giải các bài tập về đại số cơ bản trong chương 1",
    requirements: [
      "Giải 10 bài tập trong sách giáo khoa trang 15-20",
      "Nộp bài dưới dạng file PDF hoặc hình ảnh",
      "Đặt tên file theo format: [Tên học sinh]_BT_Tuan1.pdf"
    ],
    submittedAt: "2026-03-10 14:30",
    score: 85,
    feedback: "Bài làm tốt, cần chú ý hơn về cách trình bày. Điểm cộng: giải thích rõ ràng.",
    attachments: [
      { name: "BT_Tuan1_NguyenVanA.pdf", size: "2.3 MB", type: "PDF" }
    ]
  },
  "hw-2": {
    title: "Bài tập tuần 2",
    description: "Bài tập thực hành về hàm số",
    requirements: [
      "Vẽ đồ thị các hàm số đã học",
      "Giải phương trình và bất phương trình",
      "Nộp file Word hoặc PDF"
    ],
    submittedAt: "2026-03-15 16:45",
    score: 92,
    feedback: "Xuất sắc! Cách giải sáng tạo và chính xác.",
    attachments: [
      { name: "BT_Tuan2_NguyenVanA.docx", size: "1.8 MB", type: "Word" }
    ]
  },
  "hw-3": {
    title: "Bài tập tuần 3",
    description: "Ôn tập kiến thức về hình học phẳng",
    requirements: [
      "Giải các bài toán về tam giác, tứ giác",
      "Tính chu vi và diện tích các hình",
      "Nộp bài scan hoặc chụp ảnh rõ nét"
    ],
    submittedAt: "2026-03-20 10:15",
    score: 78,
    feedback: "Bài làm khá, cần cải thiện phần tính toán. Kiểm tra lại công thức diện tích.",
    attachments: [
      { name: "BT_Tuan3_NguyenVanA.jpg", size: "3.1 MB", type: "Image" }
    ]
  }
};

const StudentClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes } = useStudent();

  const [assignments, setAssignments] = useState(classAssignments);
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [detailAssignmentId, setDetailAssignmentId] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const detail = classes.find((c) => c.id === classId);

  const filteredAssignments = useMemo(
    () => assignments.filter((item) => item.classId === classId),
    [assignments, classId]
  );

  const handleSubmitAssignment = (assignmentId: string) => {
    setSubmittingAssignmentId(assignmentId);
    setSubmissionMessage(`Đang nộp bài tập ${assignmentId}...`);

    // Simulate submission process
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === assignmentId ? { ...item, status: "completed" } : item
        )
      );
      setSubmittingAssignmentId(null);
      setSubmissionMessage(`Nộp bài tập ${assignmentId} thành công!`);

      setTimeout(() => {
        setSubmissionMessage(null);
      }, 2000);
    }, 1500);
  };

  const handleViewDetail = (assignmentId: string) => {
    setDetailAssignmentId(assignmentId);
  };

  const closeDetailModal = () => {
    setDetailAssignmentId(null);
  };

  if (!detail) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm font-medium text-foreground">Không tìm thấy lớp học.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lớp có thể đã bị xóa hoặc đường dẫn không đúng.
          </p>
        </div>
      </div>
    );
  }

  const progress = (detail.completedSessions / detail.totalSessions) * 100;
  const completedAssignments = filteredAssignments.filter((a) => a.status === "completed").length;
  const pendingAssignments = filteredAssignments.filter((a) => a.status !== "completed").length;

  return (
    <div className="px-6 pt-2 pb-6 space-y-3">
      <button
        onClick={() => navigate("/student/classes")}
        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại lớp học
      </button>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Chi tiết lớp học
            </div>

            <h2 className="mt-3 text-2xl font-bold">{detail.name}</h2>
            <p className="mt-1 text-sm text-white/80">
              {detail.tutorName} • {detail.schedule}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] text-white hover:bg-white/15">
                {detail.format === "online" ? (
                  <>
                    <Video className="mr-1 h-3 w-3" /> Online
                  </>
                ) : (
                  <>
                    <MapPin className="mr-1 h-3 w-3" /> Offline
                  </>
                )}
              </Badge>

              <Badge className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] text-white hover:bg-white/15">
                <GraduationCap className="mr-1 h-3 w-3" />
                {detail.subject}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">Tiến độ</p>
              <p className="mt-1 text-2xl font-bold">{Math.round(progress)}%</p>
              <p className="text-[11px] text-white/70">
                {detail.completedSessions}/{detail.totalSessions} buổi
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">Học phí</p>
              <p className="mt-1 text-lg font-bold">
                {detail.fee.toLocaleString("vi-VN")}đ
              </p>
              <p className="text-[11px] text-white/70">Tổng khóa học</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <p className="text-xs text-muted-foreground">Môn học</p>
          <p className="mt-1 text-base font-semibold text-foreground">{detail.subject}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <p className="text-xs text-muted-foreground">Buổi đã học</p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {detail.completedSessions}/{detail.totalSessions}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/20">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="text-xs text-muted-foreground">Bài tập chờ nộp</p>
          <p className="mt-1 text-base font-semibold text-foreground">{pendingAssignments}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/20">
            <Wallet className="h-5 w-5 text-rose-600 dark:text-rose-300" />
          </div>
          <p className="text-xs text-muted-foreground">Học phí</p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {detail.fee.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tổng quan lớp học</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Theo dõi tiến độ hoàn thành của khóa học
            </p>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
            {Math.round(progress)}% hoàn thành
          </Badge>
        </div>

        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tiến độ khóa học</span>
            <span className="text-xs font-semibold text-foreground">
              {detail.completedSessions}/{detail.totalSessions} buổi
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-muted/35 p-4">
            <p className="text-[11px] text-muted-foreground">Gia sư</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{detail.tutorName}</p>
          </div>

          <div className="rounded-2xl bg-muted/35 p-4">
            <p className="text-[11px] text-muted-foreground">Lịch học</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{detail.schedule}</p>
          </div>

          <div className="rounded-2xl bg-muted/35 p-4">
            <p className="text-[11px] text-muted-foreground">Hình thức</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {detail.format === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          Lịch học chi tiết
        </h3>

        <div className="space-y-3">
          {detail.sessions.map((s, index) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {index + 1}
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {s.content || `Buổi học ${index + 1}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.date} • {s.time}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium",
                    s.status === "completed" &&
                      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300",
                    s.status === "scheduled" &&
                      "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300",
                    s.status !== "completed" &&
                      s.status !== "scheduled" &&
                      "bg-muted text-foreground hover:bg-muted"
                  )}
                >
                  {s.status === "completed"
                    ? "Hoàn thành"
                    : s.status === "scheduled"
                    ? "Sắp tới"
                    : "Khác"}
                </Badge>

                {s.status === "scheduled" && s.meetingLink && (
                  <Button
                    size="sm"
                    className="rounded-xl text-xs"
                    onClick={() => navigate(s.meetingLink)}
                  >
                    Vào lớp
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-amber-600" />
              Bài tập trong lớp
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {completedAssignments} hoàn thành • {pendingAssignments} chưa nộp
            </p>
          </div>

          <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300">
            {filteredAssignments.length} bài tập
          </Badge>
        </div>

        <div className="space-y-3">
          {submissionMessage && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
              {submissionMessage}
            </div>
          )}

          {filteredAssignments.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hạn nộp: {a.dueDate}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium",
                    a.status === "completed"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300"
                  )}
                >
                  {a.status === "completed" ? "Hoàn thành" : "Chưa nộp"}
                </Badge>

                {a.status === "completed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => handleViewDetail(a.id)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Xem chi tiết
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-xl"
                    disabled={submittingAssignmentId === a.id}
                    onClick={() => handleSubmitAssignment(a.id)}
                  >
                    {submittingAssignmentId === a.id ? (
                      "Đang nộp..."
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Nộp bài
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/student/classes")}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Xem các lớp khác <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Assignment Detail Modal */}
      {detailAssignmentId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.title || `Bài tập ${detailAssignmentId}`}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Nộp lúc: {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.submittedAt}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={closeDetailModal}
                className="rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Score */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-semibold text-foreground">Điểm số:</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.score}/100
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Mô tả bài tập</h3>
                <p className="text-sm text-muted-foreground">
                  {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Yêu cầu</h3>
                <ul className="space-y-1">
                  {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">File đã nộp</h3>
                <div className="space-y-2">
                  {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size} • {file.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Nhận xét từ gia sư</h3>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {assignmentDetails[detailAssignmentId as keyof typeof assignmentDetails]?.feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClassDetail;