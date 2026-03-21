import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, BookOpen, Users, Search as SearchIcon, Calendar, Eye, Clock, MapPin, FileText } from "lucide-react";
import type { AdminClass, ClassStatus, ClassFormat } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const statusLabel: Record<string, string> = { searching: "Đang tìm", active: "Đang học", completed: "Hoàn thành" };
const statusColor: Record<string, string> = {
  searching: "bg-warning/150/10 text-warning",
  active: "bg-success/150/10 text-success",
  completed: "bg-primary/10 text-primary",
};
const formatColor: Record<string, string> = {
  online: "bg-primary/10 text-primary",
  offline: "bg-muted text-foreground",
  hybrid: "bg-secondary/20 text-secondary-foreground",
};

const emptyForm = { name: "", studentId: "", tutorId: "", format: "online" as ClassFormat, fee: 0, status: "searching" as ClassStatus, subject: "", schedule: "", totalSessions: 0, completedSessions: 0, notes: "" };

const AdminClasses = () => {
  const { classes, users, addClass, updateClass, deleteClass, addTransaction } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detailClass, setDetailClass] = useState<AdminClass | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilterVal, setStatusFilterVal] = useState("all");
  const [formatFilterVal, setFormatFilterVal] = useState("all");
  const [period, setPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;

  const parseDate = (value: string) => new Date(value);

  const byPeriod = (createdAt: string) => {
    const date = parseDate(createdAt);
    if (Number.isNaN(date.getTime())) return false;
    if (period === "month") return date.getMonth() + 1 === Number(selectedMonth) && date.getFullYear() === Number(selectedYear);
    if (period === "year") return date.getFullYear() === Number(selectedYear);
    if (period === "custom") {
      if (!fromDate || !toDate) return true;
      return date >= new Date(fromDate) && date <= new Date(toDate);
    }
    return true;
  };

  const filtered = classes.filter(c => {
    if (statusFilterVal !== "all" && c.status !== statusFilterVal) return false;
    if (formatFilterVal !== "all" && c.format !== formatFilterVal) return false;
    if (!byPeriod(c.createdAt)) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const students = users.filter(u => u.role === "student" && u.status === "approved");
  const tutors = users.filter(u => (u.role === "tutor" || u.role === "teacher") && u.status === "approved");
  const activeClasses = classes.filter(c => c.status === "active").length;
  const searchingClasses = classes.filter(c => c.status === "searching").length;

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (c: AdminClass) => { setForm({ name: c.name, studentId: c.studentId, tutorId: c.tutorId, format: c.format, fee: c.fee, status: c.status, subject: c.subject, schedule: c.schedule || "", totalSessions: c.totalSessions || 0, completedSessions: c.completedSessions || 0, notes: c.notes || "" }); setEditId(c.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.studentId || !form.tutorId) { toast({ title: "Vui lòng điền đầy đủ", variant: "destructive" }); return; }
    if (editId) {
      updateClass(editId, form);
      toast({ title: "Đã cập nhật lớp học" });
    } else {
      addClass(form);
      if (form.fee > 0) {
        addTransaction({ userId: form.studentId, type: "tuition", amount: form.fee, date: new Date().toISOString().slice(0, 10), status: "pending", description: `Học phí ${form.name}` });
      }
      toast({ title: "Đã tạo lớp học" });
    }
    setShowForm(false);
  };

  const handleDelete = (c: AdminClass) => { deleteClass(c.id); toast({ title: `Đã xóa ${c.name}`, variant: "destructive" }); };
  const handleStatusChange = (id: string, status: string) => { updateClass(id, { status: status as ClassStatus }); };
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "—";
  const getUserAvatar = (id: string) => users.find(u => u.id === id)?.avatar;

  const stats = [
    { label: "Tổng lớp", value: classes.length, icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Đang hoạt động", value: activeClasses, icon: Users, color: "bg-success/150/10 text-success" },
    { label: "Đang tìm gia sư", value: searchingClasses, icon: SearchIcon, color: "bg-warning/150/10 text-warning" },
    { label: "Buổi học tháng này", value: activeClasses * 8, icon: Calendar, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters + Action */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên lớp, môn học..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl bg-card border-border"
          />
        </div>
        <Select value={statusFilterVal} onValueChange={setStatusFilterVal}>
          <SelectTrigger className="w-full md:w-48 h-11 rounded-2xl bg-card border-border">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="searching">Đang tìm</SelectItem>
            <SelectItem value="active">Đang học</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formatFilterVal} onValueChange={setFormatFilterVal}>
          <SelectTrigger className="w-full md:w-44 h-11 rounded-2xl bg-card border-border">
            <SelectValue placeholder="Hình thức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hình thức</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={(v) => { setPeriod(v); setPage(1); }}>
          <SelectTrigger className="w-full md:w-40 h-11 rounded-2xl bg-card border-border">
            <SelectValue placeholder="Khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Theo tháng</SelectItem>
            <SelectItem value="year">Theo năm</SelectItem>
            <SelectItem value="custom">Khoảng tùy chọn</SelectItem>
          </SelectContent>
        </Select>
        {period === "month" && (
          <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-32 h-11 rounded-2xl bg-card border-border"><SelectValue placeholder="Tháng" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, "0");
                return <SelectItem key={month} value={month}>Tháng {i + 1}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        )}
        {(period === "month" || period === "year") && (
          <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-28 h-11 rounded-2xl bg-card border-border"><SelectValue placeholder="Năm" /></SelectTrigger>
            <SelectContent>
              {["2024", "2025", "2026", "2027"].map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {period === "custom" && (
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="h-11 rounded-2xl" />
            <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="h-11 rounded-2xl" />
          </div>
        )}
        <Button className="rounded-xl h-11" onClick={openCreate}><Plus className="w-4 h-4 mr-1.5" /> Tạo lớp mới</Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Tên lớp</TableHead>
                <TableHead className="font-semibold">Học sinh</TableHead>
                <TableHead className="font-semibold">Gia sư</TableHead>
                <TableHead className="font-semibold">Hình thức</TableHead>
                <TableHead className="font-semibold">Học phí</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="text-right font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(c => (
                <TableRow key={c.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-sm">{getUserName(c.studentId)}</TableCell>
                  <TableCell className="text-sm">{getUserName(c.tutorId)}</TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${formatColor[c.format]}`}>
                      {c.format.charAt(0).toUpperCase() + c.format.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{c.fee.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={v => handleStatusChange(c.id, v)}>
                      <SelectTrigger className={`w-28 h-7 text-[11px] rounded-full border-0 font-medium ${statusColor[c.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="searching">Đang tìm</SelectItem>
                        <SelectItem value="active">Đang học</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setDetailClass(c)} title="Xem chi tiết"><Eye className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEdit(c)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(c)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editId ? "Sửa lớp học" : "Tạo lớp học mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tên lớp</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Môn</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-xl mt-1.5" /></div>
              <div><Label>Lịch học</Label><Input value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} className="rounded-xl mt-1.5" placeholder="VD: T2, T4 - 19:00" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Học sinh</Label>
                <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gia sư / GV</Label>
                <Select value={form.tutorId} onValueChange={v => setForm(f => ({ ...f, tutorId: v }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>{tutors.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Hình thức</Label>
                <Select value={form.format} onValueChange={v => setForm(f => ({ ...f, format: v as ClassFormat }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Học phí (VNĐ)</Label><Input type="number" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))} className="rounded-xl mt-1.5" /></div>
              <div><Label>Tổng buổi</Label><Input type="number" value={form.totalSessions} onChange={e => setForm(f => ({ ...f, totalSessions: Number(e.target.value) }))} className="rounded-xl mt-1.5" /></div>
            </div>
            <div><Label>Ghi chú</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            <Button className="w-full rounded-xl" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo lớp"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailClass} onOpenChange={() => setDetailClass(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết lớp học</DialogTitle></DialogHeader>
          {detailClass && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{detailClass.name}</h3>
                  <p className="text-sm text-muted-foreground">{detailClass.subject}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColor[detailClass.status]}`}>
                  {statusLabel[detailClass.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Học sinh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getUserAvatar(detailClass.studentId) && <img src={getUserAvatar(detailClass.studentId)} className="w-8 h-8 rounded-lg object-cover" />}
                    <span className="text-sm font-medium text-foreground">{getUserName(detailClass.studentId)}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">Gia sư</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getUserAvatar(detailClass.tutorId) && <img src={getUserAvatar(detailClass.tutorId)} className="w-8 h-8 rounded-lg object-cover" />}
                    <span className="text-sm font-medium text-foreground">{getUserName(detailClass.tutorId)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs mb-1">Hình thức</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${formatColor[detailClass.format]}`}>
                    {detailClass.format.charAt(0).toUpperCase() + detailClass.format.slice(1)}
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs mb-1">Học phí</span>
                  <span className="text-foreground font-semibold">{detailClass.fee.toLocaleString("vi-VN")}đ/tháng</span>
                </div>
                {detailClass.schedule && (
                  <div className="bg-muted/50 p-3 rounded-xl col-span-2">
                    <div className="flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground text-xs">Lịch học</span></div>
                    <span className="text-foreground">{detailClass.schedule}</span>
                  </div>
                )}
                {detailClass.totalSessions && detailClass.totalSessions > 0 && (
                  <div className="bg-muted/50 p-3 rounded-xl col-span-2">
                    <span className="text-muted-foreground block text-xs mb-2">Tiến độ buổi học</span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((detailClass.completedSessions || 0) / detailClass.totalSessions) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{detailClass.completedSessions || 0}/{detailClass.totalSessions}</span>
                    </div>
                  </div>
                )}
                <div className="bg-muted/50 p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs mb-1">Ngày tạo</span>
                  <span className="text-foreground">{detailClass.createdAt}</span>
                </div>
              </div>

              {detailClass.notes && (
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1"><FileText className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground text-xs">Ghi chú</span></div>
                  <p className="text-sm text-foreground">{detailClass.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClasses;
