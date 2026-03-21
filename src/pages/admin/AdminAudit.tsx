import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText, Shield, Clock, User } from "lucide-react";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const actionColor: Record<string, string> = {
  "Duyệt tài khoản": "bg-success/150/10 text-success",
  "Từ chối tài khoản": "bg-destructive/10 text-destructive",
  "Xóa người dùng": "bg-destructive/10 text-destructive",
  "Tạo lớp học": "bg-primary/10 text-primary",
  "Cập nhật lớp học": "bg-warning/150/10 text-warning",
  "Xóa lớp học": "bg-destructive/10 text-destructive",
  "Tạo bài test": "bg-primary/10 text-primary",
  "Cập nhật bài test": "bg-warning/150/10 text-warning",
  "Xóa bài test": "bg-destructive/10 text-destructive",
  "Cập nhật cài đặt": "bg-muted text-muted-foreground",
  "Thêm giao dịch": "bg-success/150/10 text-success",
};

const AdminAudit = () => {
  const { auditLog } = useAdmin();
  const [period, setPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const parseDate = (timestamp: string) => {
    const [datePart] = timestamp.split(" ");
    if (datePart.includes("/")) {
      const [d, m, y] = datePart.split("/");
      return new Date(`${y}-${m}-${d}`);
    }
    return new Date(datePart);
  };

  const filtered = useMemo(() => auditLog.filter((log) => {
    const date = parseDate(log.timestamp);
    if (Number.isNaN(date.getTime())) return false;
    if (period === "month") return date.getMonth() + 1 === Number(selectedMonth) && date.getFullYear() === Number(selectedYear);
    if (period === "year") return date.getFullYear() === Number(selectedYear);
    if (period === "custom") {
      if (!fromDate || !toDate) return true;
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return date >= from && date <= to;
    }
    return true;
  }), [auditLog, period, selectedMonth, selectedYear, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.length}</p>
              <p className="text-xs text-muted-foreground">Tổng log</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/150/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.filter(l => l.action.includes("Duyệt")).length}</p>
              <p className="text-xs text-muted-foreground">Phê duyệt</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <User className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.filter(l => l.action.includes("Xóa")).length}</p>
              <p className="text-xs text-muted-foreground">Xóa dữ liệu</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={period} onValueChange={(v) => { setPeriod(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Theo tháng</SelectItem>
            <SelectItem value="year">Theo năm</SelectItem>
            <SelectItem value="custom">Khoảng tùy chọn</SelectItem>
          </SelectContent>
        </Select>
        {period === "month" && (
          <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setPage(1); }}>
            <SelectTrigger className="w-32 h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, "0");
                return <SelectItem key={month} value={month}>Tháng {i + 1}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        )}
        {(period === "month" || period === "year") && (
          <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setPage(1); }}>
            <SelectTrigger className="w-28 h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["2024", "2025", "2026", "2027"].map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {period === "custom" && (
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="h-10 rounded-xl" />
            <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="h-10 rounded-xl" />
          </div>
        )}
      </div>

      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Thời gian</TableHead>
                <TableHead className="font-semibold">Người thực hiện</TableHead>
                <TableHead className="font-semibold">Hành động</TableHead>
                <TableHead className="font-semibold">Đối tượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(log => (
                <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">{log.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{log.actor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${actionColor[log.action] || "bg-muted text-muted-foreground"}`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.target}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Chưa có log nào</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminAudit;
