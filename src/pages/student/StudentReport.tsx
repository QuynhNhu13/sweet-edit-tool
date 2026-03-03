import { useStudent } from "@/contexts/StudentContext";
import { TrendingUp, Target, Clock, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, AreaChart, Area, Cell, RadialBarChart, RadialBar, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  "hsl(224, 76%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 68%, 55%)",
  "hsl(0, 84%, 60%)",
  "hsl(190, 90%, 42%)",
];

const StudentReport = () => {
  const { profile, classes, examResults, monthlyProgress } = useStudent();

  const totalStudyHours = monthlyProgress.reduce((s, m) => s + m.studyHours, 0);
  const goalAchieved = Math.round((profile.gpa / profile.goalGpa) * 100);
  const achievements = [
    "Hoàn thành 100+ giờ học",
    "GPA tăng 0.8 trong 6 tháng",
    `${examResults.filter(r => r.passed).length} bài thi đạt`,
    "Chuyên cần > 90%",
  ];

  const gpaData = monthlyProgress.map(m => ({ month: m.month.replace("/2025", "").replace("/2026", ""), gpa: m.gpa }));
  const hoursData = monthlyProgress.map(m => ({ month: m.month.replace("/2025", "").replace("/2026", ""), hours: m.studyHours }));
  const sessionsData = monthlyProgress.map(m => ({ month: m.month.replace("/2025", "").replace("/2026", ""), sessions: m.sessionsCompleted, tests: m.testsCompleted }));

  const tutorComments = [
    { tutor: "Nguyễn Văn An", subject: "Toán", comment: "Châu tiến bộ rất nhanh trong 3 tháng qua. Phần đạo hàm và tích phân đã vững. Cần cải thiện thêm hình học không gian.", date: "2026-02-28" },
    { tutor: "Võ Minh Tuấn", subject: "Lý", comment: "Nắm tốt phần cơ học, cần ôn thêm phần điện từ. Tinh thần học tập tốt.", date: "2026-02-25" },
  ];

  const nextGoals = [
    "Đạt GPA 8.5 cuối HK2",
    "Hoàn thành 5 đề thi thử THPTQG",
    "Cải thiện điểm Hình học lên 8+",
    "Luyện IELTS Writing đạt 6.5",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "GPA hiện tại", value: profile.gpa.toFixed(1), icon: TrendingUp },
          { label: "% đạt mục tiêu", value: `${goalAchieved}%`, icon: Target },
          { label: "Tổng giờ học", value: `${totalStudyHours}h`, icon: Clock },
          { label: "Thành tích", value: achievements.length, icon: Trophy },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Chart - colorful */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" /> Tiến độ GPA theo tháng
          </h3>
          <ChartContainer config={{ gpa: { label: "GPA", color: COLORS[0] } }} className="h-[220px] w-full">
            <AreaChart data={gpaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis domain={[6, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="gpa" stroke={COLORS[0]} strokeWidth={3} fill="url(#gpaGradient)" dot={{ r: 5, fill: COLORS[0] }} />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Study Hours Chart - colorful bars */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Giờ học theo tháng
          </h3>
          <ChartContainer config={{ hours: { label: "Giờ học", color: COLORS[1] } }} className="h-[220px] w-full">
            <BarChart data={hoursData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {hoursData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Sessions & Tests Chart - dual color */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" /> Buổi học & Bài test theo tháng
        </h3>
        <ChartContainer config={{ sessions: { label: "Buổi học", color: COLORS[0] }, tests: { label: "Bài test", color: COLORS[2] } }} className="h-[220px] w-full">
          <BarChart data={sessionsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sessions" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
            <Bar dataKey="tests" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tutor Comments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Nhận xét từ gia sư</h3>
          <div className="space-y-4">
            {tutorComments.map((c, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.tutor}</p>
                    <p className="text-[10px] text-muted-foreground">{c.subject} • {c.date}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Achievements */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" /> Mục tiêu tháng tới
            </h3>
            <div className="space-y-2">
              {nextGoals.map((g, i) => (
                <div key={i} className="flex items-start gap-2 p-2">
                  <span className="w-5 h-5 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-foreground">{g}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted-foreground" /> Thành tích
            </h3>
            <div className="space-y-2">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <Trophy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GPA Goal Progress */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Tiến độ GPA</h3>
            <div className="text-center mb-3">
              <p className="text-3xl font-bold text-foreground">{profile.gpa}</p>
              <p className="text-xs text-muted-foreground">Mục tiêu: {profile.goalGpa}</p>
            </div>
            <Progress value={goalAchieved} className="h-3" />
            <p className="text-[10px] text-muted-foreground text-center mt-2">{goalAchieved}% hoàn thành mục tiêu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
