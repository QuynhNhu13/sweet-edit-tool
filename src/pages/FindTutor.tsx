import { useState, useMemo } from "react";
import {
  Search,
  Star,
  MapPin,
  Filter,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Clock,
  X,
  Award,
  Play,
  GraduationCap,
  Video,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import tutor6 from "@/assets/tutor-6.jpg";

const allSubjects = [
  "Tất cả",
  "Toán",
  "Lý",
  "Hóa",
  "Sinh",
  "Anh văn",
  "IELTS",
  "Văn",
  "Sử",
  "Tin học",
];

const tutorListings = [
  {
    id: "t1",
    name: "Nguyễn Văn An",
    avatar: tutor1,
    subjects: ["Toán", "Lý"],
    rating: 4.8,
    totalReviews: 47,
    totalSessions: 312,
    yearsExperience: 5,
    hourlyRate: 250000,
    location: "Quận 3, TP.HCM",
    verified: true,
    bio: "Gia sư Toán - Lý với 5 năm kinh nghiệm dạy ôn thi đại học. Phương pháp giảng dạy hiện đại, tập trung vào tư duy logic.",
    school: "ĐH Sư Phạm TP.HCM",
    degree: "Cử nhân Sư phạm Toán",
    type: "tutor",
    certificates: ["Chứng chỉ Sư phạm", "TESOL (Cambridge)"],
    introVideoUrl: "https://example.com/intro-an.mp4",
    teachingStyle:
      "Tập trung tư duy logic, giải bài từ cơ bản đến nâng cao. Sử dụng bảng trắng online và bài tập tương tác.",
    achievements: [
      "Top 10 gia sư Toán TP.HCM 2025",
      "100% học sinh đạt 7+ THPTQG",
    ],
    availableSlots: [
      { day: "Thứ 2", time: "19:00-21:00" },
      { day: "Thứ 4", time: "19:00-21:00" },
      { day: "Thứ 6", time: "19:00-21:00" },
    ],
  },
  {
    id: "t2",
    name: "Trần Thị Bích Ngọc",
    avatar: tutor2,
    subjects: ["Hóa", "Sinh"],
    rating: 4.9,
    totalReviews: 62,
    totalSessions: 450,
    yearsExperience: 12,
    hourlyRate: 300000,
    location: "Quận 1, TP.HCM",
    verified: true,
    bio: "Giáo viên trường Lê Hồng Phong, thạc sĩ Hóa hữu cơ. 12 năm kinh nghiệm giảng dạy chuyên.",
    school: "THPT Lê Hồng Phong",
    degree: "Thạc sĩ Hóa học",
    type: "teacher",
    certificates: [
      "Thạc sĩ Hóa Hữu cơ - ĐH KHTN",
      "Giáo viên Giỏi cấp Thành phố 2024",
      "Chứng chỉ Nghiệp vụ Sư phạm",
    ],
    introVideoUrl: "https://example.com/intro-ngoc.mp4",
    teachingStyle:
      "Giảng dạy có hệ thống, kết hợp thí nghiệm minh họa qua video. Kiểm tra đầu giờ mỗi buổi.",
    achievements: [
      "Giáo viên Giỏi cấp TP 3 năm liên tiếp",
      "15 học sinh đạt giải HSG Quốc gia",
    ],
    availableSlots: [
      { day: "Thứ 3", time: "17:00-18:30" },
      { day: "Thứ 5", time: "19:00-20:30" },
    ],
  },
  {
    id: "t3",
    name: "Phạm Đức Huy",
    avatar: tutor3,
    subjects: ["Anh văn", "IELTS"],
    rating: 4.7,
    totalReviews: 35,
    totalSessions: 198,
    yearsExperience: 4,
    hourlyRate: 350000,
    location: "Quận 7, TP.HCM",
    verified: true,
    bio: "IELTS 8.5, chuyên luyện thi IELTS cho học sinh cấp 3. Phương pháp immersion hiệu quả.",
    school: "ĐH Ngoại Thương",
    degree: "Cử nhân Anh văn",
    type: "tutor",
    certificates: [
      "IELTS 8.5 (British Council)",
      "CELTA (Cambridge)",
      "TKT Module 1-3",
    ],
    introVideoUrl: "https://example.com/intro-huy.mp4",
    teachingStyle:
      "100% tiếng Anh trong giờ học, tập trung kỹ năng Writing & Speaking. Chấm bài và feedback chi tiết trong 24h.",
    achievements: [
      "95% học sinh đạt IELTS 6.5+",
      "Mentor chương trình English Camp 2025",
    ],
    availableSlots: [
      { day: "Thứ 7", time: "9:00-10:30" },
      { day: "Chủ nhật", time: "9:00-10:30" },
    ],
  },
  {
    id: "t4",
    name: "Lê Thị Hồng Nhung",
    avatar: tutor4,
    subjects: ["Văn", "Sử"],
    rating: 4.6,
    totalReviews: 28,
    totalSessions: 156,
    yearsExperience: 6,
    hourlyRate: 200000,
    location: "Quận Bình Thạnh, TP.HCM",
    verified: false,
    bio: "Giáo viên Văn - Sử, đam mê truyền cảm hứng cho học sinh yêu thích văn chương.",
    school: "ĐH KHXH&NV",
    degree: "Cử nhân Ngữ Văn",
    type: "teacher",
    certificates: [
      "Cử nhân Ngữ Văn - ĐH KHXH&NV",
      "Chứng chỉ Tâm lý Giáo dục",
    ],
    teachingStyle:
      "Kết hợp phân tích tác phẩm với bối cảnh lịch sử. Luyện viết essay mỗi buổi.",
    achievements: ["5 học sinh đạt 9+ môn Văn THPTQG"],
    availableSlots: [
      { day: "Thứ 2", time: "17:00-18:30" },
      { day: "Thứ 4", time: "17:00-18:30" },
    ],
  },
  {
    id: "t5",
    name: "Võ Minh Tuấn",
    avatar: tutor5,
    subjects: ["Toán", "Tin học"],
    rating: 4.9,
    totalReviews: 55,
    totalSessions: 380,
    yearsExperience: 8,
    hourlyRate: 280000,
    location: "Quận Tân Bình, TP.HCM",
    verified: true,
    bio: "Chuyên gia lập trình và toán ứng dụng, 8 năm kinh nghiệm giảng dạy.",
    school: "ĐH Bách Khoa",
    degree: "Kỹ sư CNTT",
    type: "tutor",
    certificates: [
      "Kỹ sư CNTT - ĐH Bách Khoa",
      "AWS Cloud Practitioner",
      "Google Data Analytics",
    ],
    introVideoUrl: "https://example.com/intro-tuan.mp4",
    teachingStyle:
      "Giảng dạy qua dự án thực tế, kết hợp coding và toán ứng dụng. Sử dụng Jupyter Notebook.",
    achievements: [
      "3 học sinh đạt giải Tin học Quốc gia",
      "Top 5 gia sư Tin học 2025",
    ],
    availableSlots: [
      { day: "Thứ 3", time: "17:00-18:30" },
      { day: "Thứ 5", time: "17:00-18:30" },
    ],
  },
  {
    id: "t6",
    name: "Nguyễn Thị Mai Anh",
    avatar: tutor6,
    subjects: ["Toán", "Hóa"],
    rating: 4.5,
    totalReviews: 19,
    totalSessions: 95,
    yearsExperience: 3,
    hourlyRate: 180000,
    location: "Quận 9, TP.HCM",
    verified: false,
    bio: "Sinh viên năm cuối ĐH Sư Phạm, nhiệt tình và kiên nhẫn với từng học sinh.",
    school: "ĐH Sư Phạm TP.HCM",
    degree: "SV Sư phạm Toán",
    type: "tutor",
    certificates: [
      "SV năm 4 Sư phạm Toán",
      "Giải 3 Olympic Toán SV 2024",
    ],
    teachingStyle:
      "Giảng dạy nhẹ nhàng, kiên nhẫn. Chia nhỏ bài tập, luyện từng dạng.",
    achievements: ["Giải 3 Olympic Toán SV 2024"],
    availableSlots: [
      { day: "Thứ 2", time: "18:00-20:00" },
      { day: "Thứ 6", time: "18:00-20:00" },
    ],
  },
];

const FindTutor = () => {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Tất cả");
  const [typeFilter, setTypeFilter] = useState<"all" | "tutor" | "teacher">(
    "all"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [bookedTutors, setBookedTutors] = useState<Set<string>>(new Set());
  const [trialRequested, setTrialRequested] = useState<Set<string>>(new Set());
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [bookingModal, setBookingModal] = useState<{
    tutorId: string;
    subject: string;
  } | null>(null);
  const [trialModal, setTrialModal] = useState<string | null>(null);
  const [bookStartDate, setBookStartDate] = useState("");
  const [bookSessions, setBookSessions] = useState(12);
  const [bookSchedule, setBookSchedule] = useState("");
  const [selectedTrialSlot, setSelectedTrialSlot] = useState<{
    day: string;
    time: string;
  } | null>(null);
  const [listPage, setListPage] = useState(1);

  const filtered = useMemo(() => {
    return tutorListings.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some((s) =>
          s.toLowerCase().includes(search.toLowerCase())
        );
      const matchSubject =
        subjectFilter === "Tất cả" || t.subjects.includes(subjectFilter);
      const matchPrice =
        t.hourlyRate >= priceRange[0] && t.hourlyRate <= priceRange[1];
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchSubject && matchPrice && matchType;
    });
  }, [search, subjectFilter, priceRange, typeFilter]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(listPage, pageCount);
  const pagedTutors = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleBook = () => {
    if (!bookingModal || !bookStartDate || !bookSchedule) return;
    setBookedTutors((prev) => new Set(prev).add(bookingModal.tutorId));
    setBookingModal(null);
    setBookStartDate("");
    setBookSchedule("");
  };

  const handleTrial = () => {
    if (!trialModal || !selectedTrialSlot) return;
    setTrialRequested((prev) => new Set(prev).add(trialModal));
    setTrialModal(null);
    setSelectedTrialSlot(null);
  };

  const trialTutor = trialModal
    ? tutorListings.find((t) => t.id === trialModal)
    : null;
  const profileTutor = selectedProfile
    ? tutorListings.find((t) => t.id === selectedProfile)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-section-lg md:text-hero font-extrabold text-foreground mb-3">
              Tìm gia sư <span className="text-gradient">phù hợp</span>
            </h1>
            <p className="text-muted-foreground text-body-lg">
              Hơn 1,200 gia sư đã được xác thực và sẵn sàng giảng dạy
            </p>
          </div>

          <div className="p-6 space-y-6">
      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc môn học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" /> Bộ lọc
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Loại
              </p>
              <div className="flex gap-2">
                {[
                  { val: "all", label: "Tất cả" },
                  { val: "tutor", label: "Gia sư" },
                  { val: "teacher", label: "Giáo viên" },
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setTypeFilter(t.val as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      typeFilter === t.val
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Môn học
              </p>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubjectFilter(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      subjectFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Giá / giờ: {priceRange[0].toLocaleString("vi-VN")}đ -{" "}
                {priceRange[1].toLocaleString("vi-VN")}đ
              </p>
              <div className="flex gap-4">
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={50000}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={50000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {subjectFilter !== "Tất cả" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => setSubjectFilter("Tất cả")}
            >
              {subjectFilter}{" "}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {typeFilter !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => setTypeFilter("all")}
            >
              {typeFilter === "tutor" ? "Gia sư" : "Giáo viên"}{" "}
              <X className="w-3 h-3" />
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} kết quả
          </span>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={!!bookingModal} onOpenChange={() => setBookingModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Đăng ký học -{" "}
              {bookingModal &&
                tutorListings.find((t) => t.id === bookingModal.tutorId)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Môn học
              </label>
              <Input
                value={bookingModal?.subject || ""}
                disabled
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Ngày bắt đầu
              </label>
              <Input
                type="date"
                value={bookStartDate}
                onChange={(e) => setBookStartDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Số buổi
              </label>
              <Input
                type="number"
                min={4}
                max={48}
                value={bookSessions}
                onChange={(e) => setBookSessions(Number(e.target.value))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Lịch học mong muốn
              </label>
              <Input
                placeholder="VD: T2, T4, T6 - 19:00-21:00"
                value={bookSchedule}
                onChange={(e) => setBookSchedule(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Tạm tính học phí</p>
              <p className="text-sm font-bold text-foreground">
                {(
                  (bookingModal
                    ? tutorListings.find((t) => t.id === bookingModal.tutorId)
                        ?.hourlyRate || 0
                    : 0) * bookSessions
                ).toLocaleString("vi-VN")}
                đ
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              className="flex-1 rounded-xl"
              onClick={handleBook}
              disabled={!bookStartDate || !bookSchedule}
            >
              Xác nhận đăng ký
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setBookingModal(null)}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trial Modal */}
      <Dialog
        open={!!trialTutor}
        onOpenChange={() => {
          setTrialModal(null);
          setSelectedTrialSlot(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng ký học thử - {trialTutor?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Chọn lịch rảnh của{" "}
            {trialTutor?.type === "teacher" ? "giáo viên" : "gia sư"} để học thử
          </p>
          <div className="space-y-2">
            {(trialTutor?.availableSlots || []).map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedTrialSlot(slot)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center gap-3",
                  selectedTrialSlot?.day === slot.day &&
                    selectedTrialSlot?.time === slot.time
                    ? "border-primary bg-primary/5 font-medium"
                    : "border-border hover:border-primary/50"
                )}
              >
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span>
                  {slot.day} - {slot.time}
                </span>
              </button>
            ))}
            {(!trialTutor?.availableSlots ||
              trialTutor.availableSlots.length === 0) && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Chưa có lịch rảnh
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 rounded-xl"
              onClick={handleTrial}
              disabled={!selectedTrialSlot}
            >
              Gửi yêu cầu
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setTrialModal(null);
                setSelectedTrialSlot(null);
              }}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal - Enhanced */}
      <Dialog
        open={!!profileTutor}
        onOpenChange={() => setSelectedProfile(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {profileTutor && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={profileTutor.avatar}
                    alt=""
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DialogTitle className="text-lg">
                        {profileTutor.name}
                      </DialogTitle>
                      {profileTutor.verified && (
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                      )}
                      {profileTutor.type === "teacher" && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-medium">
                          <ShieldCheck className="w-3 h-3" /> Verified Teacher
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profileTutor.degree} • {profileTutor.school}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-current text-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {profileTutor.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({profileTutor.totalReviews} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1 text-xs">
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="credentials"
                    className="flex-1 text-xs"
                  >
                    Bằng cấp
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex-1 text-xs">
                    Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    {profileTutor.bio}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] text-muted-foreground">
                        Kinh nghiệm
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {profileTutor.yearsExperience} năm
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] text-muted-foreground">
                        Buổi dạy
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {profileTutor.totalSessions}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] text-muted-foreground">
                        Môn dạy
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {profileTutor.subjects.join(", ")}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] text-muted-foreground">
                        Giá / giờ
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {profileTutor.hourlyRate.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                  {profileTutor.teachingStyle && (
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Phong cách giảng dạy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profileTutor.teachingStyle}
                      </p>
                    </div>
                  )}
                  {profileTutor.achievements &&
                    profileTutor.achievements.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> Thành tích nổi bật
                        </p>
                        <div className="space-y-1.5">
                          {profileTutor.achievements.map((a, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </TabsContent>

                <TabsContent value="credentials" className="space-y-4 mt-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Học vấn
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {profileTutor.degree}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profileTutor.school}
                    </p>
                  </div>
                  {profileTutor.certificates &&
                    profileTutor.certificates.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> Chứng chỉ & Bằng cấp
                        </p>
                        <div className="space-y-2">
                          {profileTutor.certificates.map((cert, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                            >
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <p className="text-sm text-foreground">{cert}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </TabsContent>

                <TabsContent value="video" className="mt-4">
                  {profileTutor.introVideoUrl ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors" />
                        <div className="flex flex-col items-center gap-2 z-10">
                          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            Video giới thiệu
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Video giới thiệu phương pháp giảng dạy của{" "}
                        {profileTutor.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Video className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Chưa có video giới thiệu
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setBookingModal({
                      tutorId: profileTutor.id,
                      subject: profileTutor.subjects[0],
                    });
                    setSelectedProfile(null);
                  }}
                >
                  Đăng ký học
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setTrialModal(profileTutor.id);
                    setSelectedProfile(null);
                  }}
                >
                  Học thử
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tutors Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagedTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-elevated transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={tutor.avatar}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {tutor.name}
                    </h3>
                    {tutor.verified && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-medium">
                        <CheckCircle2 className="w-3 h-3" /> KYC
                      </span>
                    )}
                    {tutor.type === "teacher" && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3" /> Giáo viên
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-current text-foreground" />
                    <span className="text-xs font-semibold text-foreground">
                      {tutor.rating}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({tutor.totalReviews})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tutor.subjects.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  {tutor.totalSessions} buổi
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {tutor.yearsExperience} năm KN
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {tutor.location}
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  {tutor.hourlyRate.toLocaleString("vi-VN")}đ/h
                </div>
              </div>

              {tutor.certificates && tutor.certificates.length > 0 && (
                <div className="mb-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Award className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {tutor.certificates[0]}
                    {tutor.certificates.length > 1
                      ? ` +${tutor.certificates.length - 1}`
                      : ""}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                {bookedTutors.has(tutor.id) ? (
                  <Button
                    disabled
                    className="flex-1 rounded-xl text-xs"
                    size="sm"
                  >
                    Đã đăng ký
                  </Button>
                ) : (
                  <Button
                    className="flex-1 rounded-xl text-xs"
                    size="sm"
                    onClick={() =>
                      setBookingModal({
                        tutorId: tutor.id,
                        subject: tutor.subjects[0],
                      })
                    }
                  >
                    Đăng ký học
                  </Button>
                )}
                {trialRequested.has(tutor.id) ? (
                  <Button
                    disabled
                    variant="outline"
                    className="rounded-xl text-xs"
                    size="sm"
                  >
                    Đã gửi
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-xl text-xs"
                    size="sm"
                    onClick={() => setTrialModal(tutor.id)}
                  >
                    Học thử
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="rounded-xl text-xs"
                  size="sm"
                  onClick={() => setSelectedProfile(tutor.id)}
                >
                  Hồ sơ
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setListPage((p) => Math.max(1, p - 1));
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
                      setListPage(idx + 1);
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
                    setListPage((p) => Math.min(pageCount, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Không tìm thấy gia sư phù hợp. Hãy thử thay đổi bộ lọc.
          </p>
        </div>
      )}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default FindTutor;
