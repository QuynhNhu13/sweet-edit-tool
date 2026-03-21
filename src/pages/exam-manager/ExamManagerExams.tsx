import { useExamManager, Exam, ExamStatus, Difficulty, AIMode } from "@/contexts/ExamManagerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, History, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Nháp", variant: "outline" },
  open: { label: "Đang mở", variant: "default" },
  closed: { label: "Đã đóng", variant: "secondary" },
  hidden: { label: "Tạm ẩn", variant: "destructive" },
};

const ExamManagerExams = () => {
  const { exams, addExam, updateExam, deleteExam, toggleExamVisibility } = useExamManager();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [versionExam, setVersionExam] = useState<Exam | null>(null);

  const defaultForm = {
    name: "", subject: "Toán", duration: "90", questionCount: "50", fee: "10000", year: "2025",
    status: "draft" as ExamStatus, aiMode: "auto_generate" as AIMode, difficulty: "medium" as Difficulty,
    aiProctoring: true, startDate: "", endDate: "",
    maxAttemptsPerUser: "3", maxTotalAttempts: "5000",
    scorePerQuestion: "0.2", penaltyForWrong: false, scoreScale: "10" as "10" | "100",
  };
  const [form, setForm] = useState(defaultForm);

  const filtered = exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.name) return;
    addExam({
      id: `ex${Date.now()}`, name: form.name, subject: form.subject, duration: parseInt(form.duration), questionCount: parseInt(form.questionCount),
      fee: parseInt(form.fee), year: parseInt(form.year), status: form.status, visible: false, aiMode: form.aiMode, difficulty: form.difficulty,
      aiProctoring: form.aiProctoring, attempts: 0, revenue: 0, completionRate: 0, aboveAverageRate: 0, createdAt: new Date().toLocaleDateString("vi-VN"),
      startDate: form.startDate || "Chưa đặt", endDate: form.endDate || "Chưa đặt",
      maxAttemptsPerUser: parseInt(form.maxAttemptsPerUser), maxTotalAttempts: parseInt(form.maxTotalAttempts),
      scorePerQuestion: parseFloat(form.scorePerQuestion), penaltyForWrong: form.penaltyForWrong,
      scoreScale: parseInt(form.scoreScale) as 10 | 100,
      versions: [{ version: 1, editedAt: new Date().toLocaleDateString("vi-VN"), editedBy: "Võ Thanh Hùng", changes: "Tạo đề thi mới" }],
    });
    setForm(defaultForm);
    setShowCreate(false);
    toast({ title: "Tạo đề thi thành công" });
  };

  const handleEdit = () => {
    if (!editExam) return;
    updateExam(editExam.id, {
      name: form.name, subject: form.subject, duration: parseInt(form.duration), questionCount: parseInt(form.questionCount),
      fee: parseInt(form.fee), year: parseInt(form.year), status: form.status, aiMode: form.aiMode, difficulty: form.difficulty,
      aiProctoring: form.aiProctoring, startDate: form.startDate, endDate: form.endDate,
      maxAttemptsPerUser: parseInt(form.maxAttemptsPerUser), maxTotalAttempts: parseInt(form.maxTotalAttempts),
      scorePerQuestion: parseFloat(form.scorePerQuestion), penaltyForWrong: form.penaltyForWrong,
      scoreScale: parseInt(form.scoreScale) as 10 | 100,
    });
    setEditExam(null);
    toast({ title: "Cập nhật đề thi thành công" });
  };

  const openEdit = (e: Exam) => {
    setForm({
      name: e.name, subject: e.subject, duration: String(e.duration), questionCount: String(e.questionCount),
      fee: String(e.fee), year: String(e.year), status: e.status, aiMode: e.aiMode, difficulty: e.difficulty,
      aiProctoring: e.aiProctoring, startDate: e.startDate, endDate: e.endDate,
      maxAttemptsPerUser: String(e.maxAttemptsPerUser), maxTotalAttempts: String(e.maxTotalAttempts),
      scorePerQuestion: String(e.scorePerQuestion), penaltyForWrong: e.penaltyForWrong,
      scoreScale: String(e.scoreScale) as "10" | "100",
    });
    setEditExam(e);
  };

  const handleDelete = () => {
    if (deleteConfirm) { deleteExam(deleteConfirm); setDeleteConfirm(null); toast({ title: "Đã xóa đề thi", variant: "destructive" }); }
  };

  const formFields = (
    <div className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto pr-1">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-xl">
          <TabsTrigger value="basic" className="rounded-xl text-xs">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl text-xs">Thời gian & Giới hạn</TabsTrigger>
          <TabsTrigger value="scoring" className="rounded-xl text-xs">Chấm điểm</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div><Label>Tên đề thi</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="VD: Đề thi thử Toán THPT QG 2025" className="rounded-xl mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Môn học</Label>
              <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["Toán","Vật lý","Hóa học","Sinh học","Tiếng Anh","Ngữ văn","Lịch sử","Địa lý"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Năm áp dụng</Label><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="rounded-xl mt-1" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Thời gian (phút)</Label><Input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Số câu hỏi</Label><Input type="number" value={form.questionCount} onChange={e => setForm(p => ({ ...p, questionCount: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Phí thi (đ)</Label><Input type="number" value={form.fee} onChange={e => setForm(p => ({ ...p, fee: e.target.value }))} className="rounded-xl mt-1" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Trạng thái</Label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as ExamStatus }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem><SelectItem value="open">Đang mở</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem><SelectItem value="hidden">Tạm ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Chế độ AI</Label>
              <Select value={form.aiMode} onValueChange={v => setForm(p => ({ ...p, aiMode: v as AIMode }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="auto_generate">Tự động</SelectItem><SelectItem value="fixed_set">Bộ cố định</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Độ khó</Label>
              <Select value={form.difficulty} onValueChange={v => setForm(p => ({ ...p, difficulty: v as Difficulty }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="easy">Dễ</SelectItem><SelectItem value="medium">Trung bình</SelectItem><SelectItem value="hard">Khó</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div><p className="text-sm font-medium text-foreground">AI Proctoring</p><p className="text-xs text-muted-foreground">Giám sát chống gian lận</p></div>
            <Switch checked={form.aiProctoring} onCheckedChange={v => setForm(p => ({ ...p, aiProctoring: v }))} />
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Ngày mở đề</Label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Ngày đóng đề</Label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="rounded-xl mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Giới hạn lượt/user</Label><Input type="number" value={form.maxAttemptsPerUser} onChange={e => setForm(p => ({ ...p, maxAttemptsPerUser: e.target.value }))} className="rounded-xl mt-1" /><p className="text-[10px] text-muted-foreground mt-1">Số lần tối đa mỗi user được thi</p></div>
            <div><Label>Tổng lượt thi tối đa</Label><Input type="number" value={form.maxTotalAttempts} onChange={e => setForm(p => ({ ...p, maxTotalAttempts: e.target.value }))} className="rounded-xl mt-1" /><p className="text-[10px] text-muted-foreground mt-1">Đóng đề khi đạt giới hạn</p></div>
          </div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Điểm mỗi câu</Label><Input type="number" step="0.01" value={form.scorePerQuestion} onChange={e => setForm(p => ({ ...p, scorePerQuestion: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Thang điểm</Label>
              <Select value={form.scoreScale} onValueChange={v => setForm(p => ({ ...p, scoreScale: v as "10" | "100" }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="10">Thang 10</SelectItem><SelectItem value="100">Thang 100</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div><p className="text-sm font-medium text-foreground">Trừ điểm câu sai</p><p className="text-xs text-muted-foreground">Trừ 1/4 điểm mỗi câu trả lời sai</p></div>
            <Switch checked={form.penaltyForWrong} onCheckedChange={v => setForm(p => ({ ...p, penaltyForWrong: v }))} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Tìm kiếm đề thi..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 h-9 text-sm rounded-xl" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem><SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="open">Đang mở</SelectItem><SelectItem value="closed">Đã đóng</SelectItem>
              <SelectItem value="hidden">Tạm ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Tạo đề thi mới</Button></DialogTrigger>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Tạo đề thi mới</DialogTitle></DialogHeader>{formFields}<Button onClick={handleCreate} className="w-full rounded-xl mt-2">Tạo đề thi</Button></DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Đề thi</TableHead><TableHead>Môn</TableHead><TableHead>Thời gian</TableHead><TableHead>Câu hỏi</TableHead><TableHead>Phí</TableHead><TableHead>Lượt thi</TableHead><TableHead>Trạng thái</TableHead><TableHead>Hiển thị</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell>
                    <p className="font-medium text-foreground text-sm">{e.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-muted-foreground">{e.createdAt}</p>
                      {e.startDate && <p className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {e.startDate} - {e.endDate}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.subject}</TableCell>
                  <TableCell className="text-sm">{e.duration} phút</TableCell>
                  <TableCell className="text-sm">{e.questionCount}</TableCell>
                  <TableCell className="text-sm">{e.fee.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{e.attempts.toLocaleString("vi-VN")}</p>
                    <p className="text-[10px] text-muted-foreground">/{e.maxTotalAttempts.toLocaleString("vi-VN")}</p>
                  </TableCell>
                  <TableCell><Badge variant={statusConfig[e.status]?.variant || "outline"}>{statusConfig[e.status]?.label || e.status}</Badge></TableCell>
                  <TableCell>
                    <button onClick={() => toggleExamVisibility(e.id)} className="p-1 rounded hover:bg-muted">
                      {e.visible ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(e)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setVersionExam(e)}><History className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteConfirm(e.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editExam} onOpenChange={() => setEditExam(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Chỉnh sửa đề thi</DialogTitle></DialogHeader>{formFields}<Button onClick={handleEdit} className="w-full rounded-xl mt-2">Lưu thay đổi</Button></DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent><DialogHeader><DialogTitle>Xác nhận xóa đề thi?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa.</p>
          <div className="flex gap-2 mt-4"><Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl">Hủy</Button><Button variant="destructive" onClick={handleDelete} className="flex-1 rounded-xl">Xóa đề thi</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!versionExam} onOpenChange={() => setVersionExam(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Lịch sử chỉnh sửa</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {versionExam?.versions.map(v => (
              <div key={v.version} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">v{v.version}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Phiên bản {v.version}</p>
                  <p className="text-xs text-muted-foreground">{v.editedBy} • {v.editedAt}</p>
                  <p className="text-xs text-muted-foreground mt-1">Thay đổi: {v.changes}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamManagerExams;
