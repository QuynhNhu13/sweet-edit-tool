import { useParent } from "@/contexts/ParentContext";
import {
  Users,
  BookOpen,
  CheckCircle2,
  Star,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  Check,
  X,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ParentChildren = () => {
  const { children, confirmAttendance, childSchedules, childTests } = useParent();
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const [tab, setTab] = useState<"overview" | "schedule" | "tests" | "attendance">("overview");

  const totalClasses = children.reduce((s, c) => s + c.totalClasses, 0);
  const avgAttendance =
    children.length > 0
      ? Math.round(children.reduce((s, c) => s + c.attendance, 0) / children.length)
      : 0;
  const avgGpa =
    children.length > 0
      ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1)
      : "0";

  const child = children.find(c => c.id === selectedChild);
  const schedule = childSchedules[selectedChild] || [];
  const tests = childTests[selectedChild] || [];
  const pendingAttendance = (child?.attendanceConfirmations || []).filter(a => a.status === "pending");

  const handleConfirmAttendance = (confirmId: string, confirmed: boolean) => {
    confirmAttendance(selectedChild, confirmId, confirmed);
    toast.success(confirmed ? "Đã xác nhận điểm danh" : "Đã từ chối điểm danh");
  };

  const tabs = [
    { key: "overview", label: "Tổng quan", icon: Users },
    { key: "schedule", label: "Lịch học", icon: CalendarDays },
    { key: "tests", label: "Bài kiểm tra", icon: ClipboardList },
    { key: "attendance", label: "Điểm danh", icon: CheckCircle2 },
  ] as const;

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* HERO */}
      {/* <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col lg:flex-row justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold">Con em & tiến độ học tập</h2>
            <p className="mt-1 text-sm text-white/80">
              Theo dõi lịch học, bài kiểm tra và xác nhận điểm danh của con bạn
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Tổng lớp học</p>
              <p className="text-xl font-bold">{totalClasses}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Chờ xác nhận</p>
              <p className="text-xl font-bold">{pendingAttendance.length}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Số con",
            value: children.length,
            sub: `${totalClasses} lớp`,
            color: "from-blue-500 to-indigo-500",
            icon: Users,
          },
          {
            label: "Chuyên cần TB",
            value: `${avgAttendance}%`,
            sub: "Toàn bộ con em",
            color: "from-amber-500 to-orange-500",
            icon: CheckCircle2,
          },
          {
            label: "GPA TB",
            value: avgGpa,
            sub: "Kết quả học tập",
            color: "from-emerald-500 to-teal-500",
            icon: Star,
          },
          {
            label: "Chờ xác nhận",
            value: pendingAttendance.length,
            sub: "Điểm danh",
            color: "from-rose-500 to-pink-500",
            icon: AlertTriangle,
          },
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-white transition-all hover:shadow-lg",
              s.color
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4" />
          </div>
        ))}
      </div>

      {/* CHILD SELECTOR */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">Chọn con em</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Xem chi tiết tiến độ học tập theo từng học sinh
            </p>
          </div>

          {pendingAttendance.length > 0 && (
            <Badge variant="destructive" className="w-fit gap-1 text-xs rounded-full px-3 py-1">
              <AlertTriangle className="h-3 w-3" />
              {pendingAttendance.length} chờ xác nhận
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedChild(c.id);
                setTab("overview");
              }}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                selectedChild === c.id
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border bg-muted/30 hover:bg-muted/60"
              )}
            >
              <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full object-cover" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.grade} • {c.school}
                </p>

                <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {c.totalClasses} lớp
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {c.attendance}%
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-bold">{c.gpa}</p>
                <p className="text-[10px] text-muted-foreground">GPA</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="flex w-fit gap-1 rounded-2xl bg-muted p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            {t.key === "attendance" && pendingAttendance.length > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {pendingAttendance.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && child && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <img src={child.avatar} alt={child.name} className="h-14 w-14 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-base font-bold">{child.name}</p>
              <p className="text-sm text-muted-foreground">
                {child.grade} • {child.school}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">GPA: {child.gpa}</p>
              <p className="text-xs text-muted-foreground">Chuyên cần: {child.attendance}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {child.classes.map(cls => (
              <div
                key={cls.id}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-4 transition hover:bg-muted/50"
              >
                <img src={cls.tutorAvatar} alt={cls.tutorName} className="h-10 w-10 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cls.tutorName} • {cls.schedule}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="mb-1 flex items-center justify-end gap-1">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(cls.completedSessions / cls.totalSessions) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {cls.completedSessions}/{cls.totalSessions}
                    </span>
                  </div>

                  <Badge
                    variant={cls.status === "active" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {cls.status === "active" ? "Đang học" : "Hoàn thành"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE */}
      {tab === "schedule" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" />
            Lịch học tuần này - {child?.name}
          </h3>

          {schedule.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Chưa có lịch học</p>
          ) : (
            <div className="space-y-3">
              {schedule.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-4 transition-all",
                    s.status === "completed"
                      ? "border-border bg-muted/20"
                      : s.status === "upcoming"
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card"
                  )}
                >
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-xs text-muted-foreground">{s.dayOfWeek}</p>
                    <p className="text-lg font-bold">{s.date.split("/")[0]}</p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.tutorName} • {s.time}
                    </p>
                    {s.topic && (
                      <p className="mt-0.5 text-xs text-muted-foreground">Chủ đề: {s.topic}</p>
                    )}
                  </div>

                  <Badge
                    variant={
                      s.status === "completed"
                        ? "secondary"
                        : s.status === "upcoming"
                          ? "default"
                          : "outline"
                    }
                    className="text-[10px]"
                  >
                    {s.status === "completed"
                      ? "Đã học"
                      : s.status === "upcoming"
                        ? "Sắp tới"
                        : "Đã hủy"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TESTS */}
      {tab === "tests" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="h-4 w-4 text-primary" />
            Bài kiểm tra - {child?.name}
          </h3>

          {tests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Chưa có bài kiểm tra</p>
          ) : (
            <div className="space-y-3">
              {tests.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted shrink-0">
                    <FileText className="h-4 w-4 text-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.subject} • {t.date} • {t.tutorName}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {t.score !== null ? (
                      <>
                        <p
                          className={cn(
                            "text-lg font-bold",
                            t.score >= 8
                              ? "text-foreground"
                              : t.score >= 5
                                ? "text-muted-foreground"
                                : "text-destructive"
                          )}
                        >
                          {t.score}/10
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {t.score >= 8
                            ? "Giỏi"
                            : t.score >= 6.5
                              ? "Khá"
                              : t.score >= 5
                                ? "Trung bình"
                                : "Yếu"}
                        </p>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Chưa chấm
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATTENDANCE */}
      {tab === "attendance" && (
        <div className="space-y-4">
          {/* Pending */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Chờ xác nhận - {child?.name}
            </h3>

            {pendingAttendance.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Không có điểm danh nào chờ xác nhận.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAttendance.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4"
                  >
                    <img src={a.tutorAvatar} alt={a.tutorName} className="h-10 w-10 rounded-full object-cover" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {a.subject} - Buổi {a.sessionNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.tutorName} • {a.date} • {a.time}
                      </p>
                      {a.note && (
                        <p className="mt-0.5 text-xs text-muted-foreground">Ghi chú GV: {a.note}</p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        className="gap-1 rounded-xl text-xs"
                        onClick={() => handleConfirmAttendance(a.id, true)}
                      >
                        <Check className="h-3 w-3" />
                        Xác nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 rounded-xl text-xs"
                        onClick={() => handleConfirmAttendance(a.id, false)}
                      >
                        <X className="h-3 w-3" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">Lịch sử điểm danh</h3>

            <div className="space-y-2">
              {(child?.attendanceConfirmations || [])
                .filter(a => a.status !== "pending")
                .map(a => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        a.status === "confirmed" ? "bg-muted" : "bg-destructive/10"
                      )}
                    >
                      {a.status === "confirmed" ? (
                        <CheckCircle2 className="h-4 w-4 text-foreground" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        {a.subject} - Buổi {a.sessionNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.tutorName} • {a.date}
                      </p>
                    </div>

                    <Badge
                      variant={a.status === "confirmed" ? "secondary" : "destructive"}
                      className="text-[10px]"
                    >
                      {a.status === "confirmed" ? "Đã xác nhận" : "Đã từ chối"}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentChildren;