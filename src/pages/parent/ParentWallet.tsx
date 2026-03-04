import { useParent } from "@/contexts/ParentContext";
import { Wallet, CreditCard, ArrowDownLeft, ArrowUpRight, Plus, Download, Receipt, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const typeLabels: Record<string, string> = {
  deposit: "Nạp tiền",
  tuition_payment: "Học phí",
  refund: "Hoàn tiền",
  withdrawal: "Rút tiền",
};

const paymentMethods = [
  { id: "momo", name: "MoMo", desc: "Ví điện tử MoMo" },
  { id: "vnpay", name: "VNPay", desc: "Cổng thanh toán VNPay" },
  { id: "vietcombank", name: "Vietcombank", desc: "Ngân hàng Vietcombank" },
  { id: "techcombank", name: "Techcombank", desc: "Ngân hàng Techcombank" },
];

const ParentWallet = () => {
  const { children, transactions, walletBalance, payChildTuition, depositWallet, withdrawWallet } = useParent();
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [search, setSearch] = useState("");

  const pendingClasses = children.flatMap(child =>
    child.classes.filter(c => c.status === "active" && !c.paid).map(c => ({ ...c, childId: child.id, childName: child.name }))
  );

  const totalPending = pendingClasses.reduce((s, c) => s + c.fee, 0);
  const paidThisMonth = Math.abs(transactions.filter(t => t.type === "tuition_payment" && t.date >= "2026-03-01").reduce((s, t) => s + t.amount, 0));

  const filteredTxns = transactions
    .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const handlePay = (cls: typeof pendingClasses[0]) => {
    if (walletBalance < cls.fee) {
      toast.error("Số dư ví không đủ. Vui lòng nạp thêm tiền.");
      return;
    }
    payChildTuition(cls.id, cls.childId, cls.fee, `Thanh toán - ${cls.name} (${cls.childName})`);
    toast.success(`Đã thanh toán ${cls.fee.toLocaleString("vi-VN")}đ cho ${cls.name}`);
  };

  const handleDeposit = () => {
    const amt = parseInt(depositAmt);
    if (!amt || amt <= 0 || !selectedMethod) return;
    const method = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
    depositWallet(amt);
    toast.success(`Nạp ${amt.toLocaleString("vi-VN")}đ thành công qua ${method}!`);
    setShowDeposit(false);
    setDepositAmt("");
    setSelectedMethod("");
  };

  const handleWithdraw = () => {
    const amt = parseInt(withdrawAmt);
    if (!amt || amt <= 0 || !selectedMethod) return;
    if (amt > walletBalance) {
      toast.error("Số tiền vượt quá số dư ví!");
      return;
    }
    const method = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
    withdrawWallet(amt, method);
    toast.success(`Đã rút ${amt.toLocaleString("vi-VN")}đ qua ${method}`);
    setShowWithdraw(false);
    setWithdrawAmt("");
    setSelectedMethod("");
  };

    toast.success("Đang xuất lịch sử giao dịch...");
    setTimeout(() => {
      const content = [
        "LỊCH SỬ GIAO DỊCH - PHỤ HUYNH EDUCONNECT",
        `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`,
        `Số dư: ${walletBalance.toLocaleString("vi-VN")}đ`,
        "",
        ...transactions.map((t, i) => `${i + 1}. ${t.date} | ${t.description} | ${t.amount > 0 ? "+" : ""}${t.amount.toLocaleString("vi-VN")}đ`),
      ].join("\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `giao-dich-phu-huynh-${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Đã xuất file thành công!");
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Receipt, label: "Cần thanh toán", value: `${totalPending.toLocaleString("vi-VN")}đ` },
          { icon: ArrowUpRight, label: "Đã thanh toán tháng này", value: `${paidThisMonth.toLocaleString("vi-VN")}đ` },
          { icon: Wallet, label: "Số dư ví", value: `${walletBalance.toLocaleString("vi-VN")}đ` },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><s.icon className="w-4 h-4 text-foreground" /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => setShowDeposit(true)} size="sm" className="rounded-xl gap-1"><Plus className="w-3.5 h-3.5" /> Nạp tiền</Button>
        <Button onClick={() => setShowWithdraw(true)} variant="outline" size="sm" className="rounded-xl gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> Rút tiền</Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-1" onClick={handleExport}><Download className="w-3.5 h-3.5" /> Xuất file</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {[{ key: "pending", label: "Cần thanh toán" }, { key: "history", label: "Lịch sử" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
            {t.key === "pending" && pendingClasses.length > 0 && (
              <span className="ml-2 min-w-[18px] h-[18px] inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">{pendingClasses.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          {pendingClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Không có học phí nào cần thanh toán.</p>
          ) : (
            pendingClasses.map(cls => (
              <div key={cls.id} className="flex items-center gap-3 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                <img src={cls.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.tutorName} • {cls.childName}</p>
                  <p className="text-xs text-muted-foreground">{cls.completedSessions}/{cls.totalSessions} buổi{cls.dueDate ? ` • Hạn: ${cls.dueDate}` : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">{cls.fee.toLocaleString("vi-VN")}đ</p>
                  <Button size="sm" className="rounded-xl text-xs mt-1" disabled={walletBalance < cls.fee} onClick={() => handlePay(cls)}>Thanh toán</Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Tìm giao dịch..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
          </div>
          <div className="space-y-2">
            {filteredTxns.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  {t.amount > 0 ? <ArrowDownLeft className="w-4 h-4 text-foreground" /> : <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{t.description}</p>
                  <p className="text-[11px] text-muted-foreground">{t.date}</p>
                </div>
                <p className={cn("text-sm font-semibold", t.amount > 0 ? "text-foreground" : "text-muted-foreground")}>
                  {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("vi-VN")}đ
                </p>
                <Badge variant="outline" className="text-[10px]">{t.status === "completed" ? "Hoàn thành" : "Đang xử lý"}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 py-2">
        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Secure Payment • MoMo • VNPay • Ngân hàng</span>
      </div>

      {/* Deposit Dialog with Payment Methods */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nạp tiền vào ví</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Số tiền</label>
              <Input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Nhập số tiền" className="mt-1 rounded-xl" />
              <div className="flex gap-2 mt-2">
                {[500000, 1000000, 2000000, 5000000].map(v => (
                  <button key={v} onClick={() => setDepositAmt(String(v))} className="px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-primary/10 hover:text-primary transition-colors">{(v / 1000000).toFixed(1)}tr</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Phương thức thanh toán</label>
              <div className="space-y-2 mt-2">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50")}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><CreditCard className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleDeposit} disabled={!depositAmt || parseInt(depositAmt) <= 0 || !selectedMethod} className="w-full rounded-xl">Xác nhận nạp tiền</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Rút tiền từ ví</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Số dư khả dụng: <strong className="text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</strong></p>
            <div>
              <label className="text-xs font-medium text-foreground">Số tiền</label>
              <Input type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} placeholder="Nhập số tiền" className="mt-1 rounded-xl" />
              <div className="flex gap-2 mt-2">
                {[500000, 1000000, 2000000, 5000000].map(v => (
                  <button key={v} onClick={() => setWithdrawAmt(String(v))} className="px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-primary/10 hover:text-primary transition-colors">{(v / 1000000).toFixed(1)}tr</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Phương thức nhận tiền</label>
              <div className="space-y-2 mt-2">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50")}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><CreditCard className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleWithdraw} disabled={!withdrawAmt || parseInt(withdrawAmt) <= 0 || !selectedMethod || parseInt(withdrawAmt) > walletBalance} className="w-full rounded-xl">Xác nhận rút tiền</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentWallet;
