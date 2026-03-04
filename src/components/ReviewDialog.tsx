import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorName: string;
  className: string;
  subject: string;
  sessionDate: string;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewDialog = ({ open, onOpenChange, tutorName, className, subject, sessionDate, onSubmit }: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setHover(0);
    setComment("");
    onOpenChange(false);
    toast.success("Đã gửi đánh giá thành công!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh giá buổi học</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-sm font-medium text-foreground">{className}</p>
            <p className="text-xs text-muted-foreground">Gia sư: {tutorName} • {subject} • {sessionDate}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Đánh giá sao *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star className={cn(
                    "w-7 h-7 transition-colors",
                    (hover || rating) >= star
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30"
                  )} />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-foreground">
                  {rating === 1 ? "Kém" : rating === 2 ? "Trung bình" : rating === 3 ? "Khá" : rating === 4 ? "Tốt" : "Xuất sắc"}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Nhận xét (tùy chọn)</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về buổi học..."
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              maxLength={500}
            />
            <p className="text-[10px] text-muted-foreground text-right mt-1">{comment.length}/500</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm disabled:opacity-50 transition-colors hover:bg-primary/90"
          >
            Gửi đánh giá
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
