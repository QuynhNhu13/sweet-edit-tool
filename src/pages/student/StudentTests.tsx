import { useMemo, useState } from "react";
import { useStudent } from "@/contexts/StudentContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Camera, CheckCircle2, ClipboardCheck, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const mockAssignments = Array.from({ length: 18 }).map((_, idx) => ({
  id: `asg-${idx + 1}`,
  subject: idx % 2 === 0 ? "Toán" : "Anh văn",
  title: `Bài tập ${idx + 1}`,
  className: idx % 2 === 0 ? "Toán 12 - Ôn thi ĐH" : "IELTS Writing",
  dueDate: `2026-03-${String((idx % 20) + 8).padStart(2, "0")}`,
  status: idx % 4 === 0 ? "completed" : "pending",
}));

const StudentTests = () => {
  const { tests, submitTest } = useStudent();
  const [tab, setTab] = useState<"assignments" | "tests">("assignments");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  const assignmentsFiltered = useMemo(
    () =>
      mockAssignments.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.subject.toLowerCase().includes(search.toLowerCase()) ||
          a.className.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const testsFiltered = useMemo(
    () => tests.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())),
    [search, tests],
  );

  const source = tab === "assignments" ? assignmentsFiltered : testsFiltered;
  const pageCount = Math.max(1, Math.ceil(source.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagedData = source.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStartTest = (testId: string) => {
    if (!cameraEnabled) return;
    const test = tests.find((t) => t.id === testId);
    if (!test) return;
    const defaultAnswers: Record<string, number> = {};
    test.questions.forEach((q) => {
      defaultAnswers[q.id] = 0;
    });
    submitTest(testId, defaultAnswers);
    setActiveTestId(testId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Bài tập được giao</p>
          <p className="text-2xl font-bold text-foreground">{mockAssignments.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Bài kiểm tra</p>
          <p className="text-2xl font-bold text-foreground">{tests.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Bảo mật bài làm</p>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Yêu cầu bật camera</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTab("assignments");
                setPage(1);
              }}
              className={cn("px-3 py-1.5 rounded-xl text-xs", tab === "assignments" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
            >
              Bài tập
            </button>
            <button
              onClick={() => {
                setTab("tests");
                setPage(1);
              }}
              className={cn("px-3 py-1.5 rounded-xl text-xs", tab === "tests" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
            >
              Bài kiểm tra
            </button>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm bài học..." />
          </div>
        </div>

        {tab === "tests" && (
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Camera className="w-4 h-4 text-primary" />
              Bật camera trước khi làm bài kiểm tra.
            </div>
            <Button size="sm" variant={cameraEnabled ? "outline" : "default"} onClick={() => setCameraEnabled((v) => !v)}>
              {cameraEnabled ? "Đã bật" : "Bật camera"}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {pagedData.map((item: any) => (
            <div key={item.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {tab === "assignments" ? item.className : item.subject} • Hạn: {item.dueDate || item.completedAt || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.status === "completed" ? "secondary" : "outline"}>
                  {item.status === "completed" ? "Hoàn thành" : "Chưa làm"}
                </Badge>
                {tab === "tests" ? (
                  <Button size="sm" onClick={() => handleStartTest(item.id)} disabled={item.status === "completed" || !cameraEnabled}>
                    Làm bài
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled={item.status === "completed"}>
                    Nộp bài
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(idx + 1);
                  }}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(pageCount, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {activeTestId && (
        <div className="p-3 rounded-xl bg-success/15 border border-success/30 flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="w-4 h-4" />
          Đã nộp bài kiểm tra mô phỏng thành công cho mã {activeTestId}.
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">Tiến độ hoàn thành</p>
        <Progress value={Math.round((mockAssignments.filter((a) => a.status === "completed").length / mockAssignments.length) * 100)} />
      </div>
    </div>
  );
};

export default StudentTests;