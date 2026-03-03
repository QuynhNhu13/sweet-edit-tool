import { useStudent, TestQuestion } from "@/contexts/StudentContext";
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const StudentTests = () => {
  const { tests, submitTest } = useStudent();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [reviewTest, setReviewTest] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);

  const available = tests.filter(t => t.status === "available");
  const completed = tests.filter(t => t.status === "completed");
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((s, t) => s + (t.score || 0), 0) / completed.length) : 0;

  const test = activeTest ? tests.find(t => t.id === activeTest) : null;
  const review = reviewTest ? tests.find(t => t.id === reviewTest) : null;

  const startTest = (testId: string) => {
    const t = tests.find(tt => tt.id === testId);
    if (!t) return;
    setActiveTest(testId);
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(t.duration * 60);
  };

  const handleSubmit = () => {
    if (activeTest) {
      submitTest(activeTest, answers);
      setActiveTest(null);
    }
  };

  const toggleFlag = (qId: string) => {
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(qId) ? n.delete(qId) : n.add(qId);
      return n;
    });
  };

  // Active Test View
  if (test) {
    const q = test.questions[currentQ];
    const answered = Object.keys(answers).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{test.title}</h2>
              <p className="text-xs text-muted-foreground">{test.subject} • {test.totalQuestions} câu • {test.duration} phút</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
              <Button variant="destructive" className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {test.questions.map((qq, i) => (
              <button key={qq.id} onClick={() => setCurrentQ(i)} className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                currentQ === i ? "bg-primary text-primary-foreground" :
                answers[qq.id] !== undefined ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                flagged.has(qq.id) ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" :
                "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </button>
            ))}
          </div>

          <Progress value={(answered / test.totalQuestions) * 100} className="h-1.5 mb-6" />

          {/* Current Question */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Câu {currentQ + 1}/{test.totalQuestions}</h3>
              <button onClick={() => toggleFlag(q.id)} className={cn("flex items-center gap-1 text-xs", flagged.has(q.id) ? "text-amber-500" : "text-muted-foreground")}>
                <Flag className="w-3.5 h-3.5" /> {flagged.has(q.id) ? "Đã đánh dấu" : "Đánh dấu"}
              </button>
            </div>
            <p className="text-sm text-foreground mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))} className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm transition-all",
                  answers[q.id] === oi ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                )}>
                  <span className="inline-flex w-6 h-6 rounded-full border border-current items-center justify-center text-xs mr-3">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" className="rounded-xl gap-1" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              <ChevronLeft className="w-4 h-4" /> Câu trước
            </Button>
            <span className="text-xs text-muted-foreground">{answered}/{test.totalQuestions} đã trả lời • {flagged.size} đánh dấu</span>
            {currentQ < test.totalQuestions - 1 ? (
              <Button className="rounded-xl gap-1" size="sm" onClick={() => setCurrentQ(currentQ + 1)}>
                Câu sau <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Review Test View
  if (review) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{review.title}</h2>
              <p className="text-xs text-muted-foreground">Điểm: {review.score}% • {review.completedAt}</p>
            </div>
            <Button variant="outline" className="rounded-xl" size="sm" onClick={() => setReviewTest(null)}>Đóng</Button>
          </div>

          <div className="space-y-4">
            {review.questions.map((q, i) => {
              const userAnswer = review.answers?.[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={cn("border rounded-xl p-4", isCorrect ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10" : "border-destructive/30 bg-destructive/5")}>
                  <p className="text-sm font-medium text-foreground mb-3">Câu {i + 1}: {q.question}</p>
                  <div className="space-y-1.5 mb-3">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn("p-2 rounded-lg text-xs", oi === q.correctAnswer ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 font-medium" : oi === userAnswer && !isCorrect ? "bg-destructive/10 text-destructive line-through" : "text-muted-foreground")}>
                        {String.fromCharCode(65 + oi)}. {opt}
                        {oi === q.correctAnswer && " ✓"}
                        {oi === userAnswer && !isCorrect && " ✕"}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ClipboardCheck className="w-6 h-6 text-primary" /></div>
          <div><p className="text-xs text-muted-foreground">Bài có sẵn</p><p className="text-xl font-bold text-foreground">{available.length}</p></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
          <div><p className="text-xs text-muted-foreground">Đã hoàn thành</p><p className="text-xl font-bold text-foreground">{completed.length}</p></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-amber-500" /></div>
          <div><p className="text-xs text-muted-foreground">Điểm TB</p><p className="text-xl font-bold text-foreground">{avgScore}%</p></div>
        </div>
      </div>

      {/* Available */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Bài kiểm tra có sẵn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map(t => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                  <p className="text-xs text-muted-foreground">{t.subject} • {t.totalQuestions} câu • {t.duration} phút</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
              </div>
              <Button className="w-full rounded-xl" size="sm" onClick={() => startTest(t.id)}>Bắt đầu làm bài</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Đã hoàn thành</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">{t.completedAt} • {t.subject}</p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold", (t.score || 0) >= 50 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-destructive/10 text-destructive")}>
                    {t.score}%
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl" size="sm" onClick={() => setReviewTest(t.id)}>Xem lại bài làm</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTests;
