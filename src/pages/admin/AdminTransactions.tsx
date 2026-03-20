import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, TrendingUp, Wallet, Receipt, Search, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const typeLabel: Record<string, string> = { tuition: "Học phí", salary: "Lương gia sư", "exam-fee": "Phí thi thử" };
const typeColor: Record<string, string> = {
  tuition: "bg-primary/10 text-primary",
  salary: "bg-emerald-500/10 text-emerald-600",
  "exam-fee": "bg-amber-500/10 text-amber-600",
};
const statusLabel: Record<string, string> = { completed: "Hoàn thành", pending: "Đang xử lý", failed: "Thất bại", refunded: "Hoàn tiền" };
const statusColor: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-primary/10 text-primary",
};

const AdminTransactions = () => {
  const { transactions, users, settings } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [period, setPeriod] = useState("month");
  const { toast } = useToast();

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const escrowProfit = Math.round(totalRevenue * settings.escrowPercent / 100);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  const filtered = transactions.filter(t => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (search) {
      const user = users.find(u => u.id === t.userId);
      const q = search.toLowerCase();
      if (!t.description.toLowerCase().includes(q) && !(user?.name.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const stats = [
    { label: "Tổng giao dịch", value: transactions.length, icon: Receipt, color: "bg-primary/10 text-primary" },
    { label: "Tổng doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, color: "bg-emerald-500/10 text-emerald-600" },
    { label: `Lợi nhuận (${settings.escrowPercent}%)`, value: `${(escrowProfit / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "bg-secondary/20 text-secondary-foreground" },
    { label: "Đang chờ xử lý", value: `${(pendingAmount / 1000000).toFixed(1)}M`, icon: Wallet, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc mô tả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-card border-border"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Loại giao dịch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="tuition">Học phí</SelectItem>
            <SelectItem value="salary">Lương gia sư</SelectItem>
            <SelectItem value="exam-fee">Phí thi thử</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="pending">Đang xử lý</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
            <SelectItem value="refunded">Hoàn tiền</SelectItem>
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Theo tháng</SelectItem>
            <SelectItem value="year">Theo năm</SelectItem>
            <SelectItem value="custom">Khoảng tùy chọn</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => toast({ title: "Đã xuất dữ liệu giao dịch" })}
          className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Người thanh toán</TableHead>
                <TableHead className="font-semibold">Loại</TableHead>
                <TableHead className="font-semibold">Số tiền</TableHead>
                <TableHead className="font-semibold">Ngày</TableHead>
                <TableHead className="font-semibold">Mô tả</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user && <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" />}
                        <span className="text-sm font-medium text-foreground">{user?.name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${typeColor[tx.type]}`}>
                        {typeLabel[tx.type]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">{tx.amount.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{tx.description}</TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColor[tx.status]}`}>
                        {statusLabel[tx.status]}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Không tìm thấy giao dịch</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
