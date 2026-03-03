import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Eye, Search, CheckCircle, XCircle } from "lucide-react";
import type { AdminTest, TestType, TestStatus, TestQuestion } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
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
  const [viewingTest, setViewingTest] = useState<AdminTest | null>(null);
  const { toast } = useToast();

  const filtered = tests.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setForm({ ...emptyForm, code: `T${String(tests.length + 1).padStart(3, "0")}` }); setEditId(null); setShowForm(true); };
  const openEdit = (t: AdminTest) => { setForm({ code: t.code, name: t.name, subject: t.subject, level: t.level, type: t.type, status: t.status }); setEditId(t.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.code || !form.subject) { toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" }); return; }
    if (editId) {
      updateTest(editId, form);
      toast({ title: "Đã cập nhật bài test" });
    } else {
      addTest(form);
      toast({ title: `Đã tạo bài test "${form.name}" với 10 câu hỏi tự động` });
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
            <Input placeholder="Tìm bài test..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl bg-card border-border" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 h-10 rounded-xl"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="archived">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="rounded-xl" onClick={openCreate}><Plus className="w-4 h-4 mr-1.5" /> Tạo bài test mới</Button>
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
                <TableHead className="font-semibold">Câu hỏi</TableHead>
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
                  <TableCell><div className="text-sm"><span className="text-foreground">{t.subject}</span><span className="text-muted-foreground"> · {t.level}</span></div></TableCell>
                  <TableCell><span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-foreground">{t.type === "multiple-choice" ? "Trắc nghiệm" : "Tự luận"}</span></TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{t.questions.length}</TableCell>
                  <TableCell className="text-sm font-semibold text-foreground">{t.attempts}</TableCell>
                  <TableCell>
                    <Select value={t.status} onValueChange={v => handleStatusChange(t.id, v)}>
                      <SelectTrigger className={`w-28 h-7 text-[11px] rounded-full border-0 font-medium ${statusColor[t.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="archived">Đã lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" title="Xem câu hỏi" onClick={() => setViewingTest(t)}><Eye className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEdit(t)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(t)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-12">Không tìm thấy bài test</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editId ? "Sửa bài test" : "Tạo bài test mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Mã bài test</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="rounded-xl mt-1.5" /></div>
              <div><Label>Môn</Label>
                <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue placeholder="Chọn môn" /></SelectTrigger>
                  <SelectContent>{["Toán", "Văn", "Anh", "Lý", "Hóa", "Sinh"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Tên bài test</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cấp độ</Label><Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="rounded-xl mt-1.5" placeholder="VD: Lớp 12, IELTS..." /></div>
              <div><Label>Loại hình</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as TestType }))}>
                  <SelectTrigger className="rounded-xl mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                    <SelectItem value="essay">Tự luận</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editId && (
              <div className="bg-muted/50 p-3 rounded-xl">
                <p className="text-xs text-muted-foreground">Hệ thống sẽ tự động tạo 10 câu hỏi theo môn học đã chọn. Bạn có thể chỉnh sửa sau khi tạo.</p>
              </div>
            )}
            <Button className="w-full rounded-xl" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo bài test"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Questions Dialog */}
      <Dialog open={!!viewingTest} onOpenChange={() => setViewingTest(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewingTest?.name} — {viewingTest?.questions.length} câu hỏi</DialogTitle></DialogHeader>
          {viewingTest && (
            <div className="space-y-4">
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">{viewingTest.subject}</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">{viewingTest.level}</span>
                <span className={`px-2.5 py-1 rounded-full font-medium ${statusColor[viewingTest.status]}`}>{statusLabel[viewingTest.status]}</span>
              </div>
              <div className="space-y-4">
                {viewingTest.questions.map((q, idx) => (
                  <div key={q.id} className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground mb-3">
                      <span className="text-primary font-bold mr-2">Câu {idx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${oi === q.correctAnswer ? "bg-primary/10 text-primary font-medium" : "bg-card text-foreground"}`}>
                          {oi === q.correctAnswer ? <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />}
                          <span className="text-xs font-semibold text-muted-foreground mr-1">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTests;
