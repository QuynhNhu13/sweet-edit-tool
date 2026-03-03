import { useStudent } from "@/contexts/StudentContext";
import { Trophy, CheckCircle2, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const StudentResults = () => {
  const { examResults } = useStudent();

  const totalExams = examResults.length;
  const avgScore = totalExams > 0 ? Math.round(examResults.reduce((s, r) => s + r.score, 0) / totalExams) : 0;
  const passedCount = examResults.filter(r => r.passed).length;
  const highestScore = totalExams > 0 ? Math.max(...examResults.map(r => r.score)) : 0;

  const stats = [
    { label: "Tổng bài thi", value: totalExams, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
    { label: "Điểm trung bình", value: `${avgScore}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Số bài đạt", value: passedCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Điểm cao nhất", value: `${highestScore}%`, icon: Star, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
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

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Chi tiết kết quả</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] text-muted-foreground font-medium p-3">Bài thi</th>
                <th className="text-left text-[11px] text-muted-foreground font-medium p-3">Môn</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Điểm</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Đúng</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Thời gian</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Ngày</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {examResults.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-sm font-medium text-foreground">{r.title}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{r.subject}</Badge></td>
                  <td className="p-3 text-center">
                    <span className={cn("text-sm font-bold", r.score >= 70 ? "text-emerald-600" : r.score >= 50 ? "text-amber-500" : "text-destructive")}>{r.score}%</span>
                  </td>
                  <td className="p-3 text-center text-sm text-muted-foreground">{r.correctAnswers}/{r.totalQuestions}</td>
                  <td className="p-3 text-center text-sm text-muted-foreground">{r.duration} phút</td>
                  <td className="p-3 text-center text-xs text-muted-foreground">{r.completedAt}</td>
                  <td className="p-3 text-center">
                    <Badge className={cn("text-[10px]", r.passed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-destructive/10 text-destructive")}>
                      {r.passed ? "Đạt" : "Chưa đạt"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {examResults.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Chưa có kết quả thi nào</p>}
      </div>
    </div>
  );
};

export default StudentResults;
