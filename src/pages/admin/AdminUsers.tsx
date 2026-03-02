import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Search, Edit, Star } from "lucide-react";
import type { AdminUser, UserStatus } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleTabs = [
  { value: "all", label: "Tất cả" },
  { value: "tutor", label: "Gia sư" },
  { value: "teacher", label: "Giáo viên" },
  { value: "student", label: "Học sinh" },
  { value: "parent", label: "Phụ huynh" },
];

const statusLabel: Record<string, string> = { pending: "Chờ duyệt", approved: "Hoạt động", rejected: "Từ chối", suspended: "Tạm khóa" };
const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
  suspended: "bg-muted text-muted-foreground",
};
const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh", admin: "Admin" };

const ITEMS_PER_PAGE = 8;

const AdminUsers = () => {
  const { users, updateUserStatus, deleteUser } = useAdmin();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const filtered = users.filter(u => {
    if (tab !== "all" && u.role !== tab) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

  return (
    <div className="p-6 space-y-5">
      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="pl-10 h-11 rounded-2xl bg-card border-border"
        />
      </div>

      {/* Role tabs */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl w-fit">
        {roleTabs.map(r => (
          <button
            key={r.value}
            onClick={() => { setTab(r.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === r.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

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
                  <TableCell>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/5 text-primary">
                      {roleLabel[u.role] || u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {u.subject ? (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">{u.subject}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(u.role === "tutor" || u.role === "teacher") ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-foreground">4.{Math.floor(Math.random() * 5) + 5}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={u.status} onValueChange={v => handleStatusChange(u.id, v)}>
                      <SelectTrigger className={`w-28 h-7 text-[11px] rounded-full border-0 font-medium ${statusColor[u.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
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
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setDetail(u)}>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(u)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
          <p className="text-sm text-muted-foreground">
            Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
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
                <img src={detail.avatar} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-lg text-foreground">{detail.name}</p>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">{roleLabel[detail.role]}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Email</span><span className="text-foreground">{detail.email}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">SĐT</span><span className="text-foreground">{detail.phone}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Trạng thái</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[detail.status]}`}>{statusLabel[detail.status]}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Ngày tạo</span><span className="text-foreground">{detail.createdAt}</span></div>
                {detail.subject && <div className="bg-muted/50 p-3 rounded-xl col-span-2"><span className="text-muted-foreground block text-xs mb-1">Môn</span><span className="text-foreground">{detail.subject}</span></div>}
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
