import { useExamManager, ExamQuestion, Difficulty } from "@/contexts/ExamManagerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Database } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const difficultyConfig: Record<string, { label: string; className: string }> = {
  easy: { label: "Dễ", className: "bg-emerald-100 text-success" },
  medium: { label: "Trung bình", className: "bg-amber-100 text-warning" },
  hard: { label: "Khó", className: "bg-red-100 text-red-700" },
};

const ExamManagerQuestions = () => {
  const { questions, addQuestion, deleteQuestion } = useExamManager();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ content: "", options: ["", "", "", ""], correctAnswer: 0, topic: "", difficulty: "medium" as Difficulty, standard: "Chuẩn BGDDT 2025", subject: "Toán" });

  const subjects = [...new Set(questions.map(q => q.subject))];
  const topics = [...new Set(questions.map(q => q.topic))];

  const filtered = questions.filter(q => {
    const matchSearch = q.content.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || q.subject === subjectFilter;
    const matchDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
    return matchSearch && matchSubject && matchDifficulty;
  });

  const handleAdd = () => {
    if (!form.content || form.options.some(o => !o)) return;
    addQuestion({ id: `q${Date.now()}`, ...form });
    setForm({ content: "", options: ["", "", "", ""], correctAnswer: 0, topic: "", difficulty: "medium", standard: "Chuẩn BGDDT 2025", subject: "Toán" });
    setShowAdd(false);
    toast({ title: "Thêm câu hỏi thành công" });
  };

  const handleImport = () => {
    toast({ title: "Import thành công", description: "Đã thêm 10 câu hỏi từ file" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/100/10 flex items-center justify-center mb-3"><Database className="w-5 h-5 text-primary" /></div>
          <p className="text-2xl font-bold text-foreground">{questions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Tổng câu hỏi</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{subjects.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Môn học</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{topics.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Chủ đề</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{questions.filter(q => q.difficulty === "hard").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Câu hỏi khó</p>
        </CardContent></Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Input placeholder="Tìm câu hỏi..." value={search} onChange={e => setSearch(e.target.value)} className="w-56 h-9 text-sm rounded-xl" />
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tất cả môn</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="easy">Dễ</SelectItem><SelectItem value="medium">TB</SelectItem><SelectItem value="hard">Khó</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleImport}><Upload className="w-4 h-4 mr-1" /> Import file</Button>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Thêm câu hỏi</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Thêm câu hỏi mới</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nội dung câu hỏi</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="rounded-xl mt-1" rows={3} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Môn học</Label>
                    <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))}>
                      <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{["Toán","Vật lý","Hóa học","Sinh học","Tiếng Anh"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Chủ đề</Label><Input value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} className="rounded-xl mt-1" placeholder="VD: Hàm số" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Độ khó</Label>
                    <Select value={form.difficulty} onValueChange={v => setForm(p => ({ ...p, difficulty: v as Difficulty }))}>
                      <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="easy">Dễ</SelectItem><SelectItem value="medium">Trung bình</SelectItem><SelectItem value="hard">Khó</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Chuẩn</Label><Input value={form.standard} onChange={e => setForm(p => ({ ...p, standard: e.target.value }))} className="rounded-xl mt-1" /></div>
                </div>
                {form.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={form.correctAnswer === i} onChange={() => setForm(p => ({ ...p, correctAnswer: i }))} />
                    <Input value={o} onChange={e => { const opts = [...form.options]; opts[i] = e.target.value; setForm(p => ({ ...p, options: opts })); }} placeholder={`Đáp án ${String.fromCharCode(65 + i)}`} className="rounded-xl" />
                  </div>
                ))}
                <Button onClick={handleAdd} className="w-full rounded-xl">Thêm câu hỏi</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <Card key={q.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                  <Badge variant="outline" className="text-[10px]">{q.subject}</Badge>
                  <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${difficultyConfig[q.difficulty].className}`}>{difficultyConfig[q.difficulty].label}</span>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
              <p className="text-sm text-foreground mb-2">{q.content}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((o, i) => (
                  <div key={i} className={`text-xs p-2 rounded-lg ${i === q.correctAnswer ? "bg-success/15 text-success border border-success/30" : "bg-muted/50 text-muted-foreground"}`}>
                    {String.fromCharCode(65 + i)}. {o}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{q.standard}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamManagerQuestions;
