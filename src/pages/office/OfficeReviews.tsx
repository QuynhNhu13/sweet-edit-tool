import { useState } from "react";
import { Star, Search, X, Eye, EyeOff, Trash2, Shield, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarFemale4 from "@/assets/avatar-female-4.jpg";
import avatarMale5 from "@/assets/avatar-male-5.jpg";

interface ModerationLog {
  action: "hide" | "unhide" | "soft_delete";
  reason: string;
  moderatorId: string;
  moderatorName: string;
  timestamp: string;
}

interface OfficeReview {
  id: string;
  sessionId: string;
  classId: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  reviewerRole: "student" | "parent";
  reviewerName: string;
  reviewerAvatar: string;
  studentName: string;
  className: string;
  subject: string;
  rating: number;
  comment: string;
  date: string;
  hidden: boolean;
  deleted: boolean;
  moderationLogs: ModerationLog[];
}

const PREDEFINED_REASONS = [
  "Ngôn ngữ không phù hợp",
  "Nội dung spam / quảng cáo",
  "Thông tin sai sự thật",
  "Vi phạm quyền riêng tư",
  "Không liên quan đến buổi học",
  "Đánh giá trùng lặp",
];

const CURRENT_MODERATOR = { id: "mod-001", name: "Trần Minh Tú" };

const seedReviews: OfficeReview[] = [
  { id: "or1", sessionId: "s2", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Thầy rất tận tâm, con tiến bộ rõ rệt sau 2 tháng.", date: "2026-02-28", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or2", sessionId: "s4", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 4, comment: "Buổi này hơi nhanh, con chưa kịp hiểu hết.", date: "2026-02-14", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or3", sessionId: "s8", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Đề thi thử 8.0 điểm! Rất hài lòng!", date: "2026-02-28", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or4", sessionId: "s12", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Con tiến bộ nhiều, từ 5 điểm lên 8 điểm!", date: "2026-01-20", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or5", sessionId: "s17", classId: "c2", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Trần Thị Hương", reviewerAvatar: avatarFemale4, studentName: "Trần Thị Hương", className: "Lý 11 - Nâng cao", subject: "Lý", rating: 4, comment: "Thầy giảng cơ học rất hay.", date: "2026-02-20", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or6", sessionId: "s16", classId: "c2", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Trần Văn Minh", reviewerAvatar: avatarMale5, studentName: "Trần Thị Hương", className: "Lý 11 - Nâng cao", subject: "Lý", rating: 3, comment: "Buổi đầu chưa thấy rõ hiệu quả, cần thêm thời gian.", date: "2026-02-12", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or7", sessionId: "s1", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Thầy giảng rất dễ hiểu, em nắm được ngay.", date: "2026-02-05", hidden: false, deleted: false, moderationLogs: [] },
  { id: "or8", sessionId: "s5", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 2, comment: "Nội dung không phù hợp, lạc đề so với thỏa thuận ban đầu.", date: "2026-02-13", hidden: true, deleted: false, moderationLogs: [{ action: "hide", reason: "Nội dung spam / quảng cáo", moderatorId: "mod-001", moderatorName: "Trần Minh Tú", timestamp: "2026-02-14T09:30:00" }] },
];

const OfficeReviews = () => {
  const [reviews, setReviews] = useState(seedReviews);
  const [search, setSearch] = useState("");
  const [filterTutor, setFilterTutor] = useState("all");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [showHidden, setShowHidden] = useState(false);

  // Moderation dialog state
  const [moderationDialog, setModerationDialog] = useState<{ open: boolean; reviewId: string; action: "hide" | "unhide" | "soft_delete" }>({ open: false, reviewId: "", action: "hide" });
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showLogDialog, setShowLogDialog] = useState<string | null>(null);

  const tutors = [...new Set(reviews.map(r => r.tutorName))];

  const filtered = reviews.filter(r => {
    if (r.deleted && !showHidden) return false;
    if (!showHidden && r.hidden) return false;
    if (search && !r.comment.toLowerCase().includes(search.toLowerCase()) && !r.reviewerName.toLowerCase().includes(search.toLowerCase()) && !r.tutorName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTutor !== "all" && r.tutorName !== filterTutor) return false;
    if (filterRating && r.rating !== filterRating) return false;
    if (filterRole !== "all" && r.reviewerRole !== filterRole) return false;
    return true;
  });

  const visibleReviews = reviews.filter(r => !r.hidden && !r.deleted);
  const avgRating = visibleReviews.length > 0
    ? visibleReviews.reduce((s, r) => s + r.rating, 0) / visibleReviews.length
    : 0;

  const openModeration = (reviewId: string, action: "hide" | "unhide" | "soft_delete") => {
    // Unhide doesn't need reason dialog
    if (action === "unhide") {
      setReviews(prev => prev.map(r => {
        if (r.id !== reviewId) return r;
        const log: ModerationLog = { action: "unhide", reason: "Khôi phục hiển thị", moderatorId: CURRENT_MODERATOR.id, moderatorName: CURRENT_MODERATOR.name, timestamp: new Date().toISOString() };
        return { ...r, hidden: false, moderationLogs: [...r.moderationLogs, log] };
      }));
      toast.success("Đã khôi phục đánh giá.");
      return;
    }
    setSelectedReason("");
    setCustomReason("");
    setModerationDialog({ open: true, reviewId, action });
  };

  const confirmModeration = () => {
    const reason = selectedReason === "__custom" ? customReason.trim() : selectedReason;
    if (!reason) {
      toast.error("Vui lòng chọn hoặc nhập lý do.");
      return;
    }

    const { reviewId, action } = moderationDialog;
    const log: ModerationLog = {
      action,
      reason,
      moderatorId: CURRENT_MODERATOR.id,
      moderatorName: CURRENT_MODERATOR.name,
      timestamp: new Date().toISOString(),
    };

    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      if (action === "hide") return { ...r, hidden: true, moderationLogs: [...r.moderationLogs, log] };
      if (action === "soft_delete") return { ...r, deleted: true, hidden: true, moderationLogs: [...r.moderationLogs, log] };
      return r;
    }));

    toast.success(action === "hide" ? "Đã ẩn đánh giá." : "Đã xóa mềm đánh giá.");
    setModerationDialog({ open: false, reviewId: "", action: "hide" });
  };

  const logReview = reviews.find(r => r.id === showLogDialog);

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý đánh giá</h1>
        <p className="text-muted-foreground text-sm">Kiểm duyệt và quản lý đánh giá từ phụ huynh và học sinh</p>
      </div> */}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Card 1: Tổng đánh giá */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{reviews.filter(r => !r.deleted).length}</p>
              <p className="text-xs text-white/80 mt-1">Tổng đánh giá</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Điểm trung bình */}
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-white/80 mt-1">Điểm trung bình</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Đã ẩn */}
        <Card className="border-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{reviews.filter(r => r.hidden && !r.deleted).length}</p>
              <p className="text-xs text-white/80 mt-1">Đã ẩn</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <EyeOff className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Đã xóa mềm */}
        <Card className="border-0 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{reviews.filter(r => r.deleted).length}</p>
              <p className="text-xs text-white/80 mt-1">Đã xóa mềm</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo nội dung, người đánh giá, gia sư..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <select value={filterTutor} onChange={e => setFilterTutor(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm text-foreground">
          <option value="all">Tất cả gia sư</option>
          {tutors.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm text-foreground">
          <option value="all">Tất cả vai trò</option>
          <option value="student">Học sinh</option>
          <option value="parent">Phụ huynh</option>
        </select>
        <div className="flex gap-1">
          {[5, 4, 3, 2, 1].map(r => (
            <button key={r} onClick={() => setFilterRating(filterRating === r ? null : r)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-colors", filterRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {r}★
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowHidden(!showHidden)}
          className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1", showHidden ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
        >
          <EyeOff className="w-3.5 h-3.5" /> {showHidden ? "Đang hiện ẩn" : "Xem đã ẩn/xóa"}
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className={cn("bg-card border border-border rounded-2xl p-5 transition-opacity shadow-soft", (r.hidden || r.deleted) && "opacity-60")}>
            <div className="flex items-start gap-4">
              <img src={r.reviewerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{r.reviewerName}</p>
                      <Badge variant="secondary" className="text-[10px] rounded-full">
                        {r.reviewerRole === "parent" ? "Phụ huynh" : "Học sinh"}
                      </Badge>
                      {r.hidden && !r.deleted && (
                        <Badge variant="outline" className="text-[10px] rounded-full border-destructive/30 text-destructive">
                          <EyeOff className="w-3 h-3 mr-1" /> Đã ẩn
                        </Badge>
                      )}
                      {r.deleted && (
                        <Badge variant="outline" className="text-[10px] rounded-full border-destructive/30 text-destructive">
                          <Trash2 className="w-3 h-3 mr-1" /> Đã xóa mềm
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      GS: {r.tutorName} • {r.className} • HS: {r.studentName} • {r.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                    <div className="flex gap-1 ml-2">
                      {r.moderationLogs.length > 0 && (
                        <button
                          onClick={() => setShowLogDialog(r.id)}
                          title="Xem lịch sử kiểm duyệt"
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      {!r.deleted && (
                        <button
                          onClick={() => openModeration(r.id, r.hidden ? "unhide" : "hide")}
                          title={r.hidden ? "Hiện lại" : "Ẩn đánh giá"}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          {r.hidden ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      )}
                      {!r.deleted && (
                        <button
                          onClick={() => openModeration(r.id, "soft_delete")}
                          title="Xóa mềm"
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                {r.moderationLogs.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    Kiểm duyệt lần cuối: {r.moderationLogs[r.moderationLogs.length - 1].moderatorName} — {new Date(r.moderationLogs[r.moderationLogs.length - 1].timestamp).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không có đánh giá nào phù hợp.</p>}
      </div>

      {/* Moderation Reason Dialog */}
      <Dialog open={moderationDialog.open} onOpenChange={open => { if (!open) setModerationDialog(prev => ({ ...prev, open: false })); }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {moderationDialog.action === "hide" ? "Ẩn đánh giá" : "Xóa mềm đánh giá"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Vui lòng chọn hoặc nhập lý do. Thao tác này sẽ được ghi lại trong hệ thống.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-sm font-medium text-foreground">Chọn lý do:</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => { setSelectedReason(reason); setCustomReason(""); }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    selectedReason === reason
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {reason}
                </button>
              ))}
              <button
                onClick={() => setSelectedReason("__custom")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  selectedReason === "__custom"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                Lý do khác...
              </button>
            </div>

            {selectedReason === "__custom" && (
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Nhập lý do cụ thể..."
                maxLength={500}
                className="w-full p-3 bg-muted border border-border rounded-xl text-sm text-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setModerationDialog(prev => ({ ...prev, open: false }))}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={confirmModeration}
              disabled={!selectedReason || (selectedReason === "__custom" && !customReason.trim())}
            >
              {moderationDialog.action === "hide" ? "Ẩn đánh giá" : "Xóa mềm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Moderation Log Dialog */}
      <Dialog open={!!showLogDialog} onOpenChange={open => { if (!open) setShowLogDialog(null); }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Lịch sử kiểm duyệt
            </DialogTitle>
          </DialogHeader>
          {logReview && (
            <div className="space-y-3 py-2 max-h-[300px] overflow-y-auto">
              {logReview.moderationLogs.map((log, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={log.action === "unhide" ? "secondary" : "destructive"} className="text-[10px] rounded-full">
                      {log.action === "hide" ? "Ẩn" : log.action === "unhide" ? "Khôi phục" : "Xóa mềm"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground"><span className="font-medium">Người xử lý:</span> {log.moderatorName} ({log.moderatorId})</p>
                  <p className="text-xs text-muted-foreground mt-0.5"><span className="font-medium text-foreground">Lý do:</span> {log.reason}</p>
                </div>
              ))}
              {logReview.moderationLogs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có lịch sử kiểm duyệt.</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeReviews;
