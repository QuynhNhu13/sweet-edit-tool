import { useAdmin } from "@/contexts/AdminContext";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Search, Star, Users, UserCheck, GraduationCap, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import type { AdminUser, UserStatus } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleTabs = [
  { value: "all", label: "Tất cả", icon: Users },
  { value: "tutor", label: "Gia sư", icon: GraduationCap },
  { value: "teacher", label: "Giáo viên", icon: UserCheck },
  { value: "student", label: "Học sinh", icon: UserPlus },
  { value: "parent", label: "Phụ huynh", icon: Users },
];

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Hoạt động" },
  { value: "rejected", label: "Từ chối" },
  { value: "suspended", label: "Tạm khóa" },
];

const statusLabel: Record<string, string> = { pending: "Chờ duyệt", approved: "Hoạt động", rejected: "Từ chối", suspended: "Tạm khóa" };
const statusColor: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  suspended: "bg-muted text-muted-foreground",
};
const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh", admin: "Admin" };

const ITEMS_PER_PAGE = 8;

const AdminUsers = () => {
  const { users, updateUserStatus, deleteUser } = useAdmin();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const filtered = useMemo(() => users.filter(u => {
    if (tab !== "all" && u.role !== tab) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [users, tab, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (u: AdminUser) => {
    deleteUser(u.id);
    toast({ title: `Đã xóa ${u.name}`, variant: "destructive" });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateUserStatus(id, status as UserStatus);
    toast({ title: "Đã cập nhật trạng thái" });
  };

  const resetFilters = () => {
    setTab("all"); setSearch(""); setStatusFilter("all"); setPage(1);
  };

  const stats = useMemo(() => ({
    total: users.length,
    tutors: users.filter(u => u.role === "tutor" || u.role === "teacher").length,
    students: users.filter(u => u.role === "student").length,
    pending: users.filter(u => u.status === "pending").length,
  }), [users]);

  const pendingApprovals = users.filter(u => u.status === "pending");

  return (
    <div className="p-6 space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng người dùng", value: stats.total, icon: Users },
          { label: "Gia sư & Giáo viên", value: stats.tutors, icon: GraduationCap },
          { label: "Học sinh", value: stats.students, icon: UserPlus },
          { label: "Chờ duyệt", value: stats.pending, icon: UserCheck },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-soft">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className="w-5 h-5 text-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên, email hoặc môn..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10 h-11 rounded-2xl bg-card border-border" />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full md:w-48 h-11 rounded-2xl bg-card border-border"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
          <SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        {(search || statusFilter !== "all" || tab !== "all") && (
          <Button variant="outline" onClick={resetFilters} className="h-11 rounded-2xl">Xóa lọc</Button>
        )}
      </div>

      {/* Role tabs */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl w-fit">
        {roleTabs.map(r => (
          <button key={r.value} onClick={() => { setTab(r.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${tab === r.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <r.icon className="w-3.5 h-3.5" />
            {r.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">Tìm thấy <span className="font-semibold text-foreground">{filtered.length}</span> người dùng</p>

      <Card className="border-0 shadow-soft">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Yêu cầu phê duyệt ({pendingApprovals.length})</h3>
          </div>
          {pendingApprovals.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có yêu cầu chờ duyệt.</p>
          ) : (
            <div className="space-y-2">
              {pendingApprovals.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{roleLabel[u.role] || u.role} · {u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleStatusChange(u.id, "approved")} className="rounded-lg h-8"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Duyệt</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(u.id, "rejected")} className="rounded-lg h-8"><XCircle className="w-3.5 h-3.5 mr-1" />Từ chối</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Người dùng</TableHead>
                <TableHead className="font-semibold">Vai trò</TableHead>
                <TableHead className="font-semibold">Môn dạy</TableHead>
                <TableHead className="font-semibold">Đánh giá</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="text-right font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(u => (
                <TableRow key={u.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-foreground">{roleLabel[u.role] || u.role}</span></TableCell>
                  <TableCell>{u.subject ? <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">{u.subject}</span> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    {(u.role === "tutor" || u.role === "teacher") ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                        <span className="text-sm font-medium text-foreground">4.{Math.floor(Math.random() * 5) + 5}</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Select value={u.status} onValueChange={v => handleStatusChange(u.id, v)}>
                      <SelectTrigger className={`w-28 h-7 text-[11px] rounded-full border-0 font-medium ${statusColor[u.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="approved">Hoạt động</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                        <SelectItem value="suspended">Tạm khóa</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setDetail(u)}><Eye className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(u)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">Không tìm thấy người dùng</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Chi tiết người dùng</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={detail.avatar} className="w-16 h-16 rounded-2xl object-cover" alt={detail.name} />
                <div>
                  <p className="font-bold text-lg text-foreground">{detail.name}</p>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">{roleLabel[detail.role]}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Email</span><span className="text-foreground">{detail.email}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">SĐT</span><span className="text-foreground">{detail.phone}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Trạng thái</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[detail.status]}`}>{statusLabel[detail.status]}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Ngày tạo</span><span className="text-foreground">{detail.createdAt}</span></div>
                {detail.subject && <div className="bg-muted/50 p-3 rounded-xl col-span-2"><span className="text-muted-foreground block text-xs mb-1">Môn</span><span className="text-foreground">{detail.subject}</span></div>}
                {detail.school && <div className="bg-muted/50 p-3 rounded-xl col-span-2"><span className="text-muted-foreground block text-xs mb-1">Trường</span><span className="text-foreground">{detail.school}</span></div>}
                {detail.studentId && <div className="bg-muted/50 p-3 rounded-xl col-span-2"><span className="text-muted-foreground block text-xs mb-1">MSSV</span><span className="text-foreground">{detail.studentId}</span></div>}
              </div>
              {detail.bio && <p className="text-sm text-foreground bg-muted/50 p-3 rounded-xl">{detail.bio}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
