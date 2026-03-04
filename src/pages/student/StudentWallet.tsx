import { useStudent } from "@/contexts/StudentContext";
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, CreditCard, ShieldCheck, Search, Download, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const typeLabels: Record<string, string> = {
  deposit: "Nạp tiền",
  tuition_payment: "Học phí",
  mock_exam_purchase: "Mua đề thi",
  refund: "Hoàn tiền",
  withdrawal: "Rút tiền",
};

const paymentMethods = [
  { id: "momo", name: "MoMo", desc: "Ví điện tử MoMo" },
  { id: "vnpay", name: "VNPay", desc: "Cổng thanh toán VNPay" },
  { id: "vietcombank", name: "Vietcombank", desc: "Ngân hàng Vietcombank" },
  { id: "techcombank", name: "Techcombank", desc: "Ngân hàng Techcombank" },
];

const CHART_COLORS = [
  "hsl(224, 76%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
];

const StudentWallet = () => {
  const { walletBalance, walletTransactions, depositToWallet, payTuition, classes, withdrawFromWallet } = useStudent();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showPayTuition, setShowPayTuition] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Pending tuition: active classes that haven't been fully paid this month
  const pendingTuitions = classes
    .filter(c => c.status === "active")
    .map(c => {
      const paid = walletTransactions.some(
        t => t.type === "tuition_payment" && t.relatedId === c.id && t.date >= "2026-03-01"
      );
      return { ...c, paid };
    })
    .filter(c => !c.paid);

  const filtered = walletTransactions
    .filter(t => typeFilter === "all" || t.type === typeFilter)
    .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalDeposited = walletTransactions.filter(t => t.type === "deposit" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalSpent = Math.abs(walletTransactions.filter(t => t.amount < 0 && t.status === "completed").reduce((s, t) => s + t.amount, 0));
  const totalRefunded = walletTransactions.filter(t => t.type === "refund" && t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const spendingByType = [
    { name: "Học phí", value: Math.abs(walletTransactions.filter(t => t.type === "tuition_payment").reduce((s, t) => s + t.amount, 0)) },
    { name: "Đề thi", value: Math.abs(walletTransactions.filter(t => t.type === "mock_exam_purchase").reduce((s, t) => s + t.amount, 0)) },
  ].filter(d => d.value > 0);

  const monthlyData = (() => {
    const map = new Map<string, number>();
    walletTransactions.filter(t => t.amount < 0).forEach(t => {
      const m = t.date.slice(0, 7);
      map.set(m, (map.get(m) || 0) + Math.abs(t.amount));
    });
    return Array.from(map.entries()).sort().slice(-6).map(([m, v]) => ({ month: m.replace("2026-", "T").replace("2025-", "T"), amount: v }));
  })();

  const handleDeposit = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0 || !selectedMethod) return;
    const method = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
    depositToWallet(amt, method);
    toast.success(`Nạp ${amt.toLocaleString("vi-VN")}đ thành công qua ${method}!`);
    setShowDeposit(false);
    setAmount("");
    setSelectedMethod("");
  };

  const handlePayTuitionItem = (cls: typeof classes[0]) => {
    if (walletBalance < cls.fee) {
      toast.error("Số dư ví không đủ. Vui lòng nạp thêm tiền.");
      return;
    }
    payTuition(cls.id, cls.fee, `Thanh toán học phí - ${cls.name}`);
    toast.success(`Đã thanh toán ${cls.fee.toLocaleString("vi-VN")}đ cho ${cls.name}`);
  };

  const handleExportPDF = () => {
    toast.success("Đang xuất file lịch sử giao dịch...");
    setTimeout(() => {
      const content = [
        "LỊCH SỬ GIAO DỊCH - VÍ HỌC PHÍ EDUCONNECT",
        `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`,
        `Số dư hiện tại: ${walletBalance.toLocaleString("vi-VN")}đ`,
        "",
        "STT | Ngày | Loại | Mô tả | Số tiền | Trạng thái",
        ...filtered.map((t, i) => `${i + 1} | ${t.date} | ${typeLabels[t.type]} | ${t.description} | ${t.amount > 0 ? "+" : ""}${t.amount.toLocaleString("vi-VN")}đ | ${t.status === "completed" ? "Hoàn thành" : "Đang xử lý"}`),
      ].join("\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vi-hoc-phi-${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Đã xuất file thành công!");
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Wallet className="w-5 h-5 text-foreground" /></div>
            <span className="text-xs text-muted-foreground">Số dư ví</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</p>
          <div className="flex gap-2 mt-3">
            <Button onClick={() => setShowDeposit(true)} className="flex-1 rounded-xl gap-1" size="sm">
              <Plus className="w-3.5 h-3.5" /> Nạp tiền
            </Button>
            <Button onClick={() => setShowPayTuition(true)} variant="outline" className="flex-1 rounded-xl gap-1" size="sm">
              <Receipt className="w-3.5 h-3.5" /> Thanh toán
            </Button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><ArrowDownLeft className="w-5 h-5 text-foreground" /></div>
            <span className="text-xs text-muted-foreground">Tổng nạp</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalDeposited.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-foreground" /></div>
            <span className="text-xs text-muted-foreground">Tổng chi</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSpent.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><CreditCard className="w-5 h-5 text-foreground" /></div>
            <span className="text-xs text-muted-foreground">Hoàn tiền</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalRefunded.toLocaleString("vi-VN")}đ</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Chi tiêu theo tháng</h3>
          {monthlyData.length > 0 ? (
            <ChartContainer config={{ amount: { label: "Chi tiêu", color: "hsl(224, 76%, 48%)" } }} className="h-[200px] w-full">
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}tr`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Phân bổ chi tiêu</h3>
          {spendingByType.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={spendingByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                      {spendingByType.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {spendingByType.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">{d.value.toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-foreground">Lịch sử giao dịch</h3>
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1" onClick={handleExportPDF}>
            <Download className="w-3.5 h-3.5" /> Xuất file
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Tìm giao dịch..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {[{ label: "Tất cả", value: "all" }, { label: "Nạp tiền", value: "deposit" }, { label: "Học phí", value: "tuition_payment" }, { label: "Đề thi", value: "mock_exam_purchase" }, { label: "Hoàn tiền", value: "refund" }].map(f => (
              <button key={f.value} onClick={() => setTypeFilter(f.value)} className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-colors", typeFilter === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted")}>
                {t.amount > 0 ? <ArrowDownLeft className="w-4 h-4 text-foreground" /> : <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{t.description}</p>
                <p className="text-[11px] text-muted-foreground">{t.date} • {typeLabels[t.type]}{t.paymentMethod ? ` • ${t.paymentMethod}` : ""}</p>
              </div>
              <p className={cn("text-sm font-semibold", t.amount > 0 ? "text-foreground" : "text-muted-foreground")}>
                {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("vi-VN")}đ
              </p>
              <Badge variant="outline" className="text-[10px]">
                {t.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
              </Badge>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có giao dịch nào</p>}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 py-4">
        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Secure Payment • MoMo • VNPay • Ngân hàng</span>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nạp tiền vào ví</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Số tiền</label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 rounded-xl" placeholder="Nhập số tiền" />
              <div className="flex gap-2 mt-2">
                {[100000, 200000, 500000, 1000000, 2000000].map(v => (
                  <button key={v} onClick={() => setAmount(String(v))} className="px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-primary/10 hover:text-primary transition-colors">{(v / 1000).toFixed(0)}k</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Phương thức thanh toán</label>
              <div className="space-y-2 mt-2">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all", selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50")}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><CreditCard className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleDeposit} disabled={!amount || parseInt(amount) <= 0 || !selectedMethod} className="w-full rounded-xl">
              Xác nhận nạp tiền
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pay Tuition Dialog */}
      <Dialog open={showPayTuition} onOpenChange={setShowPayTuition}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Thanh toán học phí</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">Số dư ví: <span className="font-semibold text-foreground">{walletBalance.toLocaleString("vi-VN")}đ</span></p>
            {pendingTuitions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Không có học phí nào cần thanh toán tháng này.</p>
            ) : (
              pendingTuitions.map(cls => (
                <div key={cls.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <img src={cls.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cls.name}</p>
                    <p className="text-[11px] text-muted-foreground">{cls.tutorName} • {cls.schedule}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{cls.fee.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl text-xs"
                    disabled={walletBalance < cls.fee}
                    onClick={() => handlePayTuitionItem(cls)}
                  >
                    Thanh toán
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentWallet;
