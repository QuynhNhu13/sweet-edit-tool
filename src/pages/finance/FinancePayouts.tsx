import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote, CheckCircle2, XCircle, Clock, Eye, Search, Shield, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allFiltered = withdrawals.filter(w => {
    const matchSearch = w.tutorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = allFiltered.filter(w => w.status === "pending");
  const processed = allFiltered.filter(w => w.status !== "pending");
  const detail = withdrawals.find(w => w.id === detailId);

  const totalEscrow = withdrawals.reduce((s, w) => s + (w.totalEarned - w.totalWithdrawn), 0);
  const totalPending = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const totalApproved = withdrawals.filter(w => w.status === "approved").reduce((s, w) => s + w.amount, 0);

  const handleReject = () => {
    if (rejectDialog && rejectNote.trim()) {
      rejectWithdrawal(rejectDialog, rejectNote);
      toast({ title: "Đã từ chối yêu cầu", variant: "destructive" });
      setRejectDialog(null);
      setRejectNote("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Shield className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-lg font-bold text-blue-600">{totalEscrow.toLocaleString("vi-VN")}đ</p><p className="text-[10px] text-muted-foreground">Escrow Balance</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-lg font-bold text-foreground">{pending.length}</p><p className="text-[10px] text-muted-foreground">Chờ duyệt</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-orange-600" /></div>
          <div><p className="text-lg font-bold text-orange-600">{totalPending.toLocaleString("vi-VN")}đ</p><p className="text-[10px] text-muted-foreground">Tổng chờ duyệt</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-lg font-bold text-emerald-600">{totalApproved.toLocaleString("vi-VN")}đ</p><p className="text-[10px] text-muted-foreground">Đã giải ngân</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-lg font-bold text-foreground">{withdrawals.filter(w => w.status === "rejected").length}</p><p className="text-[10px] text-muted-foreground">Từ chối</p></div>
        </CardContent></Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên gia sư..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <Card className="border-border border-l-4 border-l-amber-500">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Yêu cầu chờ duyệt ({pending.length})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pending.map(w => (
              <div key={w.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={w.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{w.tutorName}</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu ngày {w.requestDate}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">{w.amount.toLocaleString("vi-VN")}đ</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                  <div className="p-2 bg-background rounded-lg"><span className="text-muted-foreground block">Ngân hàng</span><span className="font-medium text-foreground">{w.bankName}</span></div>
                  <div className="p-2 bg-background rounded-lg"><span className="text-muted-foreground block">STK</span><span className="font-medium text-foreground">{w.bankAccount}</span></div>
                  <div className="p-2 bg-background rounded-lg"><span className="text-muted-foreground block">Tổng thu nhập</span><span className="font-medium text-emerald-600">{w.totalEarned.toLocaleString("vi-VN")}đ</span></div>
                  <div className="p-2 bg-background rounded-lg"><span className="text-muted-foreground block">Số dư khả dụng</span><span className="font-medium text-blue-600">{(w.totalEarned - w.totalWithdrawn).toLocaleString("vi-VN")}đ</span></div>
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

      {/* Processed */}
      {processed.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Đã xử lý ({processed.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {processed.map(w => {
              const cfg = statusConfig[w.status];
              return (
                <div key={w.id} className="p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={w.tutorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{w.tutorName}</p>
                        <p className="text-xs text-muted-foreground">{w.requestDate} • {w.bankName} {w.bankAccount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground">{w.amount.toLocaleString("vi-VN")}đ</p>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailId(w.id)}><Eye className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  {w.note && w.status === "rejected" && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
                      <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-destructive">Lý do từ chối</p>
                        <p className="text-xs text-destructive/80 mt-0.5">{w.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <img src={detail.tutorAvatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="text-base font-semibold text-foreground">{detail.tutorName}</p>
                  <p className="text-xs text-muted-foreground">Yêu cầu ngày {detail.requestDate}</p>
                  <Badge variant={statusConfig[detail.status].variant} className="mt-1">{statusConfig[detail.status].label}</Badge>
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-200 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">Số tiền yêu cầu rút</p>
                <p className="text-2xl font-bold text-foreground">{detail.amount.toLocaleString("vi-VN")}đ</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Ngân hàng</Label><p className="text-sm font-medium text-foreground">{detail.bankName}</p></div>
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Số tài khoản</Label><p className="text-sm font-medium text-foreground">{detail.bankAccount}</p></div>
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Tổng thu nhập</Label><p className="text-sm font-medium text-emerald-600">{detail.totalEarned.toLocaleString("vi-VN")}đ</p></div>
                <div className="p-3 bg-muted/50 rounded-xl"><Label className="text-[10px] text-muted-foreground">Đã rút</Label><p className="text-sm font-medium text-foreground">{detail.totalWithdrawn.toLocaleString("vi-VN")}đ</p></div>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /><span className="text-sm text-muted-foreground">Escrow khả dụng</span></div>
                <p className="text-sm font-bold text-emerald-600">{(detail.totalEarned - detail.totalWithdrawn).toLocaleString("vi-VN")}đ</p>
              </div>

              {detail.note && (
                <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
                  <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-destructive">Lý do từ chối</p>
                    <p className="text-xs text-destructive/80 mt-0.5">{detail.note}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => { setRejectDialog(null); setRejectNote(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Từ chối yêu cầu rút tiền</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Vui lòng nhập lý do từ chối để thông báo cho gia sư:</p>
            <Textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="VD: Số dư khả dụng không đủ, cần hoàn thành thêm buổi dạy..." className="rounded-xl" rows={3} />
            <Button onClick={handleReject} variant="destructive" className="w-full rounded-xl" disabled={!rejectNote.trim()}>Xác nhận từ chối</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePayouts;
