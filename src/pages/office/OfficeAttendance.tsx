import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Clock, AlertTriangle, CalendarDays, ClipboardCheck, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ xác nhận", variant: "outline" },
  confirmed: { label: "Đã xác nhận", variant: "default" },
  reported: { label: "Đã báo lỗi", variant: "destructive" },
  upcoming: { label: "Sắp tới", variant: "secondary" },
  completed: { label: "Đã học", variant: "default" },
};

const OfficeAttendance = () => {
  const { attendance, confirmAttendance } = useOffice();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = attendance.filter(a => {
    const matchSearch = a.className.toLowerCase().includes(search.toLowerCase()) || a.student.toLowerCase().includes(search.toLowerCase()) || a.tutor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const detail = attendance.find(a => a.id === detailId);
  const pending = attendance.filter(a => a.status === "pending").length;
  const completed = attendance.filter(a => a.status === "completed").length;
  const reported = attendance.filter(a => a.status === "reported").length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Clock className="w-5 h-5 text-foreground" /></div>
          <div><p className="text-xl font-bold text-foreground">{pending}</p><p className="text-xs text-muted-foreground">Chờ xác nhận</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-foreground" /></div>
          <div><p className="text-xl font-bold text-foreground">{completed}</p><p className="text-xs text-muted-foreground">Đã hoàn thành</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
          <div><p className="text-xl font-bold text-foreground">{reported}</p><p className="text-xs text-muted-foreground">Đã báo lỗi</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><CalendarDays className="w-5 h-5 text-foreground" /></div>
          <div><p className="text-xl font-bold text-foreground">{attendance.length}</p><p className="text-xs text-muted-foreground">Tổng buổi học</p></div>
        </CardContent></Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Danh sách buổi học</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-9 text-sm rounded-xl" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="completed">Đã học</SelectItem>
                  <SelectItem value="reported">Đã báo lỗi</SelectItem>
                  <SelectItem value="upcoming">Sắp tới</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Lớp học</TableHead><TableHead>Gia sư</TableHead><TableHead>Học sinh</TableHead><TableHead>Ngày</TableHead><TableHead>Giờ</TableHead><TableHead>Trạng thái</TableHead><TableHead>PH xác nhận</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => {
                const cfg = statusConfig[a.status];
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.className}</TableCell>
                    <TableCell>{a.tutor}</TableCell>
                    <TableCell>{a.student}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{a.time}</TableCell>
                    <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                    <TableCell>{a.parentConfirmed ? <Badge variant="default">Đã xác nhận</Badge> : <Badge variant="outline">Chưa</Badge>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailId(a.id)}><Eye className="w-3.5 h-3.5" /></Button>
                        {a.status === "pending" && <Button size="sm" variant="outline" className="text-xs rounded-xl h-7" onClick={() => { confirmAttendance(a.id); toast({ title: "Đã xác nhận điểm danh" }); }}>Xác nhận</Button>}
                        {a.status === "reported" && <Button size="sm" variant="destructive" className="text-xs rounded-xl h-7" onClick={() => { confirmAttendance(a.id); toast({ title: "Đã xử lý sự cố" }); }}>Xử lý</Button>}
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
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết điểm danh</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Lớp học</Label><p className="text-sm font-medium text-foreground">{detail.className}</p></div>
                <div><Label className="text-xs text-muted-foreground">Trạng thái</Label><div className="mt-1"><Badge variant={statusConfig[detail.status].variant}>{statusConfig[detail.status].label}</Badge></div></div>
                <div><Label className="text-xs text-muted-foreground">Gia sư</Label><p className="text-sm font-medium text-foreground">{detail.tutor}</p></div>
                <div><Label className="text-xs text-muted-foreground">Học sinh</Label><p className="text-sm font-medium text-foreground">{detail.student}</p></div>
                <div><Label className="text-xs text-muted-foreground">Ngày</Label><p className="text-sm font-medium text-foreground">{detail.date}</p></div>
                <div><Label className="text-xs text-muted-foreground">Giờ</Label><p className="text-sm font-medium text-foreground">{detail.time}</p></div>
                <div><Label className="text-xs text-muted-foreground">PH xác nhận</Label><p className="text-sm font-medium text-foreground">{detail.parentConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}</p></div>
              </div>
              {detail.issue && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
                  <p className="text-xs font-medium text-destructive">Vấn đề báo cáo:</p>
                  <p className="text-sm text-destructive/80 mt-1">{detail.issue}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeAttendance;
