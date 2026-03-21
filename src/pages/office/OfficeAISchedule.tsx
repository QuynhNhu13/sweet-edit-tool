import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarCog, Play, CheckCircle2, AlertTriangle, Clock, BookOpen, Users, Monitor, Info, RefreshCw, Save } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleResult {
  id: string;
  day: string;
  dayNum: string;
  className: string;
  tutor: string;
  room: string;
  time: string;
}

const OfficeAISchedule = () => {
  const { constraints, classes } = useOffice();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeFrame, setTimeFrame] = useState("next_week");
  const [branch, setBranch] = useState("all");
  const [objective, setObjective] = useState("balanced");
  const [hardConstraints, setHardConstraints] = useState({ noWeekend: true, maxSessions: true, matchSubject: true });

  const steps = [
    "Khởi tạo bộ dữ liệu lớp học, giáo viên và phòng học...",
    "Phân tích ràng buộc lịch giáo viên & học sinh...",
    "Tối ưu hóa phân bổ phòng học theo môn...",
    "Kiểm tra xung đột thời khóa biểu và hoàn tất..."
  ];

  const pendingClasses = classes.filter(c => c.status === "active" || c.status === "searching").length;

  const runScheduler = useCallback(() => {
    setIsRunning(true);
    setIsDone(false);
    setProgress(0);
    setResults([]);
    setCurrentStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const pct = Math.min(step * 4, 100);
      setProgress(pct);
      setCurrentStep(Math.min(Math.floor(step / 6), steps.length - 1));

      if (pct >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setIsDone(true);
        setResults([
          { id: "r1", day: "THỨ 2", dayNum: "09", className: "Toán 12 Nâng cao", tutor: "Nguyễn Văn An", room: "Phòng 301", time: "07:30 - 09:00" },
          { id: "r2", day: "THỨ 2", dayNum: "09", className: "Vật lý 11", tutor: "Trần Thị Bình", room: "Phòng 302", time: "09:15 - 10:45" },
          { id: "r3", day: "THỨ 3", dayNum: "10", className: "Hóa học 10", tutor: "Lê Văn Tiến", room: "Phòng 201", time: "14:00 - 15:30" },
          { id: "r4", day: "THỨ 4", dayNum: "11", className: "Tiếng Anh 12", tutor: "Phạm Thị Hoa", room: "Phòng 105", time: "07:30 - 09:00" },
          { id: "r5", day: "THỨ 5", dayNum: "12", className: "Ngữ văn 11", tutor: "Hoàng Minh Đức", room: "Phòng 303", time: "14:00 - 15:30" },
          { id: "r6", day: "THỨ 6", dayNum: "13", className: "Toán 10 Cơ bản", tutor: "Nguyễn Văn An", room: "Phòng 201", time: "09:15 - 10:45" },
        ]);
      }
    }, 120);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Sử dụng thuật toán AI để sắp xếp thời khóa biểu tối ưu cho lớp 10-12 dựa trên phòng học, giáo viên và lịch rảnh của học sinh.</p>
      </div>

      {isDone && (
        <div className="flex items-center justify-between p-4 bg-success/15 dark:bg-emerald-950/30 border border-success/30 dark:border-success/40 rounded-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <div>
              <p className="text-sm font-semibold text-success dark:text-emerald-400">Tạo lịch thành công!</p>
              <p className="text-xs text-success dark:text-success">Tất cả {results.length} lớp học đã tìm được thời gian phù hợp mà không bị xung đột.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { setIsDone(false); setResults([]); }}><RefreshCw className="w-4 h-4 mr-1" /> Làm lại</Button>
            <Button className="rounded-xl" onClick={() => toast({ title: "Đã duyệt và lưu lịch trình" })}><Save className="w-4 h-4 mr-1" /> Duyệt và Lưu</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!isDone && (
            <Card className="border-border">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1"><CalendarCog className="w-5 h-5" /> Cấu hình tham số xếp lịch</h3>
                  <p className="text-xs text-muted-foreground">Thiết lập các ràng buộc và ưu tiên cho thuật toán xếp thời khóa biểu</p>
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Thời gian dự kiến</p>
                    <Select value={timeFrame} onValueChange={setTimeFrame}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="next_week">Tuần tiếp theo</SelectItem><SelectItem value="next_month">Tháng tiếp theo</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Cơ sở áp dụng</p>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Tất cả cơ sở</SelectItem><SelectItem value="cs1">Cơ sở 1</SelectItem><SelectItem value="cs2">Cơ sở 2</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Mục tiêu tối ưu hóa hàng đầu</p>
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger className="rounded-xl w-96"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Cân bằng đều tải giáo viên & phòng học</SelectItem>
                      <SelectItem value="room">Tối ưu phòng học</SelectItem>
                      <SelectItem value="tutor">Tối ưu lịch giáo viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Ràng buộc cứng</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.noWeekend} onCheckedChange={v => setHardConstraints(p => ({ ...p, noWeekend: !!v }))} />
                      <span className="text-sm text-foreground">Không xếp lịch vào cuối tuần (Thứ 7, CN)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.maxSessions} onCheckedChange={v => setHardConstraints(p => ({ ...p, maxSessions: !!v }))} />
                      <span className="text-sm text-foreground">Giáo viên không dạy quá 4 tiết một ngày</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.matchSubject} onCheckedChange={v => setHardConstraints(p => ({ ...p, matchSubject: !!v }))} />
                      <span className="text-sm text-foreground">Giáo viên chỉ dạy đúng môn chuyên ngành</span>
                    </label>
                  </div>
                </div>

                {isRunning && (
                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                        <CalendarCog className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-base font-semibold text-foreground">Đang xếp thời khóa biểu...</p>
                        <p className="text-xs text-muted-foreground mt-1">Hệ thống đang kiểm tra chéo lịch giáo viên, phòng học và học sinh để đảm bảo không xung đột.</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Tiến trình</span>
                        <span className="text-sm font-medium text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl space-y-2">
                      {steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {i < currentStep ? <CheckCircle2 className="w-4 h-4 text-success" /> : i === currentStep ? <Clock className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "2s" }} /> : <div className="w-4 h-4" />}
                          <span className={`text-xs ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={runScheduler} disabled={isRunning} className="w-full rounded-xl h-12 text-sm font-semibold">
                  <CalendarCog className="w-5 h-5 mr-2" /> {isRunning ? "Đang xử lý..." : "Bắt đầu xếp lịch thông minh"}
                </Button>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Bản nháp thời khóa biểu</CardTitle>
                  <Select defaultValue="list"><SelectTrigger className="w-36 rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="list">Dạng Danh sách</SelectItem><SelectItem value="calendar">Dạng Lịch</SelectItem></SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors">
                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{r.day}</p>
                      <p className="text-2xl font-bold text-foreground">{r.dayNum}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{r.className}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.tutor}</span>
                        <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {r.room}</span>
                      </p>
                    </div>
                    <p className="text-sm font-medium text-primary">{r.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {isDone && (
            <Card className="border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base">Thống kê lịch</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">Tỷ lệ sử dụng phòng học</span>
                    <span className="text-sm font-bold text-primary">88% (Tốt)</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">Phân bổ tiết dạy giáo viên</span>
                    <span className="text-sm font-bold text-primary">Cân bằng</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base">Dữ liệu đầu vào</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">Trạng thái dữ liệu hiện tại</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary" /></div><span className="text-sm text-foreground">Lớp chờ xếp lịch</span></div>
                  <span className="text-lg font-bold text-foreground">{pendingClasses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-success/150/10 flex items-center justify-center"><Users className="w-4 h-4 text-success" /></div><span className="text-sm text-foreground">Giáo viên tham gia</span></div>
                  <span className="text-lg font-bold text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Monitor className="w-4 h-4 text-purple-600" /></div><span className="text-sm text-foreground">Phòng học trống</span></div>
                  <span className="text-lg font-bold text-purple-600">10</span>
                </div>
              </div>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">Thuật toán sẽ tối ưu hoá phân bổ phòng học cho các môn Toán, Lý, Hóa, Văn, Anh lớp 10-12.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficeAISchedule;
