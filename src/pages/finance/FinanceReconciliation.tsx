import { useMemo } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

const FinanceReconciliation = () => {
  const { transactions, withdrawals } = useFinance();
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  const pageCount = Math.max(1, Math.ceil(transactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="overview-surface border-primary/10"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Đã thu</p><p className="text-xl font-bold text-primary">{summary.totalIn.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card className="overview-surface border-success/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Đã chi</p><p className="text-xl font-bold text-success">{summary.totalOut.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card className="overview-surface border-warning/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Khoản treo</p><p className="text-xl font-bold text-warning">{summary.pending.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card className="overview-surface border-warning/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Chờ chi trả GS</p><p className="text-xl font-bold text-warning">{summary.pendingWithdraw.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card className="overview-surface border-info/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Chênh lệch</p><p className="text-xl font-bold text-info">{summary.delta.toLocaleString("vi-VN")}đ</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Scale className="w-4 h-4" /> Nhật ký đối soát</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mô tả</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái đối soát</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm font-medium">{tx.description}</TableCell>
                  <TableCell className="text-sm">{tx.user}</TableCell>
                  <TableCell className="text-sm">{tx.date}</TableCell>
                  <TableCell className="text-sm">{tx.amount.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                      <Badge variant={tx.status === "completed" ? "success" : "warning"}>{tx.status === "completed" ? "Khớp" : "Cần kiểm tra"}</Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} /></PaginationItem>
              {Array.from({ length: pageCount }).map((_, idx) => (
                <PaginationItem key={idx}><PaginationLink href="#" isActive={currentPage === idx + 1} onClick={(e) => { e.preventDefault(); setPage(idx + 1); }}>{idx + 1}</PaginationLink></PaginationItem>
              ))}
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pageCount, p + 1)); }} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceReconciliation;