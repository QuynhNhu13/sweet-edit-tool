import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Banknote, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ duyệt", variant: "outline" },
  approved: { label: "Đã duyệt", variant: "default" },
  rejected: { label: "Từ chối", variant: "destructive" },
};

const FinancePayouts = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal } = useFinance();
  const { toast } = useToast();
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const pending = withdrawals.filter(w => w.status === "pending");
  const processed = withdrawals.filter(w => w.status !== "pending");
  const detail = withdrawals.find(w => w.id === detailId);

  const handleReject = () => {
    if (rejectDialog && rejectNote) {
      rejectWithdrawal(rejectDialog, rejectNote);
      toast({ title: "Đã từ chối yêu cầu", variant: "destructive" });
      setRejectDialog(null);
      setRejectNote("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{pending.length}</p><p className="text-xs text-muted-foreground">Chờ duyệt</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{withdrawals.filter(w => w.status === "approved").length}</p><p className="text-xs text-muted-foreground">Đã duyệt</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{withdrawals.filter(w => w.status === "rejected").length}</p><p className="text-xs text-muted-foreground">Từ chối</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Banknote className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{pending.reduce((s, w) => s + w.amount, 0).toLocaleString("vi-VN")}đ</p><p className="text-xs text-muted-foreground">Tổng chờ duyệt</p></div>
        </CardContent></Card>
      </div>

      {pending.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Banknote className="w-4 h-4" /> Yêu cầu chờ duyệt</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pending.map(w => (
              <div key={w.id} className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={w.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{w.tutorName}</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu ngày {w.requestDate}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">{w.amount.toLocaleString("vi-VN")}đ</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                  <div><span className="text-muted-foreground">Ngân hàng:</span> <span className="font-medium text-foreground">{w.bankName}</span></div>
                  <div><span className="text-muted-foreground">STK:</span> <span className="font-medium text-foreground">{w.bankAccount}</span></div>
                  <div><span className="text-muted-foreground">Tổng thu nhập:</span> <span className="font-medium text-foreground">{w.totalEarned.toLocaleString("vi-VN")}đ</span></div>
                  <div><span className="text-muted-foreground">Đã rút:</span> <span className="font-medium text-foreground">{w.totalWithdrawn.toLocaleString("vi-VN")}đ</span></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setDetailId(w.id)}><Eye className="w-3.5 h-3.5 mr-1" /> Chi tiết</Button>
                  <Button size="sm" className="rounded-xl" onClick={() => { approveWithdrawal(w.id); toast({ title: "Đã duyệt yêu cầu rút tiền" }); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Duyệt</Button>
                  <Button size="sm" variant="destructive" className="rounded-xl" onClick={() => setRejectDialog(w.id)}><XCircle className="w-3.5 h-3.5 mr-1" /> Từ chối</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {processed.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Đã xử lý</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {processed.map(w => {
              const cfg = statusConfig[w.status];
              return (
                <div key={w.id} className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={w.tutorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{w.tutorName}</p>
                        <p className="text-xs text-muted-foreground">{w.requestDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground">{w.amount.toLocaleString("vi-VN")}đ</p>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailId(w.id)}><Eye className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  {w.note && w.status === "rejected" && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-700"><span className="font-medium">Lý do từ chối:</span> {w.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={detail.tutorAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div><p className="text-base font-semibold text-foreground">{detail.tutorName}</p><p className="text-xs text-muted-foreground">Yêu cầu ngày {detail.requestDate}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Số tiền yêu cầu</Label><p className="text-lg font-bold text-foreground">{detail.amount.toLocaleString("vi-VN")}đ</p></div>
                <div><Label className="text-xs text-muted-foreground">Trạng thái</Label><div className="mt-1"><Badge variant={statusConfig[detail.status].variant}>{statusConfig[detail.status].label}</Badge></div></div>
                <div><Label className="text-xs text-muted-foreground">Ngân hàng</Label><p className="text-sm font-medium text-foreground">{detail.bankName}</p></div>
                <div><Label className="text-xs text-muted-foreground">Số tài khoản</Label><p className="text-sm font-medium text-foreground">{detail.bankAccount}</p></div>
                <div><Label className="text-xs text-muted-foreground">Tổng thu nhập</Label><p className="text-sm font-medium text-foreground">{detail.totalEarned.toLocaleString("vi-VN")}đ</p></div>
                <div><Label className="text-xs text-muted-foreground">Đã rút</Label><p className="text-sm font-medium text-foreground">{detail.totalWithdrawn.toLocaleString("vi-VN")}đ</p></div>
                <div><Label className="text-xs text-muted-foreground">Số dư khả dụng</Label><p className="text-sm font-bold text-emerald-600">{(detail.totalEarned - detail.totalWithdrawn).toLocaleString("vi-VN")}đ</p></div>
              </div>
              {detail.note && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-xs text-red-700"><span className="font-medium">Ghi chú:</span> {detail.note}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent><DialogHeader><DialogTitle>Lý do từ chối</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Label>Ghi chú</Label>
            <Textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Nhập lý do từ chối..." className="rounded-xl" rows={3} />
            <Button onClick={handleReject} variant="destructive" className="w-full rounded-xl">Xác nhận từ chối</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePayouts;
