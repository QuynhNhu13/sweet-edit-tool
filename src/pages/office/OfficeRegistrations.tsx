import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  UserPlus,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";

type RegStatus = "pending" | "approved" | "rejected";

interface Registration {
  id: string;
  name: string;
  avatar: string;
  role: "student" | "tutor" | "teacher" | "parent";
  email: string;
  phone: string;
  subject?: string;
  note: string;
  date: string;
  status: RegStatus;
  rejectReason?: string;
}

const roleLabels: Record<string, string> = {
  student: "Học sinh",
  tutor: "Gia sư",
  teacher: "Giáo viên",
  parent: "Phụ huynh",
};

const statusCfg: Record<
  string,
  { label: string; variant: "default" | "destructive" | "outline" }
> = {
  pending: { label: "Chờ duyệt", variant: "outline" },
  approved: { label: "Đã duyệt", variant: "default" },
  rejected: { label: "Từ chối", variant: "destructive" },
};

const initialData: Registration[] = [
  {
    id: "r1",
    name: "Phạm Văn Hùng",
    avatar: avatarMale1,
    role: "tutor",
    email: "hung.pv@gmail.com",
    phone: "0912345678",
    subject: "Toán, Lý",
    note: "5 năm kinh nghiệm gia sư, tốt nghiệp ĐH Bách Khoa",
    date: "03/03/2026",
    status: "pending",
  },
  {
    id: "r2",
    name: "Nguyễn Thị Hoa",
    avatar: avatarFemale1,
    role: "teacher",
    email: "hoa.nt@gmail.com",
    phone: "0987654321",
    subject: "Văn, Sử",
    note: "Giáo viên THPT 8 năm, chứng chỉ B2",
    date: "02/03/2026",
    status: "pending",
  },
  {
    id: "r3",
    name: "Trần Đức Anh",
    avatar: avatarMale2,
    role: "student",
    email: "anh.td@gmail.com",
    phone: "0901234567",
    subject: "Toán 12",
    note: "Học sinh lớp 12, cần ôn thi ĐH",
    date: "01/03/2026",
    status: "pending",
  },
  {
    id: "r4",
    name: "Lê Thị Mai",
    avatar: avatarFemale2,
    role: "parent",
    email: "mai.lt@gmail.com",
    phone: "0934567890",
    note: "Phụ huynh 2 con, lớp 10 và lớp 12",
    date: "28/02/2026",
    status: "approved",
  },
  {
    id: "r5",
    name: "Võ Quang Hải",
    avatar: avatarMale3,
    role: "tutor",
    email: "hai.vq@gmail.com",
    phone: "0978901234",
    subject: "IELTS",
    note: "IELTS 8.0, 3 năm dạy IELTS",
    date: "27/02/2026",
    status: "approved",
  },
  {
    id: "r6",
    name: "Đinh Thị Ngọc",
    avatar: avatarFemale3,
    role: "student",
    email: "ngoc.dt@gmail.com",
    phone: "0945678901",
    subject: "Hóa 11",
    note: "Cần bổ sung kiến thức Hóa",
    date: "25/02/2026",
    status: "rejected",
    rejectReason: "Thiếu thông tin liên hệ phụ huynh",
  },
];

const OfficeRegistrations = () => {
  const { toast } = useToast();
  const [regs, setRegs] = useState(initialData);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = regs.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || r.role === roleFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const detail = regs.find(r => r.id === detailId);
  const pendingCount = regs.filter(r => r.status === "pending").length;
  const teacherTutorCount = regs.filter(r => r.role === "tutor" || r.role === "teacher").length;
  const studentCount = regs.filter(r => r.role === "student").length;
  const approvedCount = regs.filter(r => r.status === "approved").length;

  const approve = (id: string) => {
    setRegs(prev =>
      prev.map(r => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
    toast({ title: "Đã duyệt đăng ký" });
  };

  const reject = () => {
    if (rejectId && rejectReason.trim()) {
      setRegs(prev =>
        prev.map(r =>
          r.id === rejectId
            ? { ...r, status: "rejected" as const, rejectReason }
            : r
        )
      );
      toast({ title: "Đã từ chối đăng ký", variant: "destructive" });
      setRejectId(null);
      setRejectReason("");
    }
  };

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quản lý đăng ký</h2>
            <p className="mt-1 text-sm text-white/80">
              Theo dõi hồ sơ đăng ký mới và xét duyệt học sinh, phụ huynh, gia sư, giáo viên
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Chờ duyệt</p>
              <p className="text-xl font-bold">{pendingCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/80">Đã duyệt</p>
              <p className="text-xl font-bold">{approvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Chờ duyệt",
            value: pendingCount,
            sub: "Hồ sơ cần xử lý",
            icon: UserPlus,
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "GS/GV đăng ký",
            value: teacherTutorCount,
            sub: "Gia sư & giáo viên",
            icon: GraduationCap,
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "HS đăng ký",
            value: studentCount,
            sub: "Học sinh mới",
            icon: BookOpen,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Đã duyệt",
            value: approvedCount,
            sub: "Hồ sơ hợp lệ",
            icon: Users,
            color: "from-rose-500 to-pink-500",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-r p-5 text-white transition-all hover:shadow-lg ${s.color}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" />
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-9"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 w-[160px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="tutor">Gia sư</SelectItem>
              <SelectItem value="teacher">Giáo viên</SelectItem>
              <SelectItem value="student">Học sinh</SelectItem>
              <SelectItem value="parent">Phụ huynh</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[150px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* LIST */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Danh sách đăng ký</h3>

        <div className="space-y-3">
          {filtered.map(r => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {roleLabels[r.role]}
                      </Badge>
                      <Badge variant={statusCfg[r.status].variant}>
                        {statusCfg[r.status].label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{r.email}</span>
                      <span>{r.phone}</span>
                      <span>Ngày đăng ký: {r.date}</span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Môn: <strong>{r.subject || "—"}</strong>
                    </p>

                    <div className="mt-2 rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">
                        <strong>Ghi chú:</strong> {r.note}
                      </p>
                    </div>

                    {r.rejectReason && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <div>
                          <p className="text-xs font-semibold text-destructive">Lý do từ chối</p>
                          <p className="mt-0.5 text-xs text-destructive/80">{r.rejectReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl p-0"
                    onClick={() => setDetailId(r.id)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  {r.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl p-0 text-primary"
                        onClick={() => approve(r.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl p-0 text-destructive"
                        onClick={() => setRejectId(r.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              Không có hồ sơ đăng ký phù hợp
            </div>
          )}
        </div>
      </div>

      {/* DETAIL */}
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký</DialogTitle>
          </DialogHeader>

          {detail && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4">
                <img
                  src={detail.avatar}
                  alt={detail.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-foreground">{detail.name}</p>
                  <Badge variant="outline">{roleLabels[detail.role]}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/40 p-3">
                  <Label className="text-[10px] text-muted-foreground">Email</Label>
                  <p className="text-sm text-foreground">{detail.email}</p>
                </div>

                <div className="rounded-xl bg-muted/40 p-3">
                  <Label className="text-[10px] text-muted-foreground">Số điện thoại</Label>
                  <p className="text-sm text-foreground">{detail.phone}</p>
                </div>

                {detail.subject && (
                  <div className="rounded-xl bg-muted/40 p-3">
                    <Label className="text-[10px] text-muted-foreground">Môn học</Label>
                    <p className="text-sm text-foreground">{detail.subject}</p>
                  </div>
                )}

                <div className="rounded-xl bg-muted/40 p-3">
                  <Label className="text-[10px] text-muted-foreground">Ngày đăng ký</Label>
                  <p className="text-sm text-foreground">{detail.date}</p>
                </div>
              </div>

              <div className="rounded-xl bg-muted/40 p-3">
                <Label className="text-[10px] text-muted-foreground">Ghi chú</Label>
                <p className="mt-1 text-sm text-foreground">{detail.note}</p>
              </div>

              {detail.rejectReason && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-xs font-semibold text-destructive">Lý do từ chối</p>
                    <p className="mt-0.5 text-xs text-destructive/80">{detail.rejectReason}</p>
                  </div>
                </div>
              )}

              {detail.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      approve(detail.id);
                      setDetailId(null);
                    }}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Duyệt
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      setDetailId(null);
                      setRejectId(detail.id);
                    }}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REJECT */}
      <Dialog
        open={!!rejectId}
        onOpenChange={() => {
          setRejectId(null);
          setRejectReason("");
        }}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Từ chối đăng ký
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="VD: Thiếu chứng chỉ, thông tin không hợp lệ..."
              className="rounded-xl"
              rows={3}
            />
            <Button
              onClick={reject}
              variant="destructive"
              className="w-full rounded-xl"
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeRegistrations;