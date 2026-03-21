import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import { ChevronLeft, CheckCircle2, Clock, BookOpen, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const classAssignments = Array.from({ length: 14 }).map((_, idx) => ({
  id: `hw-${idx + 1}`,
  classId: idx % 2 === 0 ? "sc1" : "sc2",
  title: `Bài tập tuần ${idx + 1}`,
  dueDate: `2026-03-${String((idx % 20) + 5).padStart(2, "0")}`,
  status: idx % 3 === 0 ? "completed" : "pending",
}));

const StudentClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes } = useStudent();

  const detail = classes.find((c) => c.id === classId);

  const assignments = useMemo(
    () => classAssignments.filter((item) => item.classId === classId),
    [classId],
  );

  if (!detail) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Không tìm thấy lớp học.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate("/student/classes")} className="inline-flex items-center gap-2 text-sm text-primary">
        <ChevronLeft className="w-4 h-4" /> Quay lại lớp học
      </button>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-lg font-bold text-foreground">{detail.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">{detail.tutorName} • {detail.schedule}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground">Môn học</p>
            <p className="text-sm font-semibold text-foreground">{detail.subject}</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground">Học phí</p>
            <p className="text-sm font-semibold text-foreground">{detail.fee.toLocaleString("vi-VN")}đ</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground">Tiến độ</p>
            <p className="text-sm font-semibold text-foreground">{detail.completedSessions}/{detail.totalSessions} buổi</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground">Hình thức</p>
            <p className="text-sm font-semibold text-foreground">{detail.format === "online" ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={(detail.completedSessions / detail.totalSessions) * 100} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Lịch học chi tiết</h3>
        <div className="space-y-2">
          {detail.sessions.map((s) => (
            <div key={s.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-foreground font-medium">{s.content || "Buổi học"}</p>
                <p className="text-xs text-muted-foreground">{s.date} • {s.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{s.status === "completed" ? "Hoàn thành" : s.status === "scheduled" ? "Sắp tới" : "Khác"}</Badge>
                {s.status === "scheduled" && s.meetingLink && (
                  <Button size="sm" onClick={() => navigate(s.meetingLink)}>Vào lớp</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Bài tập trong lớp</h3>
        <div className="space-y-2">
          {assignments.map((a) => (
            <div key={a.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">Hạn nộp: {a.dueDate}</p>
              </div>
              {a.status === "completed" ? (
                <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-warning"><Clock className="w-3.5 h-3.5" /> Chưa nộp</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentClassDetail;