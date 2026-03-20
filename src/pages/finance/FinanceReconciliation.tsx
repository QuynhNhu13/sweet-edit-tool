import { useMemo } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";

const FinanceReconciliation = () => {
  const { transactions, withdrawals } = useFinance();

  const summary = useMemo(() => {
    const totalIn = transactions
      .filter((t) => (t.type === "tuition" || t.type === "deposit" || t.type === "exam-fee") && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0);
    const totalOut = transactions
      .filter((t) => (t.type === "salary" || t.type === "withdrawal" || t.type === "refund") && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
    const pendingWithdraw = withdrawals.filter((w) => w.status === "pending").reduce((s, w) => s + w.amount, 0);
    const delta = totalIn - totalOut - pending;

    return { totalIn, totalOut, pending, pendingWithdraw, delta };
  }, [transactions, withdrawals]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Đã thu</p><p className="text-xl font-bold text-foreground">{summary.totalIn.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Đã chi</p><p className="text-xl font-bold text-foreground">{summary.totalOut.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Khoản treo</p><p className="text-xl font-bold text-foreground">{summary.pending.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Chờ chi trả GS</p><p className="text-xl font-bold text-foreground">{summary.pendingWithdraw.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Chênh lệch</p><p className="text-xl font-bold text-foreground">{summary.delta.toLocaleString("vi-VN")}đ</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Scale className="w-4 h-4" /> Nhật ký đối soát</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
              <div>
                <p className="text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.user} · {tx.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {tx.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <AlertTriangle className="w-4 h-4 text-muted-foreground" />}
                <Badge variant={tx.status === "completed" ? "default" : "outline"}>{tx.status === "completed" ? "Khớp" : "Cần kiểm tra"}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceReconciliation;