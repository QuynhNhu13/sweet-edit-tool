import { useStudent } from "@/contexts/StudentContext";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  CalendarDays,
  ArrowUpRight,
  ChevronRight,
  Search,
  ClipboardCheck,
  BarChart3,
  Wallet,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = {
  primary: "#1E68E6",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
};

const StudentDashboard = () => {
  const { profile, classes, examResults, monthlyProgress, weeklyGoal, walletBalance } = useStudent();
  const navigate = useNavigate();

  const activeClasses = classes.filter((c) => c.status === "active");
  const completedClasses = classes.filter((c) => c.status === "completed");
  const completedSessions = classes.reduce((s, c) => s + c.completedSessions, 0);
  const totalSessions = classes.reduce((s, c) => s + c.totalSessions, 0);

  const weeklyStudyHours = Math.round(
    activeClasses.reduce((s, c) => {
      const sessionsThisWeek = c.sessions.filter((sess) => {
        const d = new Date(sess.date);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
        return d >= weekAgo && d <= now && sess.status === "completed";
      }).length;
      return s + sessionsThisWeek * 2;
    }, 0)
  );

  const avgScore =
    examResults.length > 0
      ? Math.round(examResults.reduce((s, r) => s + r.score, 0) / examResults.length)
      : 0;

  const upcomingSessions = classes
    .flatMap((c) =>
      c.sessions
        .filter((s) => s.status === "scheduled")
        .map((s) => ({
          ...s,
          className: c.name,
          tutorName: c.tutorName,
          tutorAvatar: c.tutorAvatar,
          subject: c.subject,
        }))
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const gpaData = monthlyProgress.map((m) => ({
    month: m.month.replace("/2025", "").replace("/2026", ""),
    gpa: m.gpa,
  }));

  const stats = [
    {
      label: "Lớp đang học",
      value: activeClasses.length,
      sub: `${completedClasses.length} hoàn thành`,
      icon: BookOpen,
      bg: "from-blue-700 to-blue-900",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      link: "/student/classes",
    },
    {
      label: "Buổi đã học",
      value: completedSessions,
      sub: `/ ${totalSessions} tổng`,
      icon: CheckCircle2,
      bg: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      link: "/student/schedule",
    },
    {
      label: "Giờ học / tuần",
      value: weeklyStudyHours > 0 ? weeklyStudyHours : 12,
      sub: `Mục tiêu: ${weeklyGoal.target}h`,
      icon: Clock,
      bg: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      link: "/student/schedule",
    },
    {
      label: "Điểm trung bình",
      value: `${avgScore}%`,
      sub: `${examResults.length} bài thi`,
      icon: TrendingUp,
      bg: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      link: "/student/results",
    },
  ];

  return (
    <div className="px-6 pt-2 pb-6 space-y-3">
      {/* Hero summary */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Tổng quan học tập
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              Chào bạn, tiếp tục giữ tiến độ nhé
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Theo dõi GPA, lịch học, kết quả thi và ví học phí trong một nơi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">GPA hiện tại</p>
              <p className="mt-1 text-2xl font-bold">{profile.gpa}</p>
              <p className="text-[11px] text-white/70">Mục tiêu {profile.goalGpa}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">Ví học phí</p>
              <p className="mt-1 text-lg font-bold">{walletBalance.toLocaleString("vi-VN")}đ</p>
              <p className="text-[11px] text-white/70">Sẵn sàng thanh toán</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <button
            key={i}
            onClick={() => navigate(s.link)}
            className={cn(
              "group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-left text-white transition-all hover:shadow-lg",
              s.bg
            )}
          >
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", s.iconBg)}>
              <s.icon className={cn("h-6 w-6", s.iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/90 transition-colors group-hover:text-white" />
          </button>
        ))}
      </div>

      {/* Weekly goals */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Target className="h-4 w-4 text-primary" />
          Mục tiêu tuần này
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Giờ học</span>
              <span className="text-xs font-semibold text-foreground">
                {weeklyGoal.current}/{weeklyGoal.target}h
              </span>
            </div>
            <Progress value={(weeklyGoal.current / weeklyGoal.target) * 100} className="h-2.5" />
            <p className="mt-2 text-[10px] text-muted-foreground">
              {Math.round((weeklyGoal.current / weeklyGoal.target) * 100)}% hoàn thành
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">GPA hiện tại</span>
              <span className="text-xs font-semibold text-foreground">
                {profile.gpa} / {profile.goalGpa}
              </span>
            </div>
            <Progress value={(profile.gpa / profile.goalGpa) * 100} className="h-2.5" />
            <p className="mt-2 text-[10px] text-muted-foreground">Tiến gần mục tiêu học tập</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Bài test hoàn thành</span>
              <span className="text-xs font-semibold text-foreground">{examResults.length}</span>
            </div>
            <Progress value={Math.min(100, (examResults.length / 10) * 100)} className="h-2.5" />
            <p className="mt-2 text-[10px] text-muted-foreground">Theo dõi đều đặn mỗi tuần</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming schedule */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Lịch học sắp tới
              </h3>
              <button
                onClick={() => navigate("/student/schedule")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/70"
                >
                  <img src={s.tutorAvatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.tutorName} • {s.date} • {s.time}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{s.subject}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-medium",
                        s.format === "online"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      )}
                    >
                      {s.format === "online" ? "Online" : "Offline"}
                    </span>

                    {s.format === "online" && s.meetingLink && (
                      <Button
                        size="sm"
                        className="h-8 rounded-xl text-xs"
                        onClick={() => navigate(s.meetingLink!)}
                      >
                        Vào lớp
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {upcomingSessions.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Không có buổi học nào sắp tới
                </p>
              )}
            </div>
          </div>

          {/* GPA chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Tiến độ GPA
            </h3>

            <ChartContainer
              config={{ gpa: { label: "GPA", color: COLORS.primary } }}
              className="h-[220px] w-full"
            >
              <AreaChart data={gpaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="dashGpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis domain={[6, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="gpa"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fill="url(#dashGpaGrad)"
                  dot={{ r: 5, fill: COLORS.primary }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/student/wallet")}
            className="group w-full rounded-3xl border border-emerald-200/40 bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-left text-white transition-all hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Wallet className="h-4 w-4 text-white/90" />
                Ví học phí
              </h3>
              <ChevronRight className="h-4 w-4 text-white/80 group-hover:text-white" />
            </div>
            <p className="text-2xl font-bold">{walletBalance.toLocaleString("vi-VN")}đ</p>
            <p className="mt-1 text-[10px] text-white/80">Nhấn để xem chi tiết và lịch sử thanh toán</p>
          </button>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              Tiến độ lớp học
            </h3>

            <div className="space-y-3">
              {activeClasses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate("/student/classes")}
                  className="group w-full rounded-2xl bg-muted/40 p-3 text-left transition-colors hover:bg-muted/70"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img src={c.tutorAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.tutorName}</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {Math.round((c.completedSessions / c.totalSessions) * 100)}%
                    </span>
                  </div>
                  <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-1.5" />
                </button>
              ))}

              {activeClasses.length === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  Chưa có lớp đang hoạt động
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ClipboardCheck className="h-4 w-4 text-amber-600" />
              Kết quả gần nhất
            </h3>

            {examResults.slice(0, 3).map((r) => (
              <div key={r.id} className="mb-2 flex items-center gap-3 rounded-2xl bg-muted/40 p-3 last:mb-0">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold",
                    r.passed
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
                  )}
                >
                  {r.score}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground">{r.completedAt}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    r.passed
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
                  )}
                >
                  {r.passed ? "Đạt" : "Chưa đạt"}
                </span>
              </div>
            ))}

            <button
              onClick={() => navigate("/student/results")}
              className="mt-3 w-full text-xs font-medium text-primary hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Truy cập nhanh</h3>

            {[
              { label: "Tìm gia sư mới", link: "/student/find-tutor", icon: Search },
              { label: "Thi thử THPTQG", link: "/student/mock-exam", icon: ClipboardCheck },
              { label: "Xem báo cáo", link: "/student/report", icon: BarChart3 },
              { label: "Ví học phí", link: "/student/wallet", icon: Wallet },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.link)}
                className="group mb-2 flex w-full items-center gap-3 rounded-2xl bg-muted/40 p-3 text-left transition-colors last:mb-0 hover:bg-muted/70"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-xs font-medium text-foreground">{item.label}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;