import { useParent } from "@/contexts/ParentContext";
import { Star, MessageSquare } from "lucide-react";
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
  }>({ open: false, sessionKey: "", childId: "", childName: "", tutorName: "", className: "", subject: "", sessionDate: "" });

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
  const reviewedSessions = completedSessions.filter(s => reviewedKeys.has(s.sessionKey));

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

  const handleSubmitReview = useCallback((rating: number, comment: string) => {
    const newReview: ParentSessionReview = {
      id: `pr-${Date.now()}`,
      childId: reviewDialog.childId,
      childName: reviewDialog.childName,
      sessionKey: reviewDialog.sessionKey,
      tutorName: reviewDialog.tutorName,
      tutorAvatar: "",
      className: reviewDialog.className,
      subject: reviewDialog.subject,
      date: reviewDialog.sessionDate,
      rating,
      comment,
    };
    setReviews(prev => [...prev, newReview]);
  }, [reviewDialog]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{completedSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Buổi đã xác nhận</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{reviews.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đã đánh giá</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{unreviewedSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Chưa đánh giá</p>
        </div>
      </div>

      {/* Unreviewed */}
      {unreviewedSessions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Buổi chưa đánh giá ({unreviewedSessions.length})
          </h3>
          <div className="space-y-2">
            {unreviewedSessions.map(s => (
              <div key={s.sessionKey} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={s.tutorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.className} - Buổi {s.sessionNumber}</p>
                    <p className="text-xs text-muted-foreground">GS: {s.tutorName} • HS: {s.childName} • {s.date}</p>
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

      {/* Reviewed */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" /> Đánh giá đã gửi ({reviews.length})
        </h3>
        <div className="space-y-2">
          {reviews.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Bạn chưa đánh giá buổi học nào.</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.className}</p>
                  <p className="text-xs text-muted-foreground">GS: {r.tutorName} • HS: {r.childName} • {r.date}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
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
