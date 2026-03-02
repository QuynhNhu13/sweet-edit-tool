import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, BookOpen, Users, Search as SearchIcon, Calendar } from "lucide-react";
import type { AdminClass, ClassStatus, ClassFormat } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<string, string> = { searching: "Đang tìm", active: "Đang học", completed: "Hoàn thành" };
const statusColor: Record<string, string> = {
  searching: "bg-amber-500/10 text-amber-600",
  active: "bg-emerald-500/10 text-emerald-600",
  completed: "bg-primary/10 text-primary",
};
const formatColor: Record<string, string> = {
  online: "bg-primary/10 text-primary",
  offline: "bg-muted text-foreground",
  hybrid: "bg-secondary/20 text-secondary-foreground",
};

const emptyForm = { name: "", studentId: "", tutorId: "", format: "online" as ClassFormat, fee: 0, status: "searching" as ClassStatus, subject: "" };

const AdminClasses = () => {
  const { classes, users, addClass, updateClass, deleteClass, addTransaction } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const students = users.filter(u => u.role === "student" && u.status === "approved");
  const tutors = users.filter(u => (u.role === "tutor" || u.role === "teacher") && u.status === "approved");
  const activeClasses = classes.filter(c => c.status === "active").length;
  const searchingClasses = classes.filter(c => c.status === "searching").length;

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (c: AdminClass) => { setForm({ name: c.name, studentId: c.studentId, tutorId: c.tutorId, format: c.format, fee: c.fee, status: c.status, subject: c.subject }); setEditId(c.id); setShowForm(true); };

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

  const stats = [
    { label: "Tổng lớp", value: classes.length, icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Đang hoạt động", value: activeClasses, icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Đang tìm gia sư", value: searchingClasses, icon: SearchIcon, color: "bg-amber-500/10 text-amber-600" },
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

      {/* Action bar */}
      <div className="flex items-center justify-end">
        <Button className="rounded-xl" onClick={openCreate}><Plus className="w-4 h-4 mr-1.5" /> Tạo lớp mới</Button>
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
              {classes.map(c => (
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editId ? "Sửa lớp học" : "Tạo lớp học mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tên lớp</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            <div><Label>Môn</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-xl mt-1.5" /></div>
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
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo lớp"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClasses;
