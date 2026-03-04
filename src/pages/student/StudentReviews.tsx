import { useStudent } from "@/contexts/StudentContext";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReviewDialog from "@/components/ReviewDialog";

const StudentReviews = () => {
  const { classes, rateSession } = useStudent();
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    sessionId: string;
    tutorName: string;
    className: string;
    subject: string;
    sessionDate: string;
  }>({ open: false, sessionId: "", tutorName: "", className: "", subject: "", sessionDate: "" });

  // Get all completed sessions across all classes
  const allSessions = classes.flatMap(c =>
    c.sessions
      .filter(s => s.status === "completed")
      .map(s => ({ ...s, className: c.name, subject: c.subject, tutorName: c.tutorName, tutorAvatar: c.tutorAvatar, classId: c.id }))
  );

  const reviewedSessions = allSessions.filter(s => s.rating != null);
  const unreviewedSessions = allSessions.filter(s => s.rating == null);

  const handleOpenReview = (session: typeof allSessions[0]) => {
    setReviewDialog({
      open: true,
      sessionId: session.id,
      tutorName: session.tutorName,
      className: session.className,
      subject: session.subject,
      sessionDate: session.date,
    });
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    rateSession(reviewDialog.sessionId, rating, comment);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{allSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Tổng buổi hoàn thành</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{reviewedSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đã đánh giá</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{unreviewedSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Chưa đánh giá</p>
        </div>
      </div>

      {/* Unreviewed sessions */}
      {unreviewedSessions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Buổi chưa đánh giá ({unreviewedSessions.length})
          </h3>
          <div className="space-y-2">
            {unreviewedSessions.map(s => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={s.tutorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.date} • {s.time}</p>
                    {s.content && <p className="text-xs text-muted-foreground/70 mt-0.5">Nội dung: {s.content}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenReview(s)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Đánh giá
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed sessions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" /> Đánh giá đã gửi ({reviewedSessions.length})
        </h3>
        <div className="space-y-2">
          {reviewedSessions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Bạn chưa đánh giá buổi học nào.</p>
          )}
          {reviewedSessions.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={s.tutorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.className}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.date} • {s.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < (s.rating || 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                  ))}
                </div>
              </div>
              {s.ratingComment && (
                <p className="text-sm text-muted-foreground mt-2 ml-12">{s.ratingComment}</p>
              )}
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

export default StudentReviews;
