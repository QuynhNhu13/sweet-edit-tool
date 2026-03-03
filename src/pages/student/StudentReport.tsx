import { useStudent } from "@/contexts/StudentContext";
import { TrendingUp, Target, Clock, Trophy, BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

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
          { label: "GPA hiện tại", value: profile.gpa.toFixed(1), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "% đạt mục tiêu", value: `${goalAchieved}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Tổng giờ học", value: `${totalStudyHours}h`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Thành tích", value: achievements.length, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.bg)}>
              <s.icon className={cn("w-6 h-6", s.color)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Tiến độ GPA theo tháng
          </h3>
          <ChartContainer config={{ gpa: { label: "GPA", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
            <LineChart data={gpaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis domain={[6, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Study Hours Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Giờ học theo tháng
          </h3>
          <ChartContainer config={{ hours: { label: "Giờ học", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
            <BarChart data={hoursData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tutor Comments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Nhận xét từ gia sư
          </h3>
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
              <Target className="w-4 h-4 text-primary" /> Mục tiêu tháng tới
            </h3>
            <div className="space-y-2">
              {nextGoals.map((g, i) => (
                <div key={i} className="flex items-start gap-2 p-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-foreground">{g}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Thành tích
            </h3>
            <div className="space-y-2">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg">
                  <span className="text-amber-500">🏆</span>
                  <p className="text-xs text-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
