import { useState } from "react";
import { useTutor, type RefundRequest } from "@/contexts/TutorContext";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, X, Clock, Search, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ModerationLog { id: string; refundId: string; action: "approved" | "rejected"; by: string; reason: string; timestamp: string; }

const statusLabels: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };
const statusColors: Record<string, string> = { pending: "bg-warning/15 text-warning dark:bg-amber-900/20", approved: "bg-success/15 text-success dark:bg-emerald-900/20", rejected: "bg-destructive/10 text-destructive" };

const MOCK_DATA: RefundRequest[] = [
  { id: "rf-s1", classId: "c1", className: "Toán 12 - Ôn thi ĐH", tutorId: "u1", tutorName: "Nguyễn Văn An", amount: 1200000, maxAmount: 1200000, reason: "Phụ huynh yêu cầu dừng lớp", status: "pending", createdAt: "04/03/2026 09:15", studentName: "Lê Minh Châu", subject: "Toán" },
  { id: "rf-s2", classId: "tc2", className: "Sinh 11 - Nâng cao", tutorId: "t1", tutorName: "Trần Thị Bích Ngọc", amount: 800000, maxAmount: 2000000, reason: "Lớp học bị hủy do học sinh không tham gia", status: "pending", createdAt: "03/03/2026 14:30", studentName: "Lê Hoàng Nam", subject: "Sinh" },
  { id: "rf-s3", classId: "c3", className: "IELTS Writing", tutorId: "u1", tutorName: "Nguyễn Văn An", amount: 3000000, maxAmount: 3000000, reason: "Gia sư không thể tiếp tục giảng dạy", status: "pending", createdAt: "02/03/2026 10:00", studentName: "Trương Văn Kiên", subject: "Anh" },
  { id: "rf-s4", classId: "tc1", className: "Hóa 12 - Ôn thi ĐH", tutorId: "t1", tutorName: "Trần Thị Bích Ngọc", amount: 1680000, maxAmount: 1680000, reason: "Chất lượng không đạt yêu cầu - đồng thuận hoàn tiền", status: "approved", createdAt: "28/02/2026 08:45", studentName: "Nguyễn Thị Mai", subject: "Hóa", processedAt: "01/03/2026 10:20", processedBy: "Lê Thị Hương", processNote: "Đã xác nhận với phụ huynh, đồng ý hoàn toàn bộ escrow chưa giải ngân" },
  { id: "rf-s5", classId: "c5", className: "Lý 10 - Cơ bản", tutorId: "u2", tutorName: "Đỗ Quang Minh", amount: 500000, maxAmount: 1500000, reason: "Lịch học không phù hợp, không thể sắp xếp lại", status: "approved", createdAt: "25/02/2026 16:00", studentName: "Phạm Đức Anh", subject: "Lý", processedAt: "26/02/2026 09:30", processedBy: "Lê Thị Hương", processNote: "Hoàn một phần theo yêu cầu gia sư, phụ huynh đồng ý" },
  { id: "rf-s6", classId: "tc3", className: "Sinh 10 - Cơ bản", tutorId: "t1", tutorName: "Trần Thị Bích Ngọc", amount: 1600000, maxAmount: 1600000, reason: "Phụ huynh yêu cầu dừng lớp", status: "rejected", createdAt: "22/02/2026 11:20", studentName: "Trần Minh Quân", subject: "Sinh", processedAt: "23/02/2026 14:00", processedBy: "Lê Thị Hương", processNote: "Lớp đã hoàn thành 4/16 buổi, phụ huynh chưa xác nhận dừng. Cần phụ huynh gửi yêu cầu trực tiếp." },
  { id: "rf-s7", classId: "c6", className: "Toán 11 - Hàm số", tutorId: "u3", tutorName: "Hoàng Đức Em", amount: 2000000, maxAmount: 2000000, reason: "Lớp học bị hủy do học sinh không tham gia", status: "rejected", createdAt: "20/02/2026 09:00", studentName: "Võ Thị Hồng", subject: "Toán", processedAt: "21/02/2026 11:45", processedBy: "Lê Thị Hương", processNote: "Học sinh vẫn tham gia đầy đủ theo hệ thống điểm danh. Yêu cầu không hợp lệ." },
];

const MOCK_LOGS: ModerationLog[] = [
  { id: "log-seed1", refundId: "rf-s4", action: "approved", by: "Lê Thị Hương", reason: "Đã xác nhận với phụ huynh, đồng ý hoàn toàn bộ escrow chưa giải ngân", timestamp: "01/03/2026 10:20" },
  { id: "log-seed2", refundId: "rf-s5", action: "approved", by: "Lê Thị Hương", reason: "Hoàn một phần theo yêu cầu gia sư, phụ huynh đồng ý", timestamp: "26/02/2026 09:30" },
  { id: "log-seed3", refundId: "rf-s6", action: "rejected", by: "Lê Thị Hương", reason: "Lớp đã hoàn thành 4/16 buổi, phụ huynh chưa xác nhận dừng.", timestamp: "23/02/2026 14:00" },
  { id: "log-seed4", refundId: "rf-s7", action: "rejected", by: "Lê Thị Hương", reason: "Học sinh vẫn tham gia đầy đủ. Yêu cầu không hợp lệ.", timestamp: "21/02/2026 11:45" },
];

const FinanceRefunds = () => {
  const { refundRequests: live } = useTutor();
  const { profile } = useFinance();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [processDialog, setProcessDialog] = useState<{ request: RefundRequest; action: "approve" | "reject" } | null>(null);
  const [processNote, setProcessNote] = useState("");
  const [logs, setLogs] = useState<ModerationLog[]>(MOCK_LOGS);
  const [showLogs, setShowLogs] = useState(false);
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status: "approved" | "rejected"; note: string; processedAt: string }>>({});

  const allRefundRequests = [...MOCK_DATA, ...live];
  const gs = (r: RefundRequest) => localOverrides[r.id]?.status || r.status;
  const filtered = allRefundRequests.filter(r => filterStatus === "all" || gs(r) === filterStatus).filter(r => !search || r.tutorName.toLowerCase().includes(search.toLowerCase()) || r.className.toLowerCase().includes(search.toLowerCase()));
  const pendingCount = allRefundRequests.filter(r => gs(r) === "pending").length;

  const handleProcess = () => {
    if (!processDialog || !processNote.trim()) { toast.error("Vui lòng nhập lý do xử lý"); return; }
    const { request, action } = processDialog;
    const now = new Date().toLocaleString("vi-VN");
    setLocalOverrides(prev => ({ ...prev, [request.id]: { status: action === "approve" ? "approved" : "rejected", note: processNote.trim(), processedAt: now } }));
    setLogs(prev => [...prev, { id: `log-${Date.now()}`, refundId: request.id, action: action === "approve" ? "approved" : "rejected", by: profile.name, reason: processNote.trim(), timestamp: now }]);
    toast.success(action === "approve" ? "Đã duyệt hoàn tiền" : "Đã từ chối hoàn tiền");
    setProcessDialog(null); setProcessNote("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Chờ duyệt", count: pendingCount, icon: Clock, iconColor: "text-warning", bg: "bg-warning/15 dark:bg-amber-900/20" },
          { label: "Đã duyệt", count: allRefundRequests.filter(r => gs(r) === "approved").length, icon: Check, iconColor: "text-success", bg: "bg-success/15 dark:bg-emerald-900/20" },
          { label: "Từ chối", count: allRefundRequests.filter(r => gs(r) === "rejected").length, icon: X, iconColor: "text-destructive", bg: "bg-destructive/10" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}><s.icon className={cn("w-5 h-5", s.iconColor)} /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Danh sách yêu cầu hoàn tiền</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm gia sư, lớp..." className="pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-1">
              {[{ label: "Tất cả", value: "all" }, { label: "Chờ duyệt", value: "pending" }, { label: "Đã duyệt", value: "approved" }, { label: "Từ chối", value: "rejected" }].map(f => (
                <button key={f.value} onClick={() => setFilterStatus(f.value)} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors", filterStatus === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>{f.label}</button>
              ))}
            </div>
            <button onClick={() => setShowLogs(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"><FileText className="w-3.5 h-3.5" /> Log</button>
          </div>
        </div>
        {filtered.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Không có yêu cầu hoàn tiền nào</p> : (
          <div className="space-y-3">
            {filtered.map(r => {
              const st = gs(r); const ov = localOverrides[r.id];
              const pNote = ov?.note || r.processNote; const pAt = ov?.processedAt || r.processedAt; const pBy = ov ? profile.name : r.processedBy;
              return (
                <div key={r.id} className="border border-border rounded-xl p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{r.tutorName}</p>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium", statusColors[st])}>{statusLabels[st]}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Lớp: <strong>{r.className}</strong> • Môn: {r.subject} • HS: {r.studentName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Số tiền: <strong className="text-foreground">{r.amount.toLocaleString("vi-VN")}đ</strong> / Escrow chưa giải ngân: {r.maxAmount.toLocaleString("vi-VN")}đ</p>
                      <div className="mt-2 p-2 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground"><strong>Lý do:</strong> {r.reason}</p></div>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">Ngày tạo: {r.createdAt}</p>
                      {(st === "approved" || st === "rejected") && pNote && (
                        <div className="mt-2 p-2 bg-primary/5 border border-primary/10 rounded-lg">
                          <p className="text-xs text-muted-foreground"><strong>Ghi chú KT:</strong> {pNote}</p>
                          <p className="text-[10px] text-muted-foreground/70">Xử lý bởi {pBy} lúc {pAt}</p>
                        </div>
                      )}
                    </div>
                    {st === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setProcessDialog({ request: r, action: "approve" }); setProcessNote(""); }} className="flex items-center gap-1 px-3 py-1.5 bg-success text-white rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors"><Check className="w-3.5 h-3.5" /> Duyệt</button>
                        <button onClick={() => { setProcessDialog({ request: r, action: "reject" }); setProcessNote(""); }} className="flex items-center gap-1 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-xl text-xs font-medium hover:bg-destructive/90 transition-colors"><X className="w-3.5 h-3.5" /> Từ chối</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!processDialog} onOpenChange={() => setProcessDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2">{processDialog?.action === "approve" ? <><Check className="w-5 h-5 text-success" /> Duyệt hoàn tiền</> : <><X className="w-5 h-5 text-destructive" /> Từ chối hoàn tiền</>}</DialogTitle></DialogHeader>
          {processDialog && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-sm font-medium text-foreground">{processDialog.request.className}</p>
                <p className="text-xs text-muted-foreground">Gia sư: {processDialog.request.tutorName} • Số tiền: {processDialog.request.amount.toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Lý do {processDialog.action === "approve" ? "duyệt" : "từ chối"} <span className="text-destructive">*</span></label>
                <textarea value={processNote} onChange={e => setProcessNote(e.target.value)} placeholder={processDialog.action === "approve" ? "Nhập lý do duyệt hoàn tiền..." : "Nhập lý do từ chối..."} className="w-full mt-2 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" maxLength={500} />
              </div>
              {processDialog.action === "approve" && (
                <div className="flex gap-3 p-3 bg-warning/15 dark:bg-amber-900/10 border border-warning/30 dark:border-warning/40 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-warning dark:text-amber-400">Sau khi duyệt, hệ thống sẽ hoàn {processDialog.request.amount.toLocaleString("vi-VN")}đ về ví phụ huynh/học sinh và cập nhật Escrow.</p>
                </div>
              )}
              <button onClick={handleProcess} disabled={!processNote.trim()} className={cn("w-full py-2.5 rounded-xl font-medium disabled:opacity-50 transition-colors", processDialog.action === "approve" ? "bg-success text-white hover:bg-emerald-700" : "bg-destructive text-destructive-foreground hover:bg-destructive/90")}>{processDialog.action === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}</button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Nhật ký xử lý hoàn tiền</DialogTitle></DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {logs.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Chưa có log nào</p> : logs.map(log => {
              const req = allRefundRequests.find(r => r.id === log.refundId);
              return (
                <div key={log.id} className="p-3 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium", statusColors[log.action])}>{log.action === "approved" ? "Đã duyệt" : "Từ chối"}</span>
                    <span className="text-xs font-medium text-foreground">{req?.className || log.refundId}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Người xử lý: <strong>{log.by}</strong></p>
                  <p className="text-xs text-muted-foreground">Lý do: {log.reason}</p>
                  <p className="text-[10px] text-muted-foreground/70">{log.timestamp}</p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceRefunds;
