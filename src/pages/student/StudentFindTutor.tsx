import { useStudent } from "@/contexts/StudentContext";
import { Search, Star, MapPin, CheckCircle2, BookOpen, Clock, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const allSubjects = ["Tất cả", "Toán", "Lý", "Hóa", "Sinh", "Anh văn", "IELTS", "Văn", "Sử", "Tin học"];

const StudentFindTutor = () => {
  const { tutorListings, bookTutor } = useStudent();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [bookedTutors, setBookedTutors] = useState<Set<string>>(new Set());
  const [trialRequested, setTrialRequested] = useState<Set<string>>(new Set());
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const filtered = tutorListings.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchSubject = subjectFilter === "Tất cả" || t.subjects.includes(subjectFilter);
    const matchPrice = t.hourlyRate >= priceRange[0] && t.hourlyRate <= priceRange[1];
    return matchSearch && matchSubject && matchPrice;
  });

  const handleBook = (tutorId: string, subject: string) => {
    bookTutor(tutorId, subject);
    setBookedTutors(prev => new Set(prev).add(tutorId));
    toast({ title: "Đăng ký thành công!", description: "Đã đăng ký lớp học mới. Vui lòng kiểm tra trong mục Lớp học." });
  };

  const handleTrial = (tutorId: string) => {
    setTrialRequested(prev => new Set(prev).add(tutorId));
    toast({ title: "Yêu cầu học thử đã gửi!", description: "Gia sư sẽ xác nhận yêu cầu học thử của bạn sớm." });
  };

  const profileTutor = selectedProfile ? tutorListings.find(t => t.id === selectedProfile) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc môn học..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" /> Bộ lọc
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Môn học</p>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map(s => (
                  <button key={s} onClick={() => setSubjectFilter(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", subjectFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Giá / giờ: {priceRange[0].toLocaleString("vi-VN")}đ - {priceRange[1].toLocaleString("vi-VN")}đ</p>
              <div className="flex gap-4">
                <input type="range" min={0} max={500000} step={50000} value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} className="flex-1" />
                <input type="range" min={0} max={500000} step={50000} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="flex-1" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {subjectFilter !== "Tất cả" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSubjectFilter("Tất cả")}>
              {subjectFilter} ✕
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} gia sư</span>
        </div>
      </div>

      {/* Profile Modal */}
      {profileTutor && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setSelectedProfile(null)}>
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full shadow-elevated" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <img src={profileTutor.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{profileTutor.name}</h2>
                  {profileTutor.verified && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{profileTutor.degree} • {profileTutor.school}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-foreground">{profileTutor.rating}</span>
                  <span className="text-xs text-muted-foreground">({profileTutor.totalReviews} đánh giá)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{profileTutor.bio}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-muted/50 rounded-xl"><p className="text-[10px] text-muted-foreground">Kinh nghiệm</p><p className="text-sm font-semibold text-foreground">{profileTutor.yearsExperience} năm</p></div>
              <div className="p-3 bg-muted/50 rounded-xl"><p className="text-[10px] text-muted-foreground">Buổi dạy</p><p className="text-sm font-semibold text-foreground">{profileTutor.totalSessions}</p></div>
              <div className="p-3 bg-muted/50 rounded-xl"><p className="text-[10px] text-muted-foreground">Môn dạy</p><p className="text-sm font-semibold text-foreground">{profileTutor.subjects.join(", ")}</p></div>
              <div className="p-3 bg-muted/50 rounded-xl"><p className="text-[10px] text-muted-foreground">Giá / giờ</p><p className="text-sm font-semibold text-foreground">{profileTutor.hourlyRate.toLocaleString("vi-VN")}đ</p></div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 rounded-xl" onClick={() => { handleBook(profileTutor.id, profileTutor.subjects[0]); setSelectedProfile(null); }}>Đăng ký học</Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedProfile(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tutor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(tutor => (
          <div key={tutor.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-elevated transition-all">
            <div className="flex items-start gap-4 mb-4">
              <img src={tutor.avatar} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{tutor.name}</h3>
                  {tutor.verified && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                      <CheckCircle2 className="w-3 h-3" /> KYC
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-foreground">{tutor.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({tutor.totalReviews})</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tutor.subjects.map(s => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground"><BookOpen className="w-3 h-3" />{tutor.totalSessions} buổi</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3 h-3" />{tutor.yearsExperience} năm KN</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-3 h-3" />{tutor.location}</div>
              <div className="flex items-center gap-1.5 font-semibold text-foreground">{tutor.hourlyRate.toLocaleString("vi-VN")}đ/h</div>
            </div>

            <div className="flex gap-2">
              {bookedTutors.has(tutor.id) ? (
                <Button disabled className="flex-1 rounded-xl text-xs" size="sm">Đã đăng ký ✓</Button>
              ) : (
                <Button className="flex-1 rounded-xl text-xs" size="sm" onClick={() => handleBook(tutor.id, tutor.subjects[0])}>Đăng ký học</Button>
              )}
              {trialRequested.has(tutor.id) ? (
                <Button disabled variant="outline" className="rounded-xl text-xs" size="sm">Đã gửi ✓</Button>
              ) : (
                <Button variant="outline" className="rounded-xl text-xs" size="sm" onClick={() => handleTrial(tutor.id)}>Học thử</Button>
              )}
              <Button variant="ghost" className="rounded-xl text-xs" size="sm" onClick={() => setSelectedProfile(tutor.id)}>Xem hồ sơ</Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Không tìm thấy gia sư phù hợp. Hãy thử thay đổi bộ lọc.</p>
        </div>
      )}
    </div>
  );
};

export default StudentFindTutor;
