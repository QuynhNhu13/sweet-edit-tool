import { useStudent } from "@/contexts/StudentContext";
import {
  BookOpen,
  CheckCircle2,
  Star,
  Video,
  MapPin,
  ChevronRight,
  Search,
  X,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentClasses = () => {
  const { classes, rateSession } = useStudent();
  const navigate = useNavigate();

  const [ratingModal, setRatingModal] = useState<{ sessionId: string } | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = classes.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeClasses = filtered.filter((c) => c.status === "active");
  const completedClasses = filtered.filter((c) => c.status === "completed");

  const handleRate = () => {
    if (ratingModal) {
      rateSession(ratingModal.sessionId, ratingValue, ratingComment);
      setRatingModal(null);
      setRatingValue(5);
      setRatingComment("");
    }
  };

  return (
    <div className="px-6 pt-2 pb-6 space-y-3">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Quản lý lớp học
            </div>
            <h2 className="mt-3 text-2xl font-bold">Theo dõi toàn bộ lớp học của bạn</h2>
            {/* <p className="mt-1 text-sm text-white/80">
              Xem tiến độ, lịch học tiếp theo và đánh giá các buổi học đã hoàn thành.
            </p> */}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">Đang học</p>
              <p className="mt-1 text-2xl font-bold">{classes.filter((c) => c.status === "active").length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/75">Hoàn thành</p>
              <p className="mt-1 text-2xl font-bold">{classes.filter((c) => c.status === "completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm lớp học, gia sư, môn học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-2xl border-border bg-background pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "active", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition-all",
                  statusFilter === s
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "Tất cả" : s === "active" ? "Đang học" : "Hoàn thành"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setRatingModal(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Đánh giá buổi học</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chia sẻ cảm nhận của bạn về buổi học này
                </p>
              </div>
              <button
                onClick={() => setRatingModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setRatingValue(v)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      v <= ratingValue
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Nhận xét của bạn..."
              className="mb-5 h-24 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />

            <div className="flex gap-3">
              <Button className="flex-1 rounded-2xl" onClick={handleRate}>
                Gửi đánh giá
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setRatingModal(null)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Classes */}
      {activeClasses.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Lớp đang học ({activeClasses.length})
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeClasses.map((c) => {
              const nextSession = c.sessions.find((s) => s.status === "scheduled");

              return (
                <div
                  key={c.id}
                  className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start gap-4">
                    <img src={c.tutorAvatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-foreground">{c.name}</h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">{c.tutorName}</p>
                        </div>

                        <Badge className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                          Đang học
                        </Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="gap-1 rounded-full border-border px-2.5 py-1 text-[10px]"
                        >
                          {c.format === "online" ? (
                            <>
                              <Video className="h-3 w-3" /> Online
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" /> Tại nhà
                            </>
                          )}
                        </Badge>

                        <span className="text-[10px] text-muted-foreground">{c.subject}</span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-[10px] text-muted-foreground">{c.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-2xl bg-muted/35 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Tiến độ lớp học</span>
                      <span className="text-xs font-semibold text-foreground">
                        {c.completedSessions}/{c.totalSessions} buổi
                      </span>
                    </div>
                    <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-2.5" />
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Hoàn thành {Math.round((c.completedSessions / c.totalSessions) * 100)}%
                    </p>
                  </div>

                  {nextSession && (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-blue-50/60 p-4 dark:bg-blue-950/10">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Buổi học tiếp theo
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {nextSession.date} • {nextSession.time}
                        </p>
                      </div>

                      {nextSession.format === "online" && nextSession.meetingLink && (
                        <Button
                          size="sm"
                          className="h-8 rounded-xl text-xs"
                          onClick={() => navigate(nextSession.meetingLink!)}
                        >
                          Vào lớp
                        </Button>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full rounded-2xl text-xs"
                    size="sm"
                    onClick={() => navigate(`/student/classes/${c.id}`)}
                  >
                    Chi tiết lớp học <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Đã hoàn thành ({completedClasses.length})
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {completedClasses.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img src={c.tutorAvatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{c.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.tutorName} • {c.totalSessions} buổi
                    </p>
                  </div>

                  <Badge className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Hoàn thành
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full rounded-2xl text-xs"
                  size="sm"
                  onClick={() => navigate(`/student/classes/${c.id}`)}
                >
                  Chi tiết lớp học <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
            <Search className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">Không tìm thấy lớp học nào</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thử tìm bằng tên lớp, tên gia sư hoặc môn học
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;