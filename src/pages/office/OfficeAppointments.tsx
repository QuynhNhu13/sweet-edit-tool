import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Search, Users, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "cancelled";
interface Appointment {
  id: string;
  title: string;
  type: "complaint" | "dispute" | "consultation" | "matching";
  participants: string[];
  date: string;
  time: string;
  status: AppointmentStatus;
  description: string;
  resolution?: string;
}

const typeCfg: Record<string, { label: string; color: string }> = {
  complaint: { label: "Khiếu nại", color: "bg-red-500/10 text-red-700" },
  dispute: { label: "Tranh chấp", color: "bg-amber-500/10 text-amber-700" },
  consultation: { label: "Tư vấn", color: "bg-blue-500/10 text-blue-700" },
  matching: { label: "Ghép lớp", color: "bg-emerald-500/10 text-emerald-700" },
};

const statusCfg: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Đã lên lịch", variant: "outline" },
  "in-progress": { label: "Đang xử lý", variant: "default" },
  completed: { label: "Hoàn tất", variant: "secondary" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const initialAppointments: Appointment[] = [
  { id: "ap1", title: "Xử lý khiếu nại điểm danh sai", type: "complaint", participants: ["Phạm Hồng Đào (PH)", "Nguyễn Văn An (GS)"], date: "04/03/2026", time: "09:00", status: "scheduled", description: "Phụ huynh phản ánh gia sư không có mặt buổi học ngày 02/03 nhưng hệ thống ghi nhận đã dạy." },
  { id: "ap2", title: "Ghép lớp Lý 10 cho học sinh mới", type: "matching", participants: ["Trần Đức Anh (HS)", "Hoàng Đức Em (GS)"], date: "04/03/2026", time: "14:00", status: "scheduled", description: "Ghép học sinh Trần Đức Anh vào lớp Lý 10 với GS Hoàng Đức Em, xác nhận lịch học phù hợp." },
  { id: "ap3", title: "Tư vấn chuyển gia sư cho lớp Văn", type: "consultation", participants: ["Ngô Thị Lan (HS)", "Lý Thị Mai (PH)"], date: "03/03/2026", time: "10:00", status: "in-progress", description: "Học sinh muốn đổi gia sư Văn do phong cách dạy không phù hợp." },
  { id: "ap4", title: "Giải quyết tranh chấp hoàn tiền", type: "dispute", participants: ["Trương Văn Kiên (HS)", "Đỗ Quang Minh (GS)"], date: "01/03/2026", time: "15:30", status: "completed", description: "Học sinh yêu cầu hoàn tiền 2 buổi IELTS do nội dung không đúng cam kết.", resolution: "Đã hoàn 50% phí 2 buổi, GS cam kết cải thiện chất lượng." },
  { id: "ap5", title: "Tư vấn đăng ký lớp mới", type: "consultation", participants: ["Lê Thị Mai (PH)"], date: "28/02/2026", time: "11:00", status: "completed", description: "Phụ huynh cần tư vấn lớp Toán cho con lớp 10.", resolution: "Đã giới thiệu 3 gia sư Toán, PH sẽ xem xét." },
];

const OfficeAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  const filtered = appointments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.participants.some(p => p.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const detail = appointments.find(a => a.id === detailId);
  const upcoming = appointments.filter(a => a.status === "scheduled").length;
  const inProgress = appointments.filter(a => a.status === "in-progress").length;

  const handleResolve = () => {
    if (resolveId && resolution.trim()) {
      setAppointments(prev => prev.map(a => a.id === resolveId ? { ...a, status: "completed" as const, resolution } : a));
      toast({ title: "Đã hoàn tất lịch hẹn" });
      setResolveId(null);
      setResolution("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{upcoming}</p><p className="text-xs text-muted-foreground">Sắp tới</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{inProgress}</p><p className="text-xs text-muted-foreground">Đang xử lý</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{appointments.filter(a => a.status === "completed").length}</p><p className="text-xs text-muted-foreground">Hoàn tất</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{appointments.filter(a => a.type === "complaint" || a.type === "dispute").length}</p><p className="text-xs text-muted-foreground">Khiếu nại/Tranh chấp</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm lịch hẹn..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm rounded-xl" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="complaint">Khiếu nại</SelectItem>
            <SelectItem value="dispute">Tranh chấp</SelectItem>
            <SelectItem value="consultation">Tư vấn</SelectItem>
            <SelectItem value="matching">Ghép lớp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(a => {
          const tCfg = typeCfg[a.type];
          const sCfg = statusCfg[a.status];
          return (
            <Card key={a.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[10px] ${tCfg.color}`}>{tCfg.label}</Badge>
                      <Badge variant={sCfg.variant}>{sCfg.label}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {a.participants.length} người</span>
                    </div>
                    {a.resolution && (
                      <div className="mt-2 p-2 bg-emerald-500/5 border border-emerald-200 rounded-lg">
                        <p className="text-xs text-emerald-700"><span className="font-medium">Kết quả:</span> {a.resolution}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setDetailId(a.id)}>Chi tiết</Button>
                    {(a.status === "scheduled" || a.status === "in-progress") && (
                      <Button size="sm" className="rounded-xl" onClick={() => setResolveId(a.id)}>Hoàn tất</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail */}
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết lịch hẹn</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={typeCfg[detail.type].color}>{typeCfg[detail.type].label}</Badge>
                <Badge variant={statusCfg[detail.status].variant}>{statusCfg[detail.status].label}</Badge>
              </div>
              <p className="text-base font-semibold text-foreground">{detail.title}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Ngày</Label><p className="text-sm text-foreground">{detail.date}</p></div>
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Giờ</Label><p className="text-sm text-foreground">{detail.time}</p></div>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl">
                <Label className="text-[10px] text-muted-foreground">Người tham gia</Label>
                <div className="mt-1 space-y-1">{detail.participants.map(p => <p key={p} className="text-sm text-foreground">{p}</p>)}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Nội dung</Label><p className="text-sm text-foreground mt-1">{detail.description}</p></div>
              {detail.resolution && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-200 rounded-xl"><Label className="text-[10px] text-emerald-600">Kết quả xử lý</Label><p className="text-sm text-foreground mt-1">{detail.resolution}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve */}
      <Dialog open={!!resolveId} onOpenChange={() => { setResolveId(null); setResolution(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Hoàn tất lịch hẹn</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Nhập kết quả xử lý:</p>
            <Textarea value={resolution} onChange={e => setResolution(e.target.value)} placeholder="VD: Đã thống nhất hoàn 50% phí, gia sư cam kết cải thiện..." className="rounded-xl" rows={4} />
            <Button onClick={handleResolve} className="w-full rounded-xl" disabled={!resolution.trim()}>Xác nhận hoàn tất</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeAppointments;
