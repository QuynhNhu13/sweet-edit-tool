import { useStudent } from "@/contexts/StudentContext";
import { FileText, Clock, Users, Trophy, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentMockExam = () => {
  const { mockExams, submitMockExam } = useStudent();
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState<string | null>(null);

  const exam = activeExam ? mockExams.find(e => e.id === activeExam) : null;
  const resultExam = showResult ? mockExams.find(e => e.id === showResult) : null;

  const startExam = (examId: string) => {
    setActiveExam(examId);
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
  };

  const handleSubmit = () => {
    if (activeExam) {
      submitMockExam(activeExam, answers);
      setShowResult(activeExam);
      setActiveExam(null);
    }
  };

  // Active Exam
  if (exam) {
    const q = exam.questions[currentQ];
    const answered = Object.keys(answers).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{exam.title}</h2>
              <p className="text-xs text-muted-foreground">{exam.difficulty} • {exam.duration} phút</p>
            </div>
            <Button variant="destructive" className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {exam.questions.map((qq, i) => (
              <button key={qq.id} onClick={() => setCurrentQ(i)} className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium",
                currentQ === i ? "bg-primary text-primary-foreground" :
                answers[qq.id] !== undefined ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" :
                flagged.has(qq.id) ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" :
                "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </button>
            ))}
          </div>
          <Progress value={(answered / exam.totalQuestions) * 100} className="h-1.5 mb-6" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Câu {currentQ + 1}</h3>
              <button onClick={() => { const n = new Set(flagged); n.has(q.id) ? n.delete(q.id) : n.add(q.id); setFlagged(n); }} className={cn("text-xs flex items-center gap-1", flagged.has(q.id) ? "text-amber-500" : "text-muted-foreground")}>
                <Flag className="w-3.5 h-3.5" /> Đánh dấu
              </button>
            </div>
            <p className="text-sm text-foreground mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(p => ({ ...p, [q.id]: oi }))} className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm",
                  answers[q.id] === oi ? "border-primary bg-primary/5 font-medium" : "border-border hover:border-primary/50"
                )}>
                  <span className="inline-flex w-6 h-6 rounded-full border border-current items-center justify-center text-xs mr-3">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="rounded-xl gap-1" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              <ChevronLeft className="w-4 h-4" /> Trước
            </Button>
            {currentQ < exam.totalQuestions - 1 ? (
              <Button size="sm" className="rounded-xl gap-1" onClick={() => setCurrentQ(currentQ + 1)}>
                Sau <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" className="rounded-xl" onClick={handleSubmit}>Nộp bài</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result View
  if (resultExam && resultExam.status === "completed") {
    const correct = resultExam.questions.filter(q => resultExam.answers?.[q.id] === q.correctAnswer).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className={cn("w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold",
            (resultExam.score || 0) >= 50 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-destructive/10 text-destructive"
          )}>
            {resultExam.score}%
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">{resultExam.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">Đúng {correct}/{resultExam.totalQuestions} câu</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowResult(null)}>Quay lại</Button>
          </div>
        </div>

        <div className="space-y-3">
          {resultExam.questions.map((q, i) => {
            const userAns = resultExam.answers?.[q.id];
            const isCorrect = userAns === q.correctAnswer;
            return (
              <div key={q.id} className={cn("bg-card border rounded-xl p-4", isCorrect ? "border-emerald-200 dark:border-emerald-800" : "border-destructive/30")}>
                <p className="text-sm font-medium text-foreground mb-2">Câu {i + 1}: {q.question}</p>
                {q.options.map((opt, oi) => (
                  <div key={oi} className={cn("text-xs p-1.5 rounded", oi === q.correctAnswer ? "text-emerald-700 font-medium" : oi === userAns && !isCorrect ? "text-destructive line-through" : "text-muted-foreground")}>
                    {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctAnswer && "✓"} {oi === userAns && !isCorrect && "✕"}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2 italic">💡 {q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Exam List
  const difficultyColors: Record<string, string> = {
    "Dễ": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Trung bình": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "Khó": "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockExams.map(e => (
          <div key={e.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">{e.title}</h4>
              <Badge className={cn("text-[10px]", difficultyColors[e.difficulty])}>{e.difficulty}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.duration} phút</div>
              <div className="flex items-center gap-1"><FileText className="w-3 h-3" />{e.totalQuestions} câu</div>
              <div className="flex items-center gap-1"><Trophy className="w-3 h-3" />TB: {e.communityAvgScore}%</div>
              <div className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attempts} lượt</div>
            </div>
            {e.status === "completed" ? (
              <div className="flex gap-2">
                <div className={cn("flex-1 text-center py-2 rounded-xl text-sm font-bold", (e.score || 0) >= 50 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-destructive/10 text-destructive")}>
                  {e.score}%
                </div>
                <Button variant="outline" className="rounded-xl text-xs" size="sm" onClick={() => setShowResult(e.id)}>Xem lại</Button>
              </div>
            ) : (
              <Button className="w-full rounded-xl" size="sm" onClick={() => startExam(e.id)}>Bắt đầu thi</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMockExam;
