import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Clock, Search as SearchIcon, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "Cao", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Trung bình", className: "bg-muted text-foreground border-border" },
  low: { label: "Thấp", className: "bg-muted text-muted-foreground border-border" },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType }> = {
  pending: { label: "Chờ xử lý", icon: Clock },
  investigating: { label: "Đang điều tra", icon: SearchIcon },
  resolved: { label: "Đã xử lý", icon: CheckCircle2 },
};

const OfficeIncidents = () => {
  const { incidents, resolveIncident } = useOffice();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState("");

  const filtered = filter === "all" ? incidents : incidents.filter(i => i.status === filter);
  const detail = incidents.find(i => i.id === detailId);

  const handleResolve = () => {
    if (resolveId) {
      resolveIncident(resolveId);
      toast({ title: "Đã xử lý sự cố" });
      setResolveId(null);
      setResolveNote("");
    }
  };

  return (
    <div className="px-6 pt-2 pb-6 space-y-4">
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý sự cố</h1>
        <p className="text-muted-foreground text-sm">Theo dõi và xử lý các vấn đề phát sinh</p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Chờ xử lý */}
        <Card className="border-0 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{incidents.filter(i => i.status === "pending").length}</p>
              <p className="text-xs text-white/80 mt-1">Chờ xử lý</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Đang điều tra */}
        <Card className="border-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{incidents.filter(i => i.status === "investigating").length}</p>
              <p className="text-xs text-white/80 mt-1">Đang điều tra</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <SearchIcon className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Đã xử lý */}
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{incidents.filter(i => i.status === "resolved").length}</p>
              <p className="text-xs text-white/80 mt-1">Đã xử lý</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "investigating", "resolved"].map(s => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilter(s)}>
            {s === "all" ? "Tất cả" : statusConfig[s]?.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(incident => {
          const pCfg = priorityConfig[incident.priority];
          const sCfg = statusConfig[incident.status];
          return (
            <Card key={incident.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${pCfg.className}`}>{pCfg.label}</span>
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><sCfg.icon className="w-3.5 h-3.5" />{sCfg.label}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{incident.createdAt}</p>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{incident.className}</h3>
                <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                {incident.resolution && (
                  <div className="p-2 bg-muted/50 border border-border rounded-lg mb-3">
                    <p className="text-xs text-foreground"><span className="font-medium">Xử lý:</span> {incident.resolution}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Báo cáo bởi: <span className="font-medium text-foreground">{incident.reporter}</span> ({incident.reporterRole})</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => setDetailId(incident.id)}>
                      <Eye className="w-3 h-3 mr-1" /> Chi tiết
                    </Button>
                    {incident.status !== "resolved" && (
                      <Button size="sm" className="rounded-xl text-xs" onClick={() => setResolveId(incident.id)}>Xử lý</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết sự cố</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Lớp học</Label><p className="text-sm font-medium text-foreground">{detail.className}</p></div>
                <div><Label className="text-xs text-muted-foreground">Mức ưu tiên</Label><div className="mt-1"><span className={`px-2 py-0.5 rounded text-xs font-semibold border ${priorityConfig[detail.priority].className}`}>{priorityConfig[detail.priority].label}</span></div></div>
                <div><Label className="text-xs text-muted-foreground">Người báo cáo</Label><p className="text-sm font-medium text-foreground">{detail.reporter} ({detail.reporterRole})</p></div>
                <div><Label className="text-xs text-muted-foreground">Thời gian</Label><p className="text-sm font-medium text-foreground">{detail.createdAt}</p></div>
              </div>
              <div><Label className="text-xs text-muted-foreground">Mô tả</Label><p className="text-sm text-foreground mt-1 p-3 bg-muted/50 rounded-xl">{detail.description}</p></div>
              {detail.resolution && <div><Label className="text-xs text-muted-foreground">Kết quả xử lý</Label><p className="text-sm text-foreground mt-1 p-3 bg-muted/50 rounded-xl border border-border">{detail.resolution}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!resolveId} onOpenChange={() => setResolveId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xử lý sự cố</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Mô tả cách xử lý sự cố này trước khi xác nhận:</p>
            <Textarea value={resolveNote} onChange={e => setResolveNote(e.target.value)} placeholder="Nhập ghi chú xử lý..." className="rounded-xl" rows={3} />
            <Button onClick={handleResolve} className="w-full rounded-xl">Xác nhận đã xử lý</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeIncidents;
