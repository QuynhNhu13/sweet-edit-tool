import { useExamManager, Exam } from "@/contexts/ExamManagerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const difficultyLabels = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };
const modeLabels = { auto_generate: "Tự động generate mỗi lượt", fixed_set: "Bộ đề cố định" };

const ExamManagerAIConfig = () => {
  const { exams, updateExam } = useExamManager();
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id || "");
  const [topicRatio, setTopicRatio] = useState([30, 25, 20, 15, 10]);

  const exam = exams.find(e => e.id === selectedExam);
  const topics = ["Hàm số", "Tích phân", "Xác suất", "Hình học", "Đại số"];

  if (!exam) return <div className="p-6"><p className="text-muted-foreground">Chưa có đề thi nào</p></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-80 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4" /> Chế độ AI Generate</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {(["auto_generate", "fixed_set"] as const).map(mode => (
                <button key={mode} onClick={() => updateExam(exam.id, { aiMode: mode })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${exam.aiMode === mode ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <p className="text-sm font-medium text-foreground">{modeLabels[mode]}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mode === "auto_generate" ? "Mỗi lần thi hệ thống sẽ generate đề mới từ ngân hàng câu hỏi" : "Sử dụng bộ đề đã soạn sẵn, không thay đổi giữa các lượt"}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4" /> Cấu hình độ khó</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {(["easy", "medium", "hard"] as const).map(d => (
                <button key={d} onClick={() => updateExam(exam.id, { difficulty: d })}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${exam.difficulty === d ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{difficultyLabels[d]}</p>
                    {exam.difficulty === d && <Badge variant="default" className="text-[10px]">Đang chọn</Badge>}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Tỷ lệ câu hỏi theo chủ đề</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {topics.map((t, i) => (
              <div key={t} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t}</span>
                  <span className="text-xs font-medium text-muted-foreground">{topicRatio[i]}%</span>
                </div>
                <Slider value={[topicRatio[i]]} max={100} step={5} onValueChange={v => { const nr = [...topicRatio]; nr[i] = v[0]; setTopicRatio(nr); }} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Tổng: {topicRatio.reduce((s, v) => s + v, 0)}%</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> AI Proctoring</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">Giám sát chống gian lận</p>
                <p className="text-xs text-muted-foreground">Phát hiện chuyển tab, chia màn hình, copy/paste</p>
              </div>
              <Switch checked={exam.aiProctoring} onCheckedChange={v => updateExam(exam.id, { aiProctoring: v })} />
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Tính năng bao gồm:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Phát hiện rời khỏi tab thi</li>
                <li>Chặn copy/paste nội dung</li>
                <li>Ghi nhận thời gian bất thường</li>
                <li>Cảnh báo realtime cho admin</li>
              </ul>
            </div>
            <Button onClick={() => toast({ title: "Đã lưu cấu hình AI" })} className="w-full rounded-xl">Lưu cấu hình</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamManagerAIConfig;
