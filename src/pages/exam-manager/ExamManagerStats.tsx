import { useExamManager } from "@/contexts/ExamManagerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, DollarSign, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { useState } from "react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--muted-foreground))"];

const ExamManagerStats = () => {
  const { exams, attempts } = useExamManager();
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredExams = selectedSubject === "all" ? exams : exams.filter(e => e.subject === selectedSubject);
  const subjects = [...new Set(exams.map(e => e.subject))];

  const subjectData = subjects.map(s => {
    const subExams = exams.filter(e => e.subject === s);
    return { name: s, attempts: subExams.reduce((sum, e) => sum + e.attempts, 0), revenue: subExams.reduce((sum, e) => sum + e.revenue, 0) };
  });

  const completionData = filteredExams.filter(e => e.attempts > 0).map(e => ({ name: e.subject, completionRate: e.completionRate, aboveAvg: e.aboveAverageRate }));

  const monthlyRevenue = [
    { month: "T10", revenue: 15000000 }, { month: "T11", revenue: 22000000 }, { month: "T12", revenue: 28000000 },
    { month: "T1", revenue: 35000000 }, { month: "T2", revenue: 42000000 }, { month: "T3", revenue: 56000000 },
  ];

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả môn</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng lượt thi", value: filteredExams.reduce((s, e) => s + e.attempts, 0).toLocaleString("vi-VN"), icon: FileText },
          { label: "Doanh thu", value: `${(filteredExams.reduce((s, e) => s + e.revenue, 0) / 1000000).toFixed(1)}M`, icon: DollarSign },
          { label: "TB hoàn thành", value: `${(filteredExams.filter(e => e.attempts > 0).reduce((s, e) => s + e.completionRate, 0) / (filteredExams.filter(e => e.attempts > 0).length || 1)).toFixed(0)}%`, icon: TrendingUp },
          { label: "TB trên TB", value: `${(filteredExams.filter(e => e.attempts > 0).reduce((s, e) => s + e.aboveAverageRate, 0) / (filteredExams.filter(e => e.attempts > 0).length || 1)).toFixed(0)}%`, icon: Users },
        ].map((s, i) => (
          <Card key={s.label} className="border-0 text-white shadow-lg" style={{ backgroundImage: ["linear-gradient(to right, #2563eb, #3b82f6)", "linear-gradient(to right, #10b981, #14b8a6)", "linear-gradient(to right, #f59e0b, #f97316)", "linear-gradient(to right, #a855f7, #d946ef)"][i % 4] }}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Lượt thi theo môn</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Bar dataKey="attempts" name="Lượt thi" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Doanh thu theo môn</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={subjectData} cx="50%" cy="50%" outerRadius={100} dataKey="revenue" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Tỷ lệ hoàn thành & Đạt TB</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completionRate" name="Hoàn thành (%)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aboveAvg" name="Trên TB (%)" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Doanh thu 6 tháng</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base">Lịch sử thi gần đây</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {attempts.map(a => {
            const exam = exams.find(e => e.id === a.examId);
            return (
              <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.studentName}</p>
                  <p className="text-xs text-muted-foreground">{exam?.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${a.score >= 5 ? "text-success" : "text-red-600"}`}>{a.score} điểm</p>
                  <p className="text-[10px] text-muted-foreground">{a.completedAt}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamManagerStats;
