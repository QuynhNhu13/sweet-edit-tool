import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang học", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  paused: { label: "Tạm dừng", variant: "outline" },
  searching: { label: "Đang tìm", variant: "destructive" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const OfficeClasses = () => {
  const { classes, addClass } = useOffice();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [newClass, setNewClass] = useState({ name: "", subject: "", fee: "", tutor: "", student: "", schedule: "", totalSessions: "", description: "" });

  const filtered = classes.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.tutor.toLowerCase().includes(search.toLowerCase()) || c.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const detail = classes.find(c => c.id === detailId);

  const handleCreate = () => {
    if (!newClass.name || !newClass.subject) return;
    addClass({
      id: `c${Date.now()}`, name: newClass.name, tutor: newClass.tutor || "Chưa phân công", tutorAvatar: "", student: newClass.student || "Chưa có", studentAvatar: "",
      schedule: newClass.schedule || "Chưa xếp", fee: parseInt(newClass.fee) || 0, status: "searching", subject: newClass.subject,
      totalSessions: parseInt(newClass.totalSessions) || 0, completedSessions: 0,
    });
    setNewClass({ name: "", subject: "", fee: "", tutor: "", student: "", schedule: "", totalSessions: "", description: "" });
    setShowCreate(false);
    toast({ title: "Tạo lớp thành công" });
  };

  const handleCancel = () => {
    if (cancelId && cancelReason) {
      toast({ title: "Đã hủy lớp", description: `Lý do: ${cancelReason}`, variant: "destructive" });
      setCancelId(null); setCancelReason("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Tìm kiếm lớp..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 h-9 text-sm rounded-xl" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem><SelectItem value="active">Đang học</SelectItem><SelectItem value="completed">Hoàn thành</SelectItem><SelectItem value="searching">Đang tìm</SelectItem><SelectItem value="paused">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Tạo lớp mới</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Tạo lớp học mới</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Tên lớp</Label><Input value={newClass.name} onChange={e => setNewClass(p => ({ ...p, name: e.target.value }))} placeholder="VD: Toán 12 - Nâng cao" className="rounded-xl mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Môn học</Label>
                  <Select value={newClass.subject} onValueChange={v => setNewClass(p => ({ ...p, subject: v }))}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Chọn môn" /></SelectTrigger>
                    <SelectContent>{["Toán","Văn","Anh","Lý","Hóa","Sinh","Sử","Địa"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Học phí (VNĐ)</Label><Input type="number" value={newClass.fee} onChange={e => setNewClass(p => ({ ...p, fee: e.target.value }))} placeholder="VD: 2000000" className="rounded-xl mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Gia sư</Label><Input value={newClass.tutor} onChange={e => setNewClass(p => ({ ...p, tutor: e.target.value }))} placeholder="Tên gia sư" className="rounded-xl mt-1" /></div>
                <div><Label>Học sinh</Label><Input value={newClass.student} onChange={e => setNewClass(p => ({ ...p, student: e.target.value }))} placeholder="Tên học sinh" className="rounded-xl mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Lịch học</Label><Input value={newClass.schedule} onChange={e => setNewClass(p => ({ ...p, schedule: e.target.value }))} placeholder="VD: T2, T4, T6 - 19:00" className="rounded-xl mt-1" /></div>
                <div><Label>Tổng buổi</Label><Input type="number" value={newClass.totalSessions} onChange={e => setNewClass(p => ({ ...p, totalSessions: e.target.value }))} placeholder="VD: 24" className="rounded-xl mt-1" /></div>
              </div>
              <div><Label>Ghi chú</Label><Textarea value={newClass.description} onChange={e => setNewClass(p => ({ ...p, description: e.target.value }))} placeholder="Ghi chú thêm..." className="rounded-xl mt-1" rows={2} /></div>
              <Button onClick={handleCreate} className="w-full rounded-xl">Tạo lớp</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Lớp học</TableHead><TableHead>Gia sư</TableHead><TableHead>Học sinh</TableHead><TableHead>Lịch học</TableHead><TableHead>Học phí</TableHead><TableHead>Tiến độ</TableHead><TableHead>Trạng thái</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => {
                const cfg = statusMap[c.status] || statusMap.active;
                const progress = c.totalSessions > 0 ? Math.round((c.completedSessions / c.totalSessions) * 100) : 0;
                return (
                  <TableRow key={c.id}>
                    <TableCell><div><p className="font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.subject}</p></div></TableCell>
                    <TableCell><div className="flex items-center gap-2">{c.tutorAvatar && <img src={c.tutorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />}<span className="text-sm">{c.tutor}</span></div></TableCell>
                    <TableCell><div className="flex items-center gap-2">{c.studentAvatar && <img src={c.studentAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />}<span className="text-sm">{c.student}</span></div></TableCell>
                    <TableCell className="text-sm">{c.schedule}</TableCell>
                    <TableCell className="text-sm font-medium">{c.fee.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell><div className="w-24"><Progress value={progress} className="h-2" /><p className="text-[10px] text-muted-foreground mt-1">{c.completedSessions}/{c.totalSessions} buổi</p></div></TableCell>
                    <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailId(c.id)}><Eye className="w-3.5 h-3.5" /></Button>
                        {c.status === "active" && <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setCancelId(c.id)}><XCircle className="w-3.5 h-3.5" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Chi tiết lớp học</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Tên lớp</Label><p className="text-sm font-medium text-foreground">{detail.name}</p></div>
                <div><Label className="text-xs text-muted-foreground">Môn học</Label><p className="text-sm font-medium text-foreground">{detail.subject}</p></div>
                <div><Label className="text-xs text-muted-foreground">Gia sư</Label><p className="text-sm font-medium text-foreground">{detail.tutor}</p></div>
                <div><Label className="text-xs text-muted-foreground">Học sinh</Label><p className="text-sm font-medium text-foreground">{detail.student}</p></div>
                <div><Label className="text-xs text-muted-foreground">Lịch học</Label><p className="text-sm font-medium text-foreground">{detail.schedule}</p></div>
                <div><Label className="text-xs text-muted-foreground">Học phí</Label><p className="text-sm font-medium text-foreground">{detail.fee.toLocaleString("vi-VN")}đ</p></div>
                <div><Label className="text-xs text-muted-foreground">Tiến độ</Label><p className="text-sm font-medium text-foreground">{detail.completedSessions}/{detail.totalSessions} buổi</p></div>
                <div><Label className="text-xs text-muted-foreground">Trạng thái</Label><div className="mt-1"><Badge variant={(statusMap[detail.status] || statusMap.active).variant}>{(statusMap[detail.status] || statusMap.active).label}</Badge></div></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Hủy lớp học</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Vui lòng nhập lý do hủy lớp:</p>
            <Textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Lý do hủy..." className="rounded-xl" rows={3} />
            <Button onClick={handleCancel} variant="destructive" className="w-full rounded-xl">Xác nhận hủy lớp</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeClasses;
