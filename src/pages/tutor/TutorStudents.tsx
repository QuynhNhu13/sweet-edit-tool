import { useTutor } from "@/contexts/TutorContext";
import { Users, TrendingUp, Target, BookOpen, BarChart3, Search, X, Phone, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const TutorStudents = () => {
  const { studentProgress } = useTutor();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterCompletion, setFilterCompletion] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const sp = selected ? studentProgress.find(s => s.studentId + s.classId === selected) : null;

  const totalStudents = new Set(studentProgress.map(s => s.studentId)).size;
  const activeStudents = studentProgress.filter(s => s.completedSessions > 0 && s.completedSessions < s.totalSessions).length;
  const avgAttendance = studentProgress.filter(s => s.completedSessions > 0).reduce((sum, s) => sum + s.attendanceRate, 0) / Math.max(1, studentProgress.filter(s => s.completedSessions > 0).length);
  const avgScore = studentProgress.filter(s => s.averageScore > 0).reduce((sum, s) => sum + s.averageScore, 0) / Math.max(1, studentProgress.filter(s => s.averageScore > 0).length);

  const subjects = [...new Set(studentProgress.map(s => s.subject))];
  const filtered = studentProgress.filter(s => {
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase()) && !s.className.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSubject !== "all" && s.subject !== filterSubject) return false;
    if (filterCompletion === "completed" && s.goalCompletion < 100) return false;
    if (filterCompletion === "in_progress" && (s.goalCompletion >= 100 || s.completedSessions === 0)) return false;
    if (filterCompletion === "not_started" && s.completedSessions > 0) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedStudents = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const chartConfig = { score: { label: "Điểm", color: "hsl(var(--primary))" } };

  return (
    <div className="p-6 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
          <p className="text-xs text-muted-foreground">Tổng học sinh</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <BookOpen className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{activeStudents}</p>
          <p className="text-xs text-muted-foreground">Đang học</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{avgAttendance.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">Chuyên cần TB</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <BarChart3 className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{avgScore.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Điểm TB</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên học sinh, lớp..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="all">Tất cả môn</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterCompletion} onChange={e => setFilterCompletion(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="in_progress">Đang học</option>
          <option value="completed">Hoàn thành</option>
          <option value="not_started">Chưa bắt đầu</option>
        </select>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pagedStudents.map(s => (
          <button key={s.studentId + s.classId} onClick={() => setSelected(s.studentId + s.classId)} className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-elevated transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img src={s.studentAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-foreground">{s.studentName}</p>
                <p className="text-xs text-muted-foreground">{s.className} • {s.subject} • {s.studentGrade}</p>
              </div>
              {s.goalCompletion === 100 && <span className="text-[10px] font-medium bg-emerald-100 text-success dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-lg">Hoàn thành</span>}
              {s.completedSessions === 0 && <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-lg">Chưa học</span>}
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.completedSessions}/{s.totalSessions}</p>
                <p className="text-[10px] text-muted-foreground">Buổi học</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.averageScore > 0 ? s.averageScore.toFixed(1) : "—"}</p>
                <p className="text-[10px] text-muted-foreground">Điểm TB</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className={cn("text-lg font-bold", s.attendanceRate >= 90 ? "text-success" : s.attendanceRate >= 70 ? "text-warning" : "text-destructive")}>{s.attendanceRate}%</p>
                <p className="text-[10px] text-muted-foreground">Chuyên cần</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.homeworkCompletion}%</p>
                <p className="text-[10px] text-muted-foreground">BTVN</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-primary">{s.goalCompletion}%</p>
                <p className="text-[10px] text-muted-foreground">Mục tiêu</p>
              </div>
            </div>
            <Progress value={s.goalCompletion} className="h-1.5 mt-3" />
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không tìm thấy học sinh nào</p>}

      {filtered.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink href="#" isActive={currentPage === idx + 1} onClick={(e) => { e.preventDefault(); setPage(idx + 1); }}>
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pageCount, p + 1)); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {sp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img src={sp.studentAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <span>{sp.studentName}</span>
                    <p className="text-xs text-muted-foreground font-normal">{sp.className} • {sp.studentGrade}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-muted/50 rounded-xl flex items-center gap-2"><Phone className="w-3 h-3 text-muted-foreground" /><span>{sp.studentPhone}</span></div>
                <div className="p-3 bg-muted/50 rounded-xl flex items-center gap-2"><Mail className="w-3 h-3 text-muted-foreground" /><span className="truncate">{sp.studentEmail}</span></div>
                <div className="p-3 bg-muted/50 rounded-xl flex items-center gap-2"><Users className="w-3 h-3 text-muted-foreground" /><span>PH: {sp.parentName}</span></div>
                <div className="p-3 bg-muted/50 rounded-xl flex items-center gap-2"><Calendar className="w-3 h-3 text-muted-foreground" /><span>Từ {sp.startDate}</span></div>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
                  <TabsTrigger value="scores">Điểm số</TabsTrigger>
                  <TabsTrigger value="reports">Báo cáo</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><BookOpen className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-2xl font-bold text-foreground">{sp.completedSessions}/{sp.totalSessions}</p><p className="text-xs text-muted-foreground">Buổi</p></div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-2xl font-bold text-foreground">{sp.averageScore > 0 ? sp.averageScore.toFixed(1) : "—"}</p><p className="text-xs text-muted-foreground">Điểm TB</p></div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><CheckCircle2 className={cn("w-5 h-5 mx-auto mb-1", sp.attendanceRate >= 90 ? "text-success" : "text-warning")} /><p className="text-2xl font-bold text-foreground">{sp.attendanceRate}%</p><p className="text-xs text-muted-foreground">Chuyên cần</p></div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><Target className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-2xl font-bold text-primary">{sp.goalCompletion}%</p><p className="text-xs text-muted-foreground">Mục tiêu</p></div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><p className="text-2xl font-bold text-foreground">{sp.homeworkCompletion}%</p><p className="text-xs text-muted-foreground">BTVN</p></div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center"><p className="text-2xl font-bold text-foreground">{sp.missedSessions}</p><p className="text-xs text-muted-foreground">Buổi vắng</p></div>
                  </div>
                  {sp.notes && <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10"><p className="text-xs text-muted-foreground mb-1">Ghi chú</p><p className="text-sm text-foreground">{sp.notes}</p></div>}
                </TabsContent>

                <TabsContent value="skills" className="space-y-3">
                  {sp.skills.map(skill => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {skill.prevScore} → <span className="text-primary font-semibold">{skill.score}</span>
                          {skill.score > skill.prevScore && <TrendingUp className="w-3 h-3 text-success inline ml-1" />}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 relative">
                        <div className="bg-muted-foreground/20 rounded-full h-2 absolute" style={{ width: `${skill.prevScore * 10}%` }} />
                        <div className="bg-primary rounded-full h-2 relative" style={{ width: `${skill.score * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="scores">
                  {sp.scoreHistory.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <LineChart data={sp.scoreHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                      </LineChart>
                    </ChartContainer>
                  ) : <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>}
                </TabsContent>

                <TabsContent value="reports" className="space-y-3">
                  {sp.weeklyReports.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Chưa có báo cáo</p>
                  ) : sp.weeklyReports.map((r, i) => (
                    <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-foreground">{r.week}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{r.sessions} buổi</span>
                          <span className="font-semibold text-primary">{r.avgScore.toFixed(1)} điểm</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.notes}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorStudents;
