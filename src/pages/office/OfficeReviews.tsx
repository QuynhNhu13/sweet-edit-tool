import { useState } from "react";
import { Star, Search, X, Eye, EyeOff, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarFemale4 from "@/assets/avatar-female-4.jpg";
import avatarMale5 from "@/assets/avatar-male-5.jpg";

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
}

const seedReviews: OfficeReview[] = [
  { id: "or1", sessionId: "s2", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Thầy rất tận tâm, con tiến bộ rõ rệt sau 2 tháng.", date: "2026-02-28", hidden: false },
  { id: "or2", sessionId: "s4", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 4, comment: "Buổi này hơi nhanh, con chưa kịp hiểu hết.", date: "2026-02-14", hidden: false },
  { id: "or3", sessionId: "s8", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Đề thi thử 8.0 điểm! Rất hài lòng!", date: "2026-02-28", hidden: false },
  { id: "or4", sessionId: "s12", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Phạm Hồng Đào", reviewerAvatar: avatarFemale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Con tiến bộ nhiều, từ 5 điểm lên 8 điểm!", date: "2026-01-20", hidden: false },
  { id: "or5", sessionId: "s17", classId: "c2", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Trần Thị Hương", reviewerAvatar: avatarFemale4, studentName: "Trần Thị Hương", className: "Lý 11 - Nâng cao", subject: "Lý", rating: 4, comment: "Thầy giảng cơ học rất hay.", date: "2026-02-20", hidden: false },
  { id: "or6", sessionId: "s16", classId: "c2", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "parent", reviewerName: "Trần Văn Minh", reviewerAvatar: avatarMale5, studentName: "Trần Thị Hương", className: "Lý 11 - Nâng cao", subject: "Lý", rating: 3, comment: "Buổi đầu chưa thấy rõ hiệu quả, cần thêm thời gian.", date: "2026-02-12", hidden: false },
  { id: "or7", sessionId: "s1", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 5, comment: "Thầy giảng rất dễ hiểu, em nắm được ngay.", date: "2026-02-05", hidden: false },
  { id: "or8", sessionId: "s5", classId: "c1", tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, reviewerRole: "student", reviewerName: "Lê Minh Châu", reviewerAvatar: avatarMale2, studentName: "Lê Minh Châu", className: "Toán 12 - Ôn thi ĐH", subject: "Toán", rating: 2, comment: "Nội dung không phù hợp, lạc đề so với thỏa thuận ban đầu.", date: "2026-02-13", hidden: true },
];

const OfficeReviews = () => {
  const [reviews, setReviews] = useState(seedReviews);
  const [search, setSearch] = useState("");
  const [filterTutor, setFilterTutor] = useState("all");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [showHidden, setShowHidden] = useState(false);

  const tutors = [...new Set(reviews.map(r => r.tutorName))];

  const filtered = reviews.filter(r => {
    if (!showHidden && r.hidden) return false;
    if (search && !r.comment.toLowerCase().includes(search.toLowerCase()) && !r.reviewerName.toLowerCase().includes(search.toLowerCase()) && !r.tutorName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTutor !== "all" && r.tutorName !== filterTutor) return false;
    if (filterRating && r.rating !== filterRating) return false;
    if (filterRole !== "all" && r.reviewerRole !== filterRole) return false;
    return true;
  });

  const avgRating = reviews.filter(r => !r.hidden).length > 0
    ? reviews.filter(r => !r.hidden).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => !r.hidden).length
    : 0;

  const handleHide = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r));
    toast.success("Đã cập nhật trạng thái đánh giá.");
  };

  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success("Đã xóa đánh giá.");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Tổng đánh giá</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{avgRating.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">Điểm trung bình</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{reviews.filter(r => r.hidden).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đã ẩn</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground">{tutors.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Gia sư được đánh giá</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo nội dung, người đánh giá, gia sư..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <select value={filterTutor} onChange={e => setFilterTutor(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="all">Tất cả gia sư</option>
          {tutors.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
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
          <EyeOff className="w-3.5 h-3.5" /> {showHidden ? "Đang hiện ẩn" : "Xem đã ẩn"}
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className={cn("bg-card border border-border rounded-2xl p-5 transition-opacity", r.hidden && "opacity-60")}>
            <div className="flex items-start gap-4">
              <img src={r.reviewerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{r.reviewerName}</p>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium",
                        r.reviewerRole === "parent" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"
                      )}>
                        {r.reviewerRole === "parent" ? "Phụ huynh" : "Học sinh"}
                      </span>
                      {r.hidden && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium bg-destructive/10 text-destructive">Đã ẩn</span>
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
                      <button
                        onClick={() => handleHide(r.id)}
                        title={r.hidden ? "Hiện lại" : "Ẩn đánh giá"}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        {r.hidden ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        title="Xóa đánh giá"
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không có đánh giá nào phù hợp.</p>}
      </div>
    </div>
  );
};

export default OfficeReviews;
