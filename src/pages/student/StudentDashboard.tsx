import { useStudent } from "@/contexts/StudentContext";
import { BookOpen, CheckCircle2, Clock, TrendingUp, Target, CalendarDays, ArrowUpRight, ChevronRight, Search, ClipboardCheck, BarChart3, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

const COLORS = [
  "hsl(224, 76%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 68%, 55%)",
];

const StudentDashboard = () => {
  const { profile, classes, examResults, monthlyProgress, weeklyGoal, walletBalance } = useStudent();
  const navigate = useNavigate();

  const activeClasses = classes.filter(c => c.status === "active");
  const completedSessions = classes.reduce((s, c) => s + c.completedSessions, 0);
  const weeklyStudyHours = Math.round(activeClasses.reduce((s, c) => {
    const sessionsThisWeek = c.sessions.filter(sess => {
      const d = new Date(sess.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
      return d >= weekAgo && d <= now && sess.status === "completed";
    }).length;
    return s + sessionsThisWeek * 2;
  }, 0));
  const avgScore = examResults.length > 0 ? Math.round(examResults.reduce((s, r) => s + r.score, 0) / examResults.length) : 0;

  const upcomingSessions = classes.flatMap(c => c.sessions.filter(s => s.status === "scheduled").map(s => ({ ...s, className: c.name, tutorName: c.tutorName, tutorAvatar: c.tutorAvatar, subject: c.subject }))).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const gpaData = monthlyProgress.map(m => ({ month: m.month.replace("/2025", "").replace("/2026", ""), gpa: m.gpa }));

  const stats = [
    { label: "Lớp đang học", value: activeClasses.length, sub: `${classes.filter(c => c.status === "completed").length} hoàn thành`, icon: BookOpen, link: "/student/classes" },
    { label: "Buổi đã học", value: completedSessions, sub: `/ ${classes.reduce((s, c) => s + c.totalSessions, 0)} tổng`, icon: CheckCircle2, link: "/student/schedule" },
    { label: "Giờ học / tuần", value: weeklyStudyHours > 0 ? weeklyStudyHours : 12, sub: `Mục tiêu: ${weeklyGoal.target}h`, icon: Clock, link: "/student/schedule" },
    { label: "Điểm TB", value: `${avgScore}%`, sub: `${examResults.length} bài thi`, icon: TrendingUp, link: "/student/results" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <button key={i} onClick={() => navigate(s.link)} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-elevated transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ))}
      </div>

      {/* Weekly Goals */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" /> Mục tiêu tuần này
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Giờ học</span>
              <span className="text-xs font-semibold text-foreground">{weeklyGoal.current}/{weeklyGoal.target}h</span>
            </div>
            <Progress value={(weeklyGoal.current / weeklyGoal.target) * 100} className="h-2.5" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">GPA hiện tại</span>
              <span className="text-xs font-semibold text-foreground">{profile.gpa} / {profile.goalGpa}</span>
            </div>
            <Progress value={(profile.gpa / profile.goalGpa) * 100} className="h-2.5" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Bài test hoàn thành</span>
              <span className="text-xs font-semibold text-foreground">{examResults.length}</span>
            </div>
            <Progress value={Math.min(100, (examResults.length / 10) * 100)} className="h-2.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" /> Lịch học sắp tới
            </h3>
            <div className="space-y-3">
              {upcomingSessions.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <img src={s.tutorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.date} • {s.time}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-foreground")}>
                    {s.format === "online" ? "Online" : "Offline"}
                  </span>
                  {s.format === "online" && s.meetingLink && (
                    <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => navigate(s.meetingLink!)}>Vào lớp</Button>
                  )}
                </div>
              ))}
              {upcomingSessions.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có buổi học nào sắp tới</p>}
            </div>
          </div>

          {/* GPA Progress Chart - colorful */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" /> Tiến độ GPA
            </h3>
            <ChartContainer config={{ gpa: { label: "GPA", color: COLORS[0] } }} className="h-[200px] w-full">
              <AreaChart data={gpaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="dashGpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={[6, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="gpa" stroke={COLORS[0]} strokeWidth={3} fill="url(#dashGpaGrad)" dot={{ r: 5, fill: COLORS[0] }} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Wallet quick view */}
          <button onClick={() => navigate("/student/wallet")} className="w-full bg-card border border-border rounded-2xl p-5 text-left hover:shadow-elevated transition-all group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Wallet className="w-4 h-4 text-muted-foreground" /> Ví học phí</h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</p>
            <p className="text-[10px] text-muted-foreground mt-1">Nhấn để xem chi tiết</p>
          </button>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Tiến độ lớp học</h3>
            <div className="space-y-3">
              {activeClasses.map(c => (
                <button key={c.id} onClick={() => navigate("/student/classes")} className="w-full text-left group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <img src={c.tutorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.tutorName}</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{Math.round((c.completedSessions / c.totalSessions) * 100)}%</span>
                  </div>
                  <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-1.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Kết quả gần nhất</h3>
            {examResults.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2 last:mb-0">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold", r.passed ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>
                  {r.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground">{r.completedAt}</p>
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", r.passed ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>
                  {r.passed ? "Đạt" : "Chưa đạt"}
                </span>
              </div>
            ))}
            <button onClick={() => navigate("/student/results")} className="w-full mt-3 text-xs text-primary font-medium hover:underline">Xem tất cả</button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Truy cập nhanh</h3>
            {[
              { label: "Tìm gia sư mới", link: "/student/find-tutor", icon: Search },
              { label: "Thi thử THPTQG", link: "/student/mock-exam", icon: ClipboardCheck },
              { label: "Xem báo cáo", link: "/student/report", icon: BarChart3 },
              { label: "Ví học phí", link: "/student/wallet", icon: Wallet },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.link)} className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2 last:mb-0 text-left hover:bg-muted transition-colors group">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground flex-1">{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
