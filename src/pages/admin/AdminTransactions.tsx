import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, Wallet, Receipt, Search, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const typeLabel: Record<string, string> = { tuition: "Học phí", salary: "Lương gia sư", "exam-fee": "Phí thi thử" };
const typeVariant: Record<string, "default" | "success" | "warning"> = {
  tuition: "default",
  salary: "success",
  "exam-fee": "warning",
};
const statusLabel: Record<string, string> = { completed: "Hoàn thành", pending: "Đang xử lý", failed: "Thất bại", refunded: "Hoàn tiền" };
const statusVariant: Record<string, "success" | "warning" | "destructive" | "info"> = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "info",
};

const ITEMS_PER_PAGE = 10;

const AdminTransactions = () => {
  const { transactions, users, settings } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [period, setPeriod] = useState("month");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);


  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const escrowProfit = Math.round(totalRevenue * settings.escrowPercent / 100);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Tổng giao dịch", value: transactions.length, icon: Receipt, bg: "from-blue-700 to-blue-900", iconBg: "bg-blue-100", iconColor: "text-blue-700" },
    { label: "Tổng doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, bg: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: `Lợi nhuận (${settings.escrowPercent}%)`, value: `${(escrowProfit / 1000000).toFixed(1)}M`, icon: TrendingUp, bg: "from-amber-500 to-orange-500", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Đang chờ xử lý", value: `${(pendingAmount / 1000000).toFixed(1)}M`, icon: Wallet, bg: "from-rose-500 to-pink-500", iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className={`border-0 shadow-soft bg-gradient-to-br ${s.bg} text-white`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg} backdrop-blur-sm`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/80">{s.label}</p>
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
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 h-10 rounded-xl bg-card border-border"
          />
        </div>
        <Select value={filterType} onValueChange={v => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-10 rounded-2xl bg-card border border-border shadow-sm"><SelectValue placeholder="Loại giao dịch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="tuition">Học phí</SelectItem>
            <SelectItem value="salary">Lương gia sư</SelectItem>
            <SelectItem value="exam-fee">Phí thi thử</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-10 rounded-2xl bg-card border border-border shadow-sm"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
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
        <Button
          variant="outline"
          onClick={() => toast({ title: "Đã xuất dữ liệu giao dịch" })}
          className="h-10 rounded-xl inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export
        </Button>
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
              {paginated.map(tx => {
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
                      <Badge variant={typeVariant[tx.type] ?? "default"}>
                        {typeLabel[tx.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">{tx.amount.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{tx.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[tx.status] ?? "outline"}>
                        {statusLabel[tx.status]}
                      </Badge>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-muted-foreground">Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
