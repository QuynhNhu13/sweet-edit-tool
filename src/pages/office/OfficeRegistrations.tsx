import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, CheckCircle2, XCircle, Eye, Search, Users, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

const roleLabels: Record<string, string> = { student: "Học sinh", tutor: "Gia sư", teacher: "Giáo viên", parent: "Phụ huynh" };
const roleColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-700",
  tutor: "bg-emerald-500/10 text-emerald-700",
  teacher: "bg-purple-500/10 text-purple-700",
  parent: "bg-amber-500/10 text-amber-700",
};

const statusCfg: Record<string, { label: string; variant: "default" | "destructive" | "outline" }> = {
  pending: { label: "Chờ duyệt", variant: "outline" },
  approved: { label: "Đã duyệt", variant: "default" },
  rejected: { label: "Từ chối", variant: "destructive" },
};

const initialData: Registration[] = [
  { id: "r1", name: "Phạm Văn Hùng", avatar: avatarMale1, role: "tutor", email: "hung.pv@gmail.com", phone: "0912345678", subject: "Toán, Lý", note: "5 năm kinh nghiệm gia sư, tốt nghiệp ĐH Bách Khoa", date: "03/03/2026", status: "pending" },
  { id: "r2", name: "Nguyễn Thị Hoa", avatar: avatarFemale1, role: "teacher", email: "hoa.nt@gmail.com", phone: "0987654321", subject: "Văn, Sử", note: "Giáo viên THPT 8 năm, chứng chỉ B2", date: "02/03/2026", status: "pending" },
  { id: "r3", name: "Trần Đức Anh", avatar: avatarMale2, role: "student", email: "anh.td@gmail.com", phone: "0901234567", subject: "Toán 12", note: "Học sinh lớp 12, cần ôn thi ĐH", date: "01/03/2026", status: "pending" },
  { id: "r4", name: "Lê Thị Mai", avatar: avatarFemale2, role: "parent", email: "mai.lt@gmail.com", phone: "0934567890", note: "Phụ huynh 2 con, lớp 10 và lớp 12", date: "28/02/2026", status: "approved" },
  { id: "r5", name: "Võ Quang Hải", avatar: avatarMale3, role: "tutor", email: "hai.vq@gmail.com", phone: "0978901234", subject: "IELTS", note: "IELTS 8.0, 3 năm dạy IELTS", date: "27/02/2026", status: "approved" },
  { id: "r6", name: "Đinh Thị Ngọc", avatar: avatarFemale3, role: "student", email: "ngoc.dt@gmail.com", phone: "0945678901", subject: "Hóa 11", note: "Cần bổ sung kiến thức Hóa", date: "25/02/2026", status: "rejected", rejectReason: "Thiếu thông tin liên hệ phụ huynh" },
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
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || r.role === roleFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const detail = regs.find(r => r.id === detailId);
  const pendingCount = regs.filter(r => r.status === "pending").length;

  const approve = (id: string) => {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as const } : r));
    toast({ title: "Đã duyệt đăng ký" });
  };

  const reject = () => {
    if (rejectId && rejectReason.trim()) {
      setRegs(prev => prev.map(r => r.id === rejectId ? { ...r, status: "rejected" as const, rejectReason } : r));
      toast({ title: "Đã từ chối đăng ký", variant: "destructive" });
      setRejectId(null);
      setRejectReason("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><UserPlus className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{pendingCount}</p><p className="text-xs text-muted-foreground">Chờ duyệt</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{regs.filter(r => r.role === "tutor" || r.role === "teacher").length}</p><p className="text-xs text-muted-foreground">GS/GV đăng ký</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{regs.filter(r => r.role === "student").length}</p><p className="text-xs text-muted-foreground">HS đăng ký</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Users className="w-5 h-5 text-purple-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{regs.filter(r => r.status === "approved").length}</p><p className="text-xs text-muted-foreground">Đã duyệt</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên, email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm rounded-xl" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="tutor">Gia sư</SelectItem>
            <SelectItem value="teacher">Giáo viên</SelectItem>
            <SelectItem value="student">Học sinh</SelectItem>
            <SelectItem value="parent">Phụ huynh</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Người đăng ký</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Môn</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${roleColors[r.role]}`}>{roleLabels[r.role]}</Badge></TableCell>
                  <TableCell><p className="text-xs text-foreground">{r.email}</p><p className="text-[10px] text-muted-foreground">{r.phone}</p></TableCell>
                  <TableCell className="text-sm">{r.subject || "—"}</TableCell>
                  <TableCell className="text-sm">{r.date}</TableCell>
                  <TableCell><Badge variant={statusCfg[r.status].variant}>{statusCfg[r.status].label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailId(r.id)}><Eye className="w-3.5 h-3.5" /></Button>
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-600" onClick={() => approve(r.id)}><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setRejectId(r.id)}><XCircle className="w-3.5 h-3.5" /></Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail */}
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết đăng ký</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <img src={detail.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="text-base font-semibold text-foreground">{detail.name}</p>
                  <Badge variant="outline" className={roleColors[detail.role]}>{roleLabels[detail.role]}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Email</Label><p className="text-sm text-foreground">{detail.email}</p></div>
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Số điện thoại</Label><p className="text-sm text-foreground">{detail.phone}</p></div>
                {detail.subject && <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Môn học</Label><p className="text-sm text-foreground">{detail.subject}</p></div>}
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Ngày đăng ký</Label><p className="text-sm text-foreground">{detail.date}</p></div>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Ghi chú</Label><p className="text-sm text-foreground mt-1">{detail.note}</p></div>
              {detail.rejectReason && (
                <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
                  <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div><p className="text-xs font-semibold text-destructive">Lý do từ chối</p><p className="text-xs text-destructive/80 mt-0.5">{detail.rejectReason}</p></div>
                </div>
              )}
              {detail.status === "pending" && (
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-xl" onClick={() => { approve(detail.id); setDetailId(null); }}><CheckCircle2 className="w-4 h-4 mr-1" /> Duyệt</Button>
                  <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => { setDetailId(null); setRejectId(detail.id); }}><XCircle className="w-4 h-4 mr-1" /> Từ chối</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog open={!!rejectId} onOpenChange={() => { setRejectId(null); setRejectReason(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Từ chối đăng ký</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="VD: Thiếu chứng chỉ, thông tin không hợp lệ..." className="rounded-xl" rows={3} />
            <Button onClick={reject} variant="destructive" className="w-full rounded-xl" disabled={!rejectReason.trim()}>Xác nhận từ chối</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeRegistrations;
