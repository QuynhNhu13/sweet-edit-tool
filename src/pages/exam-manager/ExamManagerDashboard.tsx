import { useExamManager } from "@/contexts/ExamManagerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, DollarSign, TrendingUp, BarChart3, Database, Settings, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExamManagerDashboard = () => {
  const { exams, attempts, questions } = useExamManager();
  const navigate = useNavigate();

  const totalAttempts = exams.reduce((s, e) => s + e.attempts, 0);
  const totalRevenue = exams.reduce((s, e) => s + e.revenue, 0);
  const openExams = exams.filter(e => e.status === "open").length;
  const avgCompletion = exams.filter(e => e.attempts > 0).reduce((s, e) => s + e.completionRate, 0) / (exams.filter(e => e.attempts > 0).length || 1);

  const stats = [
    { label: "Đề đang mở", value: openExams, icon: FileText, color: "bg-primary/100/10 text-primary" },
    { label: "Tổng lượt thi", value: totalAttempts.toLocaleString("vi-VN"), icon: Users, color: "bg-success/150/10 text-success" },
    { label: "Doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: "bg-warning/150/10 text-warning" },
    { label: "Tỷ lệ hoàn thành", value: `${avgCompletion.toFixed(0)}%`, icon: TrendingUp, color: "bg-purple-500/10 text-purple-600" },
    { label: "Ngân hàng câu hỏi", value: questions.length, icon: Database, color: "bg-red-500/10 text-red-600" },
    { label: "Đề nháp", value: exams.filter(e => e.status === "draft").length, icon: Eye, color: "bg-orange-500/10 text-orange-600" },
  ];

  const quickActions = [
    { label: "Quản lý đề thi", icon: FileText, action: () => navigate("/exam-manager/exams") },
    { label: "Cấu hình AI", icon: Settings, action: () => navigate("/exam-manager/ai-config") },
    { label: "Thống kê", icon: BarChart3, action: () => navigate("/exam-manager/stats") },
    { label: "Ngân hàng câu hỏi", icon: Database, action: () => navigate("/exam-manager/questions") },
  ];

  const recentAttempts = attempts.slice(0, 5);

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} className="border-0 bg-gradient-to-r text-white shadow-lg" style={{ backgroundImage: ["linear-gradient(to right, #2563eb, #3b82f6)", "linear-gradient(to right, #10b981, #14b8a6)", "linear-gradient(to right, #f59e0b, #f97316)", "linear-gradient(to right, #8b5cf6, #a855f7)", "linear-gradient(to right, #ef4444, #f43f5e)", "linear-gradient(to right, #0ea5e9, #22d3ee)" ][i % 6] }}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-white/80 mt-1">{s.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Lượt thi gần đây</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentAttempts.map(a => {
              const exam = exams.find(e => e.id === a.examId);
              return (
                <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.studentName}</p>
                    <p className="text-xs text-muted-foreground">{exam?.name} • {a.completedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${a.score >= 5 ? "text-success" : "text-red-600"}`}>{a.score}/{a.totalQuestions > 10 ? 10 : a.totalQuestions}</p>
                    <p className="text-[10px] text-muted-foreground">{a.duration} phút</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Top đề thi phổ biến</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {exams.filter(e => e.status === "open").sort((a, b) => b.attempts - a.attempts).slice(0, 5).map((e, i) => (
              <div key={e.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-warning/150/20 text-warning" : i === 1 ? "bg-gray-300/30 text-gray-600" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <span className="text-sm text-foreground">{e.subject}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{e.attempts.toLocaleString("vi-VN")} lượt</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base">Hành động nhanh</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map(a => (
              <Button key={a.label} variant="outline" onClick={a.action} className="h-auto py-4 flex flex-col gap-2 rounded-xl">
                <a.icon className="w-5 h-5" />
                <span className="text-xs">{a.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamManagerDashboard;
