import { useTutor } from "@/contexts/TutorContext";
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, RefreshCw, Ban, DollarSign } from "lucide-react";
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
};

const typeColors: Record<string, string> = {
  escrow_in: "text-primary",
  escrow_release: "text-emerald-600",
  withdrawal: "text-muted-foreground",
  refund: "text-destructive",
  platform_fee: "text-amber-600",
};

const TutorWallet = () => {
  const { wallet, walletBalance, escrowBalance, classes, requestRefund, requestWithdrawal } = useTutor();
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? wallet : wallet.filter(w => w.type === filter);

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (amount > 0 && amount <= walletBalance) {
      requestWithdrawal(amount);
      toast.success(`Yêu cầu rút ${amount.toLocaleString("vi-VN")}đ đã được gửi`);
      setWithdrawDialog(false);
      setWithdrawAmount("");
    }
  };

  const refundableClasses = classes.filter(c => c.escrowStatus === "pending" || c.escrowStatus === "in_progress");

  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-muted-foreground">Ví khả dụng</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</p>
          <button onClick={() => setWithdrawDialog(true)} className="mt-3 w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">Rút tiền</button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Escrow đang giữ</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{escrowBalance.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground mt-2">Sẽ giải ngân khi hoàn thành buổi</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-muted-foreground">Tổng thu nhập</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {wallet.filter(w => w.type === "escrow_release" && w.status === "completed").reduce((s, w) => s + w.amount, 0).toLocaleString("vi-VN")}đ
          </p>
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
              {c.escrowStatus === "completed" && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">Released</span>}
              {(c.escrowStatus === "pending" || c.escrowStatus === "in_progress") && (
                <button onClick={() => { requestRefund(c.id); toast.info("Yêu cầu hoàn tiền đã gửi cho Admin"); }} className="text-[10px] font-medium text-destructive hover:underline">Yêu cầu hoàn tiền</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Lịch sử giao dịch</h3>
          <div className="flex gap-1">
            {[{ label: "Tất cả", value: "all" }, { label: "Giải ngân", value: "escrow_release" }, { label: "Rút tiền", value: "withdrawal" }, { label: "Phí", value: "platform_fee" }].map(f => (
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
                <p className="text-[11px] text-muted-foreground">{w.date} • {typeLabels[w.type]}</p>
              </div>
              <p className={cn("text-sm font-semibold", w.amount > 0 ? "text-emerald-600" : "text-foreground")}>
                {w.amount > 0 ? "+" : ""}{w.amount.toLocaleString("vi-VN")}đ
              </p>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-lg", w.status === "completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20")}>
                {w.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Secure Payment Badge */}
      <div className="flex items-center justify-center gap-3 py-4">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="text-xs text-muted-foreground">Secure Payment • MoMo • VNPay</span>
        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-5 object-contain" />
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Rút tiền</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Số dư khả dụng: <strong>{walletBalance.toLocaleString("vi-VN")}đ</strong></p>
            <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="Nhập số tiền cần rút" />
            <button onClick={handleWithdraw} disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0 || parseInt(withdrawAmount) > walletBalance} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50">Xác nhận rút tiền</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorWallet;
