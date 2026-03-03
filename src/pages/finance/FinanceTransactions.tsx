import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeftRight, Download, Eye, Search, Filter, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, string> = {
  tuition: "Học phí", salary: "Lương", withdrawal: "Rút tiền", deposit: "Nạp tiền", "exam-fee": "Phí thi", refund: "Hoàn tiền",
};

const typeColors: Record<string, string> = {
  tuition: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  salary: "bg-blue-500/10 text-blue-700 border-blue-200",
  withdrawal: "bg-orange-500/10 text-orange-700 border-orange-200",
  deposit: "bg-purple-500/10 text-purple-700 border-purple-200",
  "exam-fee": "bg-amber-500/10 text-amber-700 border-amber-200",
  refund: "bg-red-500/10 text-red-700 border-red-200",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Hoàn thành", variant: "default" },
  pending: { label: "Chờ xử lý", variant: "outline" },
  failed: { label: "Thất bại", variant: "destructive" },
  refunded: { label: "Đã hoàn", variant: "secondary" },
};

const FinanceTransactions = () => {
  const { transactions } = useFinance();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchDate = !dateFilter || t.date.includes(dateFilter);
    return matchSearch && matchType && matchStatus && matchDate;
  });

  const totalIn = transactions.filter(t => (t.type === "tuition" || t.type === "deposit" || t.type === "exam-fee") && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => (t.type === "salary" || t.type === "withdrawal" || t.type === "refund") && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === "pending").length;

  const detail = transactions.find(t => t.id === detailId);

  const exportTransactions = (format: string) => {
    toast({ title: `Đã xuất danh sách giao dịch (${format})` });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowUpRight className="w-4 h-4 text-emerald-600" /><span className="text-xs text-muted-foreground">Tổng thu</span></div>
          <p className="text-xl font-bold text-emerald-600">+{totalIn.toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowDownRight className="w-4 h-4 text-red-600" /><span className="text-xs text-muted-foreground">Tổng chi</span></div>
          <p className="text-xl font-bold text-red-600">-{totalOut.toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-blue-600" /><span className="text-xs text-muted-foreground">Lợi nhuận</span></div>
          <p className="text-xl font-bold text-foreground">{(totalIn - totalOut).toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-amber-600" /><span className="text-xs text-muted-foreground">Chờ xử lý</span></div>
          <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
        </CardContent></Card>
      </div>

      {/* Transaction Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><ArrowLeftRight className="w-4 h-4" /> Danh sách giao dịch ({filtered.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => exportTransactions("PDF")}>
                  <Download className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => exportTransactions("Excel")}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Excel
                </Button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tìm theo mô tả, người dùng..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm rounded-xl" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue placeholder="Loại" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="tuition">Học phí</SelectItem>
                  <SelectItem value="salary">Lương</SelectItem>
                  <SelectItem value="withdrawal">Rút tiền</SelectItem>
                  <SelectItem value="deposit">Nạp tiền</SelectItem>
                  <SelectItem value="exam-fee">Phí thi</SelectItem>
                  <SelectItem value="refund">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Lọc ngày (VD: 03/03)" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-36 h-9 text-sm rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => {
                  const sCfg = statusConfig[t.status];
                  const isIncome = t.type === "tuition" || t.type === "deposit" || t.type === "exam-fee";
                  return (
                    <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailId(t.id)}>
                      <TableCell className="font-medium text-sm">{t.description}</TableCell>
                      <TableCell className="text-sm">{t.user}</TableCell>
                      <TableCell className="text-sm">{t.userRole}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${typeColors[t.type] || ""}`}>{typeLabels[t.type]}</Badge>
                      </TableCell>
                      <TableCell className={`text-sm font-medium ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                        {isIncome ? "+" : "-"}{t.amount.toLocaleString("vi-VN")}đ
                      </TableCell>
                      <TableCell className="text-sm">{t.date}</TableCell>
                      <TableCell><Badge variant={sCfg.variant}>{sCfg.label}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); setDetailId(t.id); }}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Không tìm thấy giao dịch nào</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết giao dịch</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-muted/50 rounded-xl text-center">
                <p className={`text-2xl font-bold ${(detail.type === "tuition" || detail.type === "deposit" || detail.type === "exam-fee") ? "text-emerald-600" : "text-red-600"}`}>
                  {(detail.type === "tuition" || detail.type === "deposit" || detail.type === "exam-fee") ? "+" : "-"}{detail.amount.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-sm text-muted-foreground mt-1">{detail.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Mã giao dịch</Label><p className="text-sm font-mono font-medium text-foreground">{detail.id.toUpperCase()}</p></div>
                <div><Label className="text-xs text-muted-foreground">Loại</Label><div className="mt-1"><Badge variant="outline" className={typeColors[detail.type]}>{typeLabels[detail.type]}</Badge></div></div>
                <div><Label className="text-xs text-muted-foreground">Người dùng</Label><p className="text-sm font-medium text-foreground">{detail.user}</p></div>
                <div><Label className="text-xs text-muted-foreground">Vai trò</Label><p className="text-sm font-medium text-foreground">{detail.userRole}</p></div>
                <div><Label className="text-xs text-muted-foreground">Ngày giao dịch</Label><p className="text-sm font-medium text-foreground">{detail.date}</p></div>
                <div><Label className="text-xs text-muted-foreground">Trạng thái</Label><div className="mt-1"><Badge variant={statusConfig[detail.status].variant}>{statusConfig[detail.status].label}</Badge></div></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceTransactions;
