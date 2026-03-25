import { useParent } from "@/contexts/ParentContext";
import { Star, MessageSquare, ArrowUpRight, CheckCircle2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import ReviewDialog from "@/components/ReviewDialog";

export interface ParentSessionReview {
  id: string;
  childId: string;
  childName: string;
  sessionKey: string; // unique identifier: childId-classId-date
  tutorName: string;
  tutorAvatar: string;
  className: string;
  subject: string;
  date: string;
  rating: number;
  comment: string;
}

const ParentReviews = () => {
  const { children } = useParent();
  const [reviews, setReviews] = useState<ParentSessionReview[]>([]);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    sessionKey: string;
    childId: string;
    childName: string;
    tutorName: string;
    className: string;
    subject: string;
    sessionDate: string;
  }>({
    open: false,
    sessionKey: "",
    childId: "",
    childName: "",
    tutorName: "",
    className: "",
    subject: "",
    sessionDate: "",
  });

  // Get completed sessions from attendance confirmations (confirmed = completed)
  const completedSessions = children.flatMap(child =>
    child.attendanceConfirmations
      .filter(ac => ac.status === "confirmed")
      .map(ac => ({
        sessionKey: `${child.id}-${ac.subject}-${ac.date}`,
        childId: child.id,
        childName: child.name,
        tutorName: ac.tutorName,
        tutorAvatar: ac.tutorAvatar,
        className: ac.subject,
        subject: ac.subject,
        date: ac.date,
        time: ac.time,
        sessionNumber: ac.sessionNumber,
      }))
  );

  const reviewedKeys = new Set(reviews.map(r => r.sessionKey));
  const unreviewedSessions = completedSessions.filter(s => !reviewedKeys.has(s.sessionKey));

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const handleOpenReview = (session: typeof completedSessions[0]) => {
    setReviewDialog({
      open: true,
      sessionKey: session.sessionKey,
      childId: session.childId,
      childName: session.childName,
      tutorName: session.tutorName,
      className: session.className,
      subject: session.subject,
      sessionDate: session.date,
    });
  };

  const handleSubmitReview = useCallback(
    (rating: number, comment: string) => {
      const matchedSession = completedSessions.find(s => s.sessionKey === reviewDialog.sessionKey);

      const newReview: ParentSessionReview = {
        id: `pr-${Date.now()}`,
        childId: reviewDialog.childId,
        childName: reviewDialog.childName,
        sessionKey: reviewDialog.sessionKey,
        tutorName: reviewDialog.tutorName,
        tutorAvatar: matchedSession?.tutorAvatar || "",
        className: reviewDialog.className,
        subject: reviewDialog.subject,
        date: reviewDialog.sessionDate,
        rating,
        comment,
      };

      setReviews(prev => [...prev, newReview]);
    },
    [reviewDialog, completedSessions]
  );

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* HERO */}
      {/* <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col lg:flex-row justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold">Đánh giá buổi học</h2>
            <p className="mt-1 text-sm text-white/80">
              Theo dõi các buổi đã học và gửi phản hồi chất lượng gia sư
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Đã đánh giá</p>
              <p className="text-xl font-bold">{reviews.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Điểm TB</p>
              <p className="text-xl font-bold">{avgRating}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Buổi đã xác nhận",
            value: completedSessions.length,
            sub: "Đủ điều kiện đánh giá",
            color: "from-blue-500 to-indigo-500",
            icon: CheckCircle2,
          },
          {
            label: "Đã đánh giá",
            value: reviews.length,
            sub: "Phản hồi đã gửi",
            color: "from-amber-500 to-orange-500",
            icon: Star,
          },
          {
            label: "Chưa đánh giá",
            value: unreviewedSessions.length,
            sub: "Đang chờ phản hồi",
            color: "from-emerald-500 to-teal-500",
            icon: MessageSquare,
          },
          {
            label: "Điểm trung bình",
            value: avgRating,
            sub: "Chất lượng buổi học",
            color: "from-rose-500 to-pink-500",
            icon: ClipboardList,
          },
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-white transition-all hover:shadow-lg",
              s.color
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4" />
          </div>
        ))}
      </div>

      {/* UNREVIEWED */}
      {unreviewedSessions.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="h-4 w-4 text-primary" />
            Buổi chưa đánh giá ({unreviewedSessions.length})
          </h3>

          <div className="space-y-3">
            {unreviewedSessions.map(s => (
              <div
                key={s.sessionKey}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={s.tutorAvatar}
                    alt={s.tutorName}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {s.className} - Buổi {s.sessionNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GS: {s.tutorName} • HS: {s.childName} • {s.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReview(s)}
                  className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Đánh giá
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWED */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Star className="h-4 w-4 text-primary" />
          Đánh giá đã gửi ({reviews.length})
        </h3>

        <div className="space-y-3">
          {reviews.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Bạn chưa đánh giá buổi học nào.
            </p>
          )}

          {reviews.map(r => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {r.tutorAvatar ? (
                    <img
                      src={r.tutorAvatar}
                      alt={r.tutorName}
                      className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{r.className}</p>
                    <p className="text-xs text-muted-foreground">
                      GS: {r.tutorName} • HS: {r.childName} • {r.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < r.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>

              {r.comment && <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>

      <ReviewDialog
        open={reviewDialog.open}
        onOpenChange={open => setReviewDialog(prev => ({ ...prev, open }))}
        tutorName={reviewDialog.tutorName}
        className={reviewDialog.className}
        subject={reviewDialog.subject}
        sessionDate={reviewDialog.sessionDate}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default ParentReviews;