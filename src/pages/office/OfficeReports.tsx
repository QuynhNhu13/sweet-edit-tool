import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, BookOpen, TrendingUp, BarChart3, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const weeklyData = [
  { week: "Tuần 49", registrations: 29, classes: 10, requests: 69, satisfaction: 95 },
  { week: "Tuần 50", registrations: 45, classes: 14, requests: 61, satisfaction: 93 },
  { week: "Tuần 51", registrations: 58, classes: 16, requests: 53, satisfaction: 99 },
  { week: "Tuần 52", registrations: 35, classes: 6, requests: 43, satisfaction: 92 },
];

const dailyData = [
  { day: "T2", sessions: 12, issues: 1 },
  { day: "T3", sessions: 15, issues: 0 },
  { day: "T4", sessions: 10, issues: 2 },
  { day: "T5", sessions: 14, issues: 1 },
  { day: "T6", sessions: 16, issues: 0 },
  { day: "T7", sessions: 8, issues: 1 },
  { day: "CN", sessions: 5, issues: 0 },
];

const classDistribution = [
  { name: "Toán", value: 35 },
  { name: "Văn", value: 20 },
  { name: "Anh", value: 25 },
  { name: "Lý", value: 12 },
  { name: "Hóa", value: 8 },
];

const COLORS = [
  "#ef4444", // đỏ
  "#f59e0b", // cam
  "#3b82f6", // xanh dương
  "#10b981", // xanh lá
  "#a855f7", // tím
];

const kpiData = [
  { label: "Đăng ký mới", value: 7, target: 200, percent: 3.5 },
  { label: "Tỷ lệ chuyển đổi", value: "38%", target: "35%", percent: 100 },
  { label: "Thời gian phản hồi TB", value: "2.5h", target: "3h", percent: 83 },
  { label: "Tỷ lệ hài lòng", value: "94%", target: "90%", percent: 100 },
];

const quickReports = [
  "Báo cáo đăng ký tuần",
  "Báo cáo ghép lớp",
  "Báo cáo yêu cầu hỗ trợ",
  "Báo cáo hiệu suất nhân viên",
];

const OfficeReports = () => {
  const { attendance, classes, incidents } = useOffice();
  const { toast } = useToast();

  const stats = [
    { label: "Tổng buổi học tuần", value: dailyData.reduce((s, d) => s + d.sessions, 0), icon: BookOpen },
    { label: "Tỷ lệ điểm danh", value: "94%", icon: TrendingUp },
    { label: "Sự cố trong tuần", value: dailyData.reduce((s, d) => s + d.issues, 0), icon: BarChart3 },
    { label: "HS đang học", value: classes.filter(c => c.status === "active").length, icon: Users },
  ];

  const exportReport = () => {
    toast({ title: "Đã xuất báo cáo" });
  };

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo tuần này</h1>
          <p className="text-sm text-muted-foreground">Tổng hợp hoạt động văn phòng</p>
        </div>
        <Button variant="outline" className="rounded-2xl" onClick={exportReport}>
          <Download className="w-4 h-4 mr-1" /> Xuất báo cáo
        </Button>
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Tổng buổi học tuần */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{dailyData.reduce((s, d) => s + d.sessions, 0)}</p>
              <p className="text-xs text-white/80 mt-1">Tổng buổi học tuần</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tỷ lệ điểm danh */}
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">94%</p>
              <p className="text-xs text-white/80 mt-1">Tỷ lệ điểm danh</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Sự cố trong tuần */}
        <Card className="border-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{dailyData.reduce((s, d) => s + d.issues, 0)}</p>
              <p className="text-xs text-white/80 mt-1">Sự cố trong tuần</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: HS đang học */}
        <Card className="border-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{classes.filter(c => c.status === "active").length}</p>
              <p className="text-xs text-white/80 mt-1">HS đang học</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Buổi học & Sự cố theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                <Bar dataKey="sessions" name="Buổi học" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="issues" name="Sự cố" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Phân bổ lớp theo môn</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {classDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-soft border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Thống kê qua các tuần</CardTitle>
          <p className="text-xs text-muted-foreground">So sánh các chỉ số qua các tuần</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tuần</TableHead>
                  <TableHead className="text-center">Đăng ký mới</TableHead>
                  <TableHead className="text-center">Lớp tạo mới</TableHead>
                  <TableHead className="text-center">Yêu cầu xử lý</TableHead>
                  <TableHead className="text-center">Tỷ lệ hài lòng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map(w => (
                  <TableRow key={w.week}>
                    <TableCell className="font-medium">{w.week}</TableCell>
                    <TableCell className="text-center">{w.registrations}</TableCell>
                    <TableCell className="text-center">{w.classes}</TableCell>
                    <TableCell className="text-center">{w.requests}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={w.satisfaction >= 95 ? "default" : "secondary"} className="text-xs rounded-full">
                        {w.satisfaction}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Chỉ số KPI</CardTitle>
            <p className="text-xs text-muted-foreground">Hiệu suất so với mục tiêu</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiData.map(k => (
              <div key={k.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{k.label}</span>
                  <span className="text-sm font-medium text-foreground">{k.value} / {k.target}</span>
                </div>
                <Progress value={Math.min(k.percent, 100)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Báo cáo nhanh</CardTitle>
            <p className="text-xs text-muted-foreground">Tải xuống các báo cáo thường dùng</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickReports.map(r => (
              <button key={r} onClick={() => toast({ title: `Đang tải: ${r}` })} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{r}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficeReports;
