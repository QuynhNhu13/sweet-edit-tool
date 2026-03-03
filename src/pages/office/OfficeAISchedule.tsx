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
  const [hardConstraints, setHardConstraints] = useState({ noWeekend: true, maxSessions: true, matchEquipment: true });

  const steps = [
    "Khởi tạo bộ dữ liệu lớp học, giáo viên và phòng lab...",
    "Phân tích ràng buộc thời gian...",
    "Tối ưu hóa phân bổ phòng lab...",
    "Kiểm tra xung đột và hoàn tất..."
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
          { id: "r1", day: "THỨ 4", dayNum: "04", className: "Lập trình ReactJS (CB)", tutor: "Nguyễn Văn A", room: "Lab 301", time: "08:00 - 11:30" },
          { id: "r2", day: "THỨ 4", dayNum: "04", className: "Thiết kế UI/UX", tutor: "Trần Thị B", room: "Lab 302", time: "13:30 - 17:00" },
          { id: "r3", day: "THỨ 5", dayNum: "05", className: "Khoa học Dữ liệu", tutor: "Lê Văn Tiến", room: "Lab 405", time: "08:00 - 11:30" },
          { id: "r4", day: "THỨ 6", dayNum: "06", className: "Toán 12 - Ôn thi", tutor: "Nguyễn Văn An", room: "Lab 201", time: "14:00 - 16:00" },
        ]);
      }
    }, 120);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Sử dụng thuật toán AI để sắp xếp lịch học tối ưu dựa trên phòng máy, giảng viên và yêu cầu của học viên.</p>
      </div>

      {isDone && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Tạo lịch thành công!</p>
              <p className="text-xs text-emerald-600">Tất cả {results.length} lớp học đã tìm được thời gian phù hợp mà không bị xung đột.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { setIsDone(false); setResults([]); }}><RefreshCw className="w-4 h-4 mr-1" /> Làm lại</Button>
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast({ title: "Đã duyệt và lưu lịch trình" })}><Save className="w-4 h-4 mr-1" /> Duyệt và Lưu</Button>
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
                  <p className="text-xs text-muted-foreground">Thiết lập các ràng buộc và ưu tiên cho thuật toán</p>
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
                    <p className="text-sm font-medium text-foreground mb-2">Chi nhánh áp dụng</p>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem><SelectItem value="hcm">TP.HCM</SelectItem><SelectItem value="hn">Hà Nội</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Mục tiêu tối ưu hóa hàng đầu</p>
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger className="rounded-xl w-96"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Cân bằng đều tải giảng viên & phòng máy</SelectItem>
                      <SelectItem value="room">Tối ưu phòng máy</SelectItem>
                      <SelectItem value="tutor">Tối ưu lịch giảng viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Ràng buộc cứng</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.noWeekend} onCheckedChange={v => setHardConstraints(p => ({ ...p, noWeekend: !!v }))} />
                      <span className="text-sm text-foreground">Không xếp lịch vào dịp cuối tuần (Thứ 7, CN)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.maxSessions} onCheckedChange={v => setHardConstraints(p => ({ ...p, maxSessions: !!v }))} />
                      <span className="text-sm text-foreground">Giảng viên không dạy quá 3 ca một ngày</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={hardConstraints.matchEquipment} onCheckedChange={v => setHardConstraints(p => ({ ...p, matchEquipment: !!v }))} />
                      <span className="text-sm text-foreground">Phải khớp yêu cầu thiết bị (VD: khóa học AI cần Lab GPU)</span>
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
                        <p className="text-base font-semibold text-foreground">Đang thuật toán xếp lịch...</p>
                        <p className="text-xs text-muted-foreground mt-1">Hệ thống đang kiểm tra chéo &gt;10.000 biến để đảm bảo lịch trình tối ưu và không bị xung đột thời gian.</p>
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
                          {i < currentStep ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : i === currentStep ? <Clock className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "2s" }} /> : <div className="w-4 h-4" />}
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
                  <CardTitle className="text-base">Bản nháp lịch trình mới</CardTitle>
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
                    <p className="text-sm font-medium text-emerald-600">{r.time}</p>
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
                    <span className="text-sm text-foreground">Tỷ lệ dụng phòng Lab</span>
                    <span className="text-sm font-bold text-emerald-600">88% (Tốt)</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">Phân bổ ca dạy</span>
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
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-600" /></div><span className="text-sm text-foreground">Lớp đang chờ xếp</span></div>
                  <span className="text-lg font-bold text-foreground">{pendingClasses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Users className="w-4 h-4 text-emerald-600" /></div><span className="text-sm text-foreground">Giảng viên tham gia</span></div>
                  <span className="text-lg font-bold text-foreground">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Monitor className="w-4 h-4 text-purple-600" /></div><span className="text-sm text-foreground">Phòng Lab trống</span></div>
                  <span className="text-lg font-bold text-purple-600">8</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">Thuật toán sẽ tối đa hoá hiệu suất sử dụng phòng Lab. Dự kiến tỷ lệ trống khoảng 12%.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficeAISchedule;
