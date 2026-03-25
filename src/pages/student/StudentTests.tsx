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
import {
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Search,
  BookOpen,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Clock3,
  TrendingUp,
  Star,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ITEMS_PER_PAGE = 10;

const mockAssignments = Array.from({ length: 18 }).map((_, idx) => ({
  id: `asg-${idx + 1}`,
  subject: idx % 2 === 0 ? "Toán" : "Anh văn",
  title: `Bài tập ${idx + 1}`,
  className: idx % 2 === 0 ? "Toán 12 - Ôn thi ĐH" : "IELTS Writing",
  dueDate: `2026-03-${String((idx % 20) + 8).padStart(2, "0")}`,
  status: idx % 4 === 0 ? "completed" : "pending",
}));

type TestRunnerState = {
  testId: string;
  answers: Record<string, number>;
  currentIndex: number;
};

const PIE_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(160, 84%, 39%)",
  "hsl(32, 95%, 44%)",
  "hsl(262, 83%, 58%)",
  "hsl(0, 84%, 60%)",
];

const StudentTests = () => {
  const { tests, submitTest, examResults, mockExams } = useStudent();

  const [tab, setTab] = useState<"assignments" | "tests" | "results">(
    "assignments"
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [testRunner, setTestRunner] = useState<TestRunnerState | null>(null);
  const [detailResult, setDetailResult] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("Tất cả");

  const [assignments, setAssignments] = useState(mockAssignments);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const subjects = useMemo(
    () => ["Tất cả", ...Array.from(new Set(examResults.map((r) => r.subject)))],
    [examResults]
  );

  const assignmentsFiltered = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.subject.toLowerCase().includes(search.toLowerCase()) ||
          a.className.toLowerCase().includes(search.toLowerCase())
      ),
    [assignments, search]
  );

  const testsFiltered = useMemo(
    () =>
      tests.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.subject.toLowerCase().includes(search.toLowerCase())
      ),
    [search, tests]
  );

  const resultsFiltered = useMemo(
    () =>
      examResults.filter((r) => {
        const matchSearch =
          !search ||
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.subject.toLowerCase().includes(search.toLowerCase());

        const matchSubject =
          subjectFilter === "Tất cả" || r.subject === subjectFilter;

        return matchSearch && matchSubject;
      }),
    [examResults, search, subjectFilter]
  );

  const source =
    tab === "assignments"
      ? assignmentsFiltered
      : tab === "tests"
      ? testsFiltered
      : resultsFiltered;

  const pageCount = Math.max(1, Math.ceil(source.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagedData = source.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const completedAssignments = assignments.filter(
    (a) => a.status === "completed"
  ).length;

  const assignmentProgress = assignments.length
    ? Math.round((completedAssignments / assignments.length) * 100)
    : 0;

  const completedTests = tests.filter((t) => t.status === "completed").length;

  const totalExams = examResults.length;
  const avgScore =
    totalExams > 0
      ? Math.round(
          examResults.reduce((sum, result) => sum + result.score, 0) / totalExams
        )
      : 0;

  const passedCount = examResults.filter((r) => r.passed).length;
  const highestScore =
    totalExams > 0 ? Math.max(...examResults.map((r) => r.score)) : 0;

  const runningTest = testRunner
    ? tests.find((t) => t.id === testRunner.testId)
    : null;

  const currentQuestion =
    runningTest && testRunner
      ? runningTest.questions?.[testRunner.currentIndex]
      : null;

  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];

    const rawOptions = (currentQuestion as any).options;

    if (Array.isArray(rawOptions) && rawOptions.length > 0) {
      return rawOptions.map((opt: any, idx: number) => {
        if (typeof opt === "string") {
          return { label: String.fromCharCode(65 + idx), text: opt };
        }

        return {
          label: opt.label || opt.key || String.fromCharCode(65 + idx),
          text: opt.text || opt.content || opt.value || `Đáp án ${idx + 1}`,
        };
      });
    }

    return [
      { label: "A", text: "Đáp án A" },
      { label: "B", text: "Đáp án B" },
      { label: "C", text: "Đáp án C" },
      { label: "D", text: "Đáp án D" },
    ];
  }, [currentQuestion]);

  const getDetailData = (examId: string) => {
    const test = tests.find((t) => t.id === examId);
    if (test && test.answers) {
      return { questions: test.questions ?? [], answers: test.answers };
    }

    const mock = mockExams.find((m) => m.id === examId);
    if (mock && mock.answers) {
      return { questions: mock.questions ?? [], answers: mock.answers };
    }

    return null;
  };

  const detailInfo = detailResult
    ? examResults.find((r) => r.id === detailResult)
    : null;

  const detailData =
    detailInfo && detailInfo.examId
      ? getDetailData(detailInfo.examId)
      : null;

  const handleChangeTab = (
    nextTab: "assignments" | "tests" | "results"
  ) => {
    setTab(nextTab);
    setPage(1);
    setSearch("");
    if (nextTab !== "results") {
      setSubjectFilter("Tất cả");
    }
  };

  const handleStartTest = (testId: string) => {
    if (!cameraEnabled) return;

    const test = tests.find((t) => t.id === testId);
    if (!test || !test.questions || test.questions.length === 0) return;

    const initialAnswers: Record<string, number> = {};
    test.questions.forEach((q) => {
      initialAnswers[q.id] = -1;
    });

    setActiveTestId(null);
    setTestRunner({
      testId,
      answers: initialAnswers,
      currentIndex: 0,
    });
  };

  const handleStartAssignmentUpload = (assignmentId: string) => {
    if (uploadingAssignmentId) return;

    const fakeFileName = `${assignmentId}-submission.pdf`;
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(0);
    setSubmissionMessage(`Đang nộp ${fakeFileName}...`);

    let progress = 0;
    const interval = window.setInterval(() => {
      progress = Math.min(100, progress + 25);
      setUploadProgress(progress);

      if (progress >= 100) {
        window.clearInterval(interval);
        setAssignments((prev) =>
          prev.map((item) =>
            item.id === assignmentId ? { ...item, status: "completed" } : item
          )
        );
        setUploadingAssignmentId(null);
        setSubmissionMessage(`Nộp ${fakeFileName} thành công!`);

        window.setTimeout(() => {
          setSubmissionMessage(null);
          setUploadProgress(0);
        }, 1800);
      }
    }, 180);
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (!testRunner) return;

    setTestRunner({
      ...testRunner,
      answers: {
        ...testRunner.answers,
        [questionId]: optionIndex,
      },
    });
  };

  const handleFinishTest = () => {
    if (!testRunner || !runningTest) return;

    submitTest(testRunner.testId, testRunner.answers);
    setActiveTestId(testRunner.testId);
    setTestRunner(null);
    setTab("results");
    setPage(1);
  };

  const answeredCount =
    testRunner && runningTest
      ? runningTest.questions.filter(
          (q) => (testRunner.answers[q.id] ?? -1) >= 0
        ).length
      : 0;

  const topStats = [
    {
      label: "Bài tập được giao",
      value: assignments.length,
      desc: `${completedAssignments} bài đã hoàn thành`,
      icon: BookOpen,
      className: "from-blue-700 to-blue-900",
    },
    {
      label: "Bài kiểm tra",
      value: tests.length,
      desc: `${completedTests} bài đã nộp`,
      icon: ClipboardCheck,
      className: "from-emerald-500 to-teal-500",
    },
    {
      label: "Điểm trung bình",
      value: `${avgScore}%`,
      desc: `${passedCount}/${Math.max(totalExams, 1)} bài đạt`,
      icon: TrendingUp,
      className: "from-amber-500 to-orange-500",
    },
    {
      label: "Điểm cao nhất",
      value: `${highestScore}%`,
      desc: "Kết quả tốt nhất hiện tại",
      icon: Star,
      className: "from-violet-600 to-indigo-700",
    },
  ];

  const scoreBarData = useMemo(() => {
    if (examResults.length > 0) {
      return examResults.slice(0, 6).map((item, idx) => ({
        name: `Bài ${idx + 1}`,
        score: item.score,
      }));
    }

    return [
      { name: "Bài 1", score: 72 },
      { name: "Bài 2", score: 80 },
      { name: "Bài 3", score: 65 },
      { name: "Bài 4", score: 90 },
      { name: "Bài 5", score: 76 },
      { name: "Bài 6", score: 84 },
    ];
  }, [examResults]);

  const subjectPieData = useMemo(() => {
    if (examResults.length > 0) {
      const grouped = examResults.reduce<Record<string, number>>((acc, item) => {
        acc[item.subject] = (acc[item.subject] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));
    }

    return [
      { name: "Toán", value: 4 },
      { name: "Lý", value: 3 },
      { name: "Hóa", value: 2 },
      { name: "Anh", value: 3 },
    ];
  }, [examResults]);

  return (
    <div className="px-4 sm:px-6 pt-3 pb-6 space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topStats.map((item, index) => (
          <div
            key={index}
            className={cn(
              "rounded-3xl bg-gradient-to-r p-5 text-white shadow-sm",
              item.className
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-white/80">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">{item.value}</p>
                <p className="mt-2 text-[11px] text-white/75">{item.desc}</p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChangeTab("assignments")}
              className={cn(
                "rounded-2xl px-4 py-2 text-xs font-medium transition-all",
                tab === "assignments"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Bài tập
            </button>

            <button
              onClick={() => handleChangeTab("tests")}
              className={cn(
                "rounded-2xl px-4 py-2 text-xs font-medium transition-all",
                tab === "tests"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Bài kiểm tra
            </button>

            <button
              onClick={() => handleChangeTab("results")}
              className={cn(
                "rounded-2xl px-4 py-2 text-xs font-medium transition-all",
                tab === "results"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Kết quả
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="rounded-2xl pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={tab === "results" ? "Tìm kết quả..." : "Tìm bài học..."}
              />
            </div>

            {tab === "results" && (
              <div className="flex gap-2 flex-wrap">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSubjectFilter(subject);
                      setPage(1);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-full text-xs font-medium transition-colors",
                      subjectFilter === subject
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {tab === "tests" && (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Camera className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bật camera trước khi làm bài kiểm tra</p>
                <p className="text-xs text-muted-foreground">
                  Hệ thống sẽ dùng camera để tăng độ tin cậy cho bài làm.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant={cameraEnabled ? "outline" : "default"}
              className="rounded-2xl"
              onClick={() => setCameraEnabled((v) => !v)}
            >
              {cameraEnabled ? "Đã bật camera" : "Bật camera"}
            </Button>
          </div>
        )}

        {tab === "assignments" && (
          <>
            <div className="space-y-3">
              {submissionMessage && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {submissionMessage}
                </div>
              )}

              {pagedData.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.className} • Hạn: {item.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-medium",
                        item.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300"
                      )}
                    >
                      {item.status === "completed" ? "Hoàn thành" : "Chưa làm"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      disabled={
                        item.status === "completed" ||
                        (uploadingAssignmentId !== null &&
                          uploadingAssignmentId !== item.id)
                      }
                      onClick={() => handleStartAssignmentUpload(item.id)}
                    >
                      {item.status === "completed"
                        ? "Đã nộp"
                        : uploadingAssignmentId === item.id
                        ? `Đang nộp ${uploadProgress}%`
                        : "Nộp bài"}
                    </Button>
                  </div>
                </div>
              ))}

              {pagedData.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border bg-card py-14 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                    <Search className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Không có dữ liệu phù hợp
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Thử thay đổi từ khóa tìm kiếm hoặc chuyển tab khác
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Tiến độ hoàn thành bài tập
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {completedAssignments}/{assignments.length} bài đã hoàn thành
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {assignmentProgress}%
                </span>
              </div>
              <Progress value={assignmentProgress} className="h-3" />
            </div>
          </>
        )}

        {tab === "tests" && (
          <div className="space-y-3">
            {pagedData.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.subject} • Hạn: {item.dueDate || item.completedAt || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-medium",
                      item.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300"
                    )}
                  >
                    {item.status === "completed" ? "Hoàn thành" : "Chưa làm"}
                  </Badge>

                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => handleStartTest(item.id)}
                    disabled={item.status === "completed" || !cameraEnabled}
                  >
                    Làm bài
                  </Button>
                </div>
              </div>
            ))}

            {pagedData.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border bg-card py-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                  <Search className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Không có dữ liệu phù hợp
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thử thay đổi từ khóa tìm kiếm hoặc chuyển tab khác
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "results" && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-border bg-card p-5">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-foreground">
                    Điểm số các bài gần đây
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Biểu đồ cột thể hiện điểm từng bài kiểm tra
                  </p>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreBarData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border/50"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="score"
                        radius={[8, 8, 0, 0]}
                        fill="hsl(221, 83%, 53%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-foreground">
                    Tỉ lệ kết quả theo môn
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Biểu đồ tròn phân bổ số bài theo từng môn
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-[260px] w-full md:w-[260px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subjectPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {subjectPieData.map((_, index) => (
                            <Cell
                              key={index}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    {subjectPieData.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                PIE_COLORS[index % PIE_COLORS.length],
                            }}
                          />
                          <p className="text-sm font-medium text-foreground">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.value} bài
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Chi tiết kết quả
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-[11px] text-muted-foreground font-medium p-3">
                        Bài thi
                      </th>
                      <th className="text-left text-[11px] text-muted-foreground font-medium p-3">
                        Môn
                      </th>
                      <th className="text-center text-[11px] text-muted-foreground font-medium p-3">
                        Điểm
                      </th>
                      <th className="text-center text-[11px] text-muted-foreground font-medium p-3">
                        Đúng
                      </th>
                      <th className="text-center text-[11px] text-muted-foreground font-medium p-3">
                        Ngày
                      </th>
                      <th className="text-center text-[11px] text-muted-foreground font-medium p-3">
                        Kết quả
                      </th>
                      <th className="text-center text-[11px] text-muted-foreground font-medium p-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedData.map((result: any) => (
                      <tr
                        key={result.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 text-sm font-medium text-foreground">
                          {result.title}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-[10px]">
                            {result.subject}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              result.score >= 70
                                ? "text-foreground"
                                : result.score >= 50
                                ? "text-foreground"
                                : "text-destructive"
                            )}
                          >
                            {result.score}%
                          </span>
                        </td>
                        <td className="p-3 text-center text-sm text-muted-foreground">
                          {result.correctAnswers}/{result.totalQuestions}
                        </td>
                        <td className="p-3 text-center text-xs text-muted-foreground">
                          {result.completedAt}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                            className={cn(
                              "text-[10px]",
                              result.passed
                                ? "bg-muted text-foreground"
                                : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {result.passed ? "Đạt" : "Chưa đạt"}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg text-xs h-8 gap-1"
                            onClick={() => setDetailResult(result.id)}
                          >
                            <Eye className="w-3 h-3" />
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagedData.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Không tìm thấy kết quả
                </p>
              )}
            </div>
          </>
        )}

        {pageCount > 1 && (
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
        )}
      </div>

      {activeTestId && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Đã nộp bài kiểm tra thành công cho mã {activeTestId}.
        </div>
      )}

      {detailInfo && detailData && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetailResult(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {detailInfo.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Điểm: {detailInfo.score}% • Đúng {detailInfo.correctAnswers}/
                  {detailInfo.totalQuestions} • {detailInfo.completedAt}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailResult(null)}
                className="rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {detailData.questions.map((q: any, i: number) => {
                const userAns = detailData.answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const options = Array.isArray(q.options) ? q.options : [];

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "border rounded-2xl p-4",
                      isCorrect
                        ? "border-border bg-muted/30"
                        : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                          isCorrect
                            ? "bg-muted text-foreground"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {isCorrect ? "✓" : "✕"}
                      </span>

                      <p className="text-sm font-medium text-foreground">
                        Câu {i + 1}: {q.question}
                      </p>
                    </div>

                    <div className="ml-7 space-y-1 mb-2">
                      {options.map((opt: string, oi: number) => (
                        <div
                          key={oi}
                          className={cn(
                            "text-xs p-2 rounded-lg",
                            oi === q.correctAnswer
                              ? "bg-muted text-foreground font-medium"
                              : oi === userAns && !isCorrect
                              ? "text-destructive line-through"
                              : "text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="text-xs text-muted-foreground ml-7 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {testRunner && runningTest && currentQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {runningTest.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {runningTest.subject} • Câu {testRunner.currentIndex + 1}/
                  {runningTest.questions.length}
                </p>
              </div>

              <button
                onClick={() => setTestRunner(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px]">
              <div className="p-6 space-y-5">
                <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-primary">
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        Câu {testRunner.currentIndex + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      Demo bài thi
                    </div>
                  </div>

                  <p className="text-sm md:text-base font-medium text-foreground leading-7">
                    {(currentQuestion as any).content ||
                      (currentQuestion as any).question ||
                      (currentQuestion as any).title ||
                      `Nội dung câu hỏi ${testRunner.currentIndex + 1}`}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentOptions.map((option, idx) => {
                    const selected = testRunner.answers[currentQuestion.id] === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                        className={cn(
                          "w-full text-left rounded-2xl border p-4 transition-all",
                          selected
                            ? "border-primary bg-primary/8 shadow-sm"
                            : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            )}
                          >
                            {option.label}
                          </div>
                          <p className="text-sm text-foreground leading-6">
                            {option.text}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    disabled={testRunner.currentIndex === 0}
                    onClick={() =>
                      setTestRunner({
                        ...testRunner,
                        currentIndex: Math.max(0, testRunner.currentIndex - 1),
                      })
                    }
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Câu trước
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    Đã trả lời {answeredCount}/{runningTest.questions.length} câu
                  </div>

                  {testRunner.currentIndex < runningTest.questions.length - 1 ? (
                    <Button
                      className="rounded-2xl"
                      onClick={() =>
                        setTestRunner({
                          ...testRunner,
                          currentIndex: Math.min(
                            runningTest.questions.length - 1,
                            testRunner.currentIndex + 1
                          ),
                        })
                      }
                    >
                      Câu tiếp
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleFinishTest}
                    >
                      Nộp bài
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Danh sách câu hỏi
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {runningTest.questions.map((q, idx) => {
                    const answered = (testRunner.answers[q.id] ?? -1) >= 0;
                    const active = idx === testRunner.currentIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() =>
                          setTestRunner({
                            ...testRunner,
                            currentIndex: idx,
                          })
                        }
                        className={cn(
                          "h-10 rounded-xl text-xs font-semibold transition-all",
                          active
                            ? "bg-primary text-primary-foreground"
                            : answered
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Câu hiện tại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="text-muted-foreground">Đã chọn đáp án</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="text-muted-foreground">Chưa trả lời</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/20 p-3">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Demo làm bài
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTests;