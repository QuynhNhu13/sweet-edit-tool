import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Eye, Search } from "lucide-react";
import type { AdminTest, TestType, TestStatus } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-amber-500/10 text-amber-600",
  archived: "bg-muted text-muted-foreground",
};
const statusLabel: Record<string, string> = { active: "Hoạt động", draft: "Bản nháp", archived: "Đã lưu trữ" };

const emptyForm = { code: "", name: "", subject: "", level: "", type: "multiple-choice" as TestType, status: "draft" as TestStatus };

const AdminTests = () => {
  const { tests, addTest, updateTest, deleteTest } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const filtered = tests.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setForm({ ...emptyForm, code: `T${String(tests.length + 1).padStart(3, "0")}` }); setEditId(null); setShowForm(true); };
  const openEdit = (t: AdminTest) => { setForm({ code: t.code, name: t.name, subject: t.subject, level: t.level, type: t.type, status: t.status }); setEditId(t.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.code) { toast({ title: "Vui lòng điền đầy đủ", variant: "destructive" }); return; }
    if (editId) {
      updateTest(editId, form);
      toast({ title: "Đã cập nhật bài test" });
    } else {
      addTest(form);
      toast({ title: "Đã tạo bài test" });
    }
    setShowForm(false);
  };

  const handleDelete = (t: AdminTest) => { deleteTest(t.id); toast({ title: `Đã xóa ${t.code}`, variant: "destructive" }); };
  const handleStatusChange = (id: string, status: string) => { updateTest(id, { status: status as TestStatus }); };

  return (
    <div className="p-6 space-y-5">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm bài test..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card border-border"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 h-10 rounded-xl">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="archived">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="rounded-xl" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Tạo bài test mới
        </Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Mã</TableHead>
                <TableHead className="font-semibold">Tên bài test</TableHead>
                <TableHead className="font-semibold">Môn / Cấp độ</TableHead>
                <TableHead className="font-semibold">Loại hình</TableHead>
                <TableHead className="font-semibold">Lượt thi</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="text-right font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">{t.code}</TableCell>
                  <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-foreground">{t.subject}</span>
                      <span className="text-muted-foreground"> · {t.level}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-foreground">
                      {t.type === "multiple-choice" ? "Trắc nghiệm" : "Tự luận"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-foreground">{t.attempts}</TableCell>
                  <TableCell>
                    <Select value={t.status} onValueChange={v => handleStatusChange(t.id, v)}>
                      <SelectTrigger className={`w-28 h-7 text-[11px] rounded-full border-0 font-medium ${statusColor[t.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="archived">Đã lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEdit(t)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(t)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">Không tìm thấy bài test</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editId ? "Sửa bài test" : "Tạo bài test mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Mã bài test</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="rounded-xl mt-1.5" /></div>
              <div><Label>Môn</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            </div>
            <div><Label>Tên bài test</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cấp độ</Label><Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="rounded-xl mt-1.5" /></div>
              <div>
                <Label>Loại hình</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as TestType }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                    <SelectItem value="essay">Tự luận</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo bài test"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTests;
