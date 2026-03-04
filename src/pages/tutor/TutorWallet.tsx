import { useTutor } from "@/contexts/TutorContext";
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, DollarSign, Plus, CreditCard, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const typeLabels: Record<string, string> = {
  escrow_in: "Escrow nhận",
  escrow_release: "Giải ngân",
  withdrawal: "Rút tiền",
  refund: "Hoàn tiền",
  platform_fee: "Phí nền tảng",
  deposit: "Nạp tiền",
};

const paymentMethods = [
  { id: "momo", name: "MoMo", icon: "💜", desc: "Ví điện tử MoMo" },
  { id: "vnpay", name: "VNPay", icon: "🔵", desc: "Cổng thanh toán VNPay" },
  { id: "vietcombank", name: "Vietcombank", icon: "🏦", desc: "****1234" },
  { id: "techcombank", name: "Techcombank", icon: "🏧", desc: "****5678" },
  { id: "bidv", name: "BIDV", icon: "🔴", desc: "****9012" },
];

const refundReasons = [
  "Lớp học bị hủy do học sinh không tham gia",
  "Phụ huynh yêu cầu dừng lớp",
  "Gia sư không thể tiếp tục giảng dạy",
  "Chất lượng không đạt yêu cầu - đồng thuận hoàn tiền",
  "Lịch học không phù hợp, không thể sắp xếp lại",
];

const TutorWallet = () => {
  const { wallet, walletBalance, escrowBalance, classes, refundRequests, requestRefund, requestWithdrawal, requestDeposit } = useTutor();
  const [dialogType, setDialogType] = useState<"withdraw" | "deposit" | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [filter, setFilter] = useState<string>("all");

  // Refund modal state
  const [refundClassId, setRefundClassId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundCustomReason, setRefundCustomReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundFullAmount, setRefundFullAmount] = useState(true);

  const filtered = filter === "all" ? wallet : wallet.filter(w => w.type === filter);
  const totalIncome = wallet.filter(w => w.type === "escrow_release" && w.status === "completed").reduce((s, w) => s + w.amount, 0);

  const refundClass = classes.find(c => c.id === refundClassId);
  const refundMax = refundClass ? refundClass.escrowAmount - refundClass.escrowReleased : 0;

  const hasExistingRefund = (classId: string) => refundRequests.some(r => r.classId === classId && r.status === "pending");

  const handleSubmit = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0 || !selectedMethod) return;
    const method = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
    if (dialogType === "withdraw") {
      if (amt > walletBalance) { toast.error("Số tiền vượt quá số dư!"); return; }
      requestWithdrawal(amt, method);
      toast.success(`Yêu cầu rút ${amt.toLocaleString("vi-VN")}đ qua ${method} đã được gửi`);
    } else {
      requestDeposit(amt, method);
      toast.success(`Nạp ${amt.toLocaleString("vi-VN")}đ từ ${method} thành công!`);
    }
    setDialogType(null);
    setAmount("");
    setSelectedMethod("");
  };

  const openRefundModal = (classId: string) => {
    setRefundClassId(classId);
    setRefundReason("");
    setRefundCustomReason("");
    setRefundFullAmount(true);
    const cls = classes.find(c => c.id === classId);
    if (cls) setRefundAmount(String(cls.escrowAmount - cls.escrowReleased));
  };

  const handleRefundSubmit = () => {
    if (!refundClassId) return;
    const finalReason = refundReason === "custom" ? refundCustomReason.trim() : refundReason;
    if (!finalReason) { toast.error("Vui lòng nhập lý do hoàn tiền"); return; }
    const amt = parseInt(refundAmount);
    if (!amt || amt <= 0 || amt > refundMax) { toast.error("Số tiền không hợp lệ"); return; }
    requestRefund(refundClassId, finalReason, amt);
    toast.success("Yêu cầu hoàn tiền đã được gửi đến Kế toán");
    setRefundClassId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Wallet className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-xs text-muted-foreground">Ví khả dụng</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setDialogType("withdraw")} className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Rút
            </button>
            <button onClick={() => setDialogType("deposit")} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Nạp
            </button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-primary" /></div>
            <span className="text-xs text-muted-foreground">Escrow đang giữ</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{escrowBalance.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground mt-2">Giải ngân khi hoàn thành buổi</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"><DollarSign className="w-5 h-5 text-amber-600" /></div>
            <span className="text-xs text-muted-foreground">Tổng thu nhập</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalIncome.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-destructive" /></div>
            <span className="text-xs text-muted-foreground">Phí nền tảng</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{Math.abs(wallet.filter(w => w.type === "platform_fee").reduce((s, w) => s + w.amount, 0)).toLocaleString("vi-VN")}đ</p>
        </div>
      </div>

      {/* Escrow per class */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Escrow theo lớp</h3>
        <div className="space-y-3">
          {classes.filter(c => c.escrowStatus !== "refunded").map(c => (
            <div key={c.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.completedSessions}/{c.totalSessions} buổi</p>
              </div>
              <div className="w-32">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 rounded-full h-2 transition-all" style={{ width: `${(c.escrowReleased / c.escrowAmount) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{c.escrowReleased.toLocaleString("vi-VN")}/{c.escrowAmount.toLocaleString("vi-VN")}đ</p>
              </div>
              {c.escrowStatus === "completed" && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">Đã giải ngân</span>}
              {(c.escrowStatus === "pending" || c.escrowStatus === "in_progress") && (
                hasExistingRefund(c.id) ? (
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">Chờ duyệt</span>
                ) : (
                  <button onClick={() => openRefundModal(c.id)} className="text-[10px] font-medium text-destructive hover:underline">Hoàn tiền</button>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Refund Requests History */}
      {refundRequests.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Yêu cầu hoàn tiền</h3>
          <div className="space-y-2">
            {refundRequests.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{r.className} — {r.amount.toLocaleString("vi-VN")}đ</p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.reason}</p>
                  <p className="text-[10px] text-muted-foreground/70">{r.createdAt}</p>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium",
                  r.status === "pending" && "bg-amber-50 text-amber-600 dark:bg-amber-900/20",
                  r.status === "approved" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
                  r.status === "rejected" && "bg-destructive/10 text-destructive",
                )}>
                  {r.status === "pending" ? "Chờ duyệt" : r.status === "approved" ? "Đã duyệt" : "Từ chối"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Lịch sử giao dịch</h3>
          <div className="flex gap-1 flex-wrap">
            {[{ label: "Tất cả", value: "all" }, { label: "Giải ngân", value: "escrow_release" }, { label: "Rút tiền", value: "withdrawal" }, { label: "Nạp tiền", value: "deposit" }, { label: "Phí", value: "platform_fee" }].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-colors", filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(w => (
            <div key={w.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", w.amount > 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-muted")}>
                {w.amount > 0 ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{w.description}</p>
                <p className="text-[11px] text-muted-foreground">{w.date} • {typeLabels[w.type]}{w.paymentMethod ? ` • ${w.paymentMethod}` : ""}</p>
              </div>
              <p className={cn("text-sm font-semibold", w.amount > 0 ? "text-emerald-600" : "text-foreground")}>
                {w.amount > 0 ? "+" : ""}{w.amount.toLocaleString("vi-VN")}đ
              </p>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-lg", w.status === "completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20")}>
                {w.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
              </span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có giao dịch nào</p>}
        </div>
      </div>

      {/* Secure Payment Badge */}
      <div className="flex items-center justify-center gap-3 py-4">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="text-xs text-muted-foreground">Secure Payment • MoMo • VNPay • Ngân hàng</span>
      </div>

      {/* Withdraw/Deposit Dialog */}
      <Dialog open={!!dialogType} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{dialogType === "withdraw" ? "Rút tiền" : "Nạp tiền"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {dialogType === "withdraw" && (
              <p className="text-sm text-muted-foreground">Số dư khả dụng: <strong>{walletBalance.toLocaleString("vi-VN")}đ</strong></p>
            )}
            <div>
              <label className="text-xs font-medium text-foreground">Số tiền</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="Nhập số tiền" />
              <div className="flex gap-2 mt-2">
                {[100000, 200000, 500000, 1000000].map(v => (
                  <button key={v} onClick={() => setAmount(String(v))} className="px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-primary/10 hover:text-primary">{(v / 1000).toFixed(0)}k</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Phương thức thanh toán</label>
              <div className="space-y-2 mt-2">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all", selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50")}>
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} disabled={!amount || parseInt(amount) <= 0 || !selectedMethod} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">
              {dialogType === "withdraw" ? "Xác nhận rút tiền" : "Xác nhận nạp tiền"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Request Dialog */}
      <Dialog open={!!refundClassId} onOpenChange={() => setRefundClassId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Yêu cầu hoàn tiền</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* Explanation */}
            <div className="flex gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hoàn tiền là yêu cầu gửi đến bộ phận Kế toán để xử lý hoàn trả phần học phí chưa giải ngân cho phụ huynh/học sinh. Yêu cầu sẽ được xem xét và phê duyệt trước khi thực hiện.
              </p>
            </div>

            {/* Class info */}
            {refundClass && (
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-sm font-medium text-foreground">{refundClass.name}</p>
                <p className="text-xs text-muted-foreground">Học sinh: {refundClass.studentName} • Escrow chưa giải ngân: <strong>{refundMax.toLocaleString("vi-VN")}đ</strong></p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="text-xs font-medium text-foreground">Lý do hoàn tiền <span className="text-destructive">*</span></label>
              <div className="space-y-2 mt-2">
                {refundReasons.map(r => (
                  <button key={r} onClick={() => { setRefundReason(r); setRefundCustomReason(""); }}
                    className={cn("w-full text-left px-3 py-2 rounded-xl border text-sm transition-all",
                      refundReason === r ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                    )}>
                    {r}
                  </button>
                ))}
                <button onClick={() => setRefundReason("custom")}
                  className={cn("w-full text-left px-3 py-2 rounded-xl border text-sm transition-all",
                    refundReason === "custom" ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                  )}>
                  Lý do khác...
                </button>
              </div>
              {refundReason === "custom" && (
                <textarea
                  value={refundCustomReason}
                  onChange={e => setRefundCustomReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể..."
                  className="w-full mt-2 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={500}
                />
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium text-foreground">Số tiền hoàn</label>
              <div className="flex gap-3 mt-2">
                <button onClick={() => { setRefundFullAmount(true); setRefundAmount(String(refundMax)); }}
                  className={cn("flex-1 py-2 rounded-xl text-sm font-medium border transition-all",
                    refundFullAmount ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  )}>Toàn bộ ({refundMax.toLocaleString("vi-VN")}đ)</button>
                <button onClick={() => { setRefundFullAmount(false); setRefundAmount(""); }}
                  className={cn("flex-1 py-2 rounded-xl text-sm font-medium border transition-all",
                    !refundFullAmount ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  )}>Một phần</button>
              </div>
              {!refundFullAmount && (
                <div className="mt-2">
                  <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)}
                    placeholder={`Tối đa ${refundMax.toLocaleString("vi-VN")}đ`}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    max={refundMax} min={1}
                  />
                </div>
              )}
            </div>

            <button onClick={handleRefundSubmit}
              disabled={!refundReason || (refundReason === "custom" && !refundCustomReason.trim()) || !refundAmount || parseInt(refundAmount) <= 0}
              className="w-full py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium disabled:opacity-50 transition-colors">
              Gửi yêu cầu hoàn tiền
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorWallet;
