import { useTutor } from "@/contexts/TutorContext";
import { Users, TrendingUp, Target, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TutorStudents = () => {
  const { studentProgress } = useTutor();
  const [selected, setSelected] = useState<string | null>(null);
  const sp = selected ? studentProgress.find(s => s.studentId === selected) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {studentProgress.map(s => (
          <button key={s.studentId} onClick={() => setSelected(s.studentId)} className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-elevated transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img src={s.studentAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-base font-semibold text-foreground">{s.studentName}</p>
                <p className="text-xs text-muted-foreground">{s.className} • {s.subject}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.completedSessions}/{s.totalSessions}</p>
                <p className="text-[10px] text-muted-foreground">Buổi học</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.averageScore > 0 ? s.averageScore.toFixed(1) : "—"}</p>
                <p className="text-[10px] text-muted-foreground">Điểm TB</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-foreground">{s.attendanceRate}%</p>
                <p className="text-[10px] text-muted-foreground">Chuyên cần</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold text-primary">{s.goalCompletion}%</p>
                <p className="text-[10px] text-muted-foreground">Mục tiêu</p>
              </div>
            </div>
            {/* Goal progress bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
              <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${s.goalCompletion}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {sp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img src={sp.studentAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <span>{sp.studentName}</span>
                    <p className="text-xs text-muted-foreground font-normal">{sp.className}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="skills">
                <TabsList className="mb-4">
                  <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
                  <TabsTrigger value="reports">Báo cáo tuần</TabsTrigger>
                  <TabsTrigger value="stats">Tổng quan</TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="space-y-3">
                  <p className="text-xs text-muted-foreground">Biểu đồ tiến bộ theo kỹ năng</p>
                  {sp.skills.map(skill => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {skill.prevScore} → <span className="text-primary font-semibold">{skill.score}</span>
                          {skill.score > skill.prevScore && <TrendingUp className="w-3 h-3 text-emerald-500 inline ml-1" />}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 relative">
                        <div className="bg-muted-foreground/20 rounded-full h-2 absolute" style={{ width: `${skill.prevScore * 10}%` }} />
                        <div className="bg-primary rounded-full h-2 relative" style={{ width: `${skill.score * 10}%` }} />
                      </div>
                    </div>
                  ))}
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
                  <button className="w-full py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                    Xuất PDF báo cáo
                  </button>
                </TabsContent>

                <TabsContent value="stats">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted/50 rounded-xl text-center">
                      <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{sp.completedSessions}/{sp.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">Buổi hoàn thành</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center">
                      <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{sp.averageScore > 0 ? sp.averageScore.toFixed(1) : "—"}</p>
                      <p className="text-xs text-muted-foreground">Điểm trung bình</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center">
                      <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{sp.attendanceRate}%</p>
                      <p className="text-xs text-muted-foreground">Chuyên cần</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center">
                      <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-primary">{sp.goalCompletion}%</p>
                      <p className="text-xs text-muted-foreground">Hoàn thành mục tiêu</p>
                    </div>
                  </div>
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
