import { useState } from "react";
import { useTutor, type RefundRequest } from "@/contexts/TutorContext";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, X, Clock, Search, Filter, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ModerationLog {
  id: string;
  refundId: string;
  action: "approved" | "rejected";
  by: string;
  reason: string;
  timestamp: string;
}

const statusLabels: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20",
  approved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
  rejected: "bg-destructive/10 text-destructive",
};

const FinanceRefunds = () => {
  const { refundRequests } = useTutor();
  const { profile } = useFinance();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [processDialog, setProcessDialog] = useState<{ request: RefundRequest; action: "approve" | "reject" } | null>(null);
  const [processNote, setProcessNote] = useState("");
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Since refundRequests lives in TutorContext (readonly from finance perspective in demo),
  // we track local overrides for processed status
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status: "approved" | "rejected"; note: string; processedAt: string }>>({});

  const getEffectiveStatus = (r: RefundRequest) => localOverrides[r.id]?.status || r.status;

  const filtered = refundRequests
    .filter(r => filterStatus === "all" || getEffectiveStatus(r) === filterStatus)
    .filter(r => !search || r.tutorName.toLowerCase().includes(search.toLowerCase()) || r.className.toLowerCase().includes(search.toLowerCase()));

  const pendingCount = refundRequests.filter(r => getEffectiveStatus(r) === "pending").length;

  const handleProcess = () => {
    if (!processDialog || !processNote.trim()) {
      toast.error("Vui lòng nhập lý do xử lý");
      return;
    }
    const { request, action } = processDialog;
    const now = new Date().toLocaleString("vi-VN");
    setLocalOverrides(prev => ({
      ...prev,
      [request.id]: {
        status: action === "approve" ? "approved" : "rejected",
        note: processNote.trim(),
        processedAt: now,
      }
    }));
    setLogs(prev => [...prev, {
      id: `log-${Date.now()}`,
      refundId: request.id,
      action: action === "approve" ? "approved" : "rejected",
      by: profile.name,
      reason: processNote.trim(),
      timestamp: now,
    }]);
    toast.success(action === "approve" ? "Đã duyệt hoàn tiền" : "Đã từ chối hoàn tiền");
    setProcessDialog(null);
    setProcessNote("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <span className="text-xs text-muted-foreground">Chờ duyệt</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Check className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-xs text-muted-foreground">Đã duyệt</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{refundRequests.filter(r => getEffectiveStatus(r) === "approved").length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><X className="w-5 h-5 text-destructive" /></div>
            <span className="text-xs text-muted-foreground">Từ chối</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{refundRequests.filter(r => getEffectiveStatus(r) === "rejected").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Danh sách yêu cầu hoàn tiền</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm gia sư, lớp..."
                className="pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-1">
              {[{ label: "Tất cả", value: "all" }, { label: "Chờ duyệt", value: "pending" }, { label: "Đã duyệt", value: "approved" }, { label: "Từ chối", value: "rejected" }].map(f => (
                <button key={f.value} onClick={() => setFilterStatus(f.value)}
                  className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                    filterStatus === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}>{f.label}</button>
              ))}
            </div>
            <button onClick={() => setShowLogs(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <FileText className="w-3.5 h-3.5" /> Log
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Không có yêu cầu hoàn tiền nào</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const status = getEffectiveStatus(r);
              const override = localOverrides[r.id];
              return (
                <div key={r.id} className="border border-border rounded-xl p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{r.tutorName}</p>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium", statusColors[status])}>
                          {statusLabels[status]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Lớp: <strong>{r.className}</strong> • Môn: {r.subject} • HS: {r.studentName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Số tiền: <strong className="text-foreground">{r.amount.toLocaleString("vi-VN")}đ</strong> / Escrow chưa giải ngân: {r.maxAmount.toLocaleString("vi-VN")}đ</p>
                      <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground"><strong>Lý do:</strong> {r.reason}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">Ngày tạo: {r.createdAt}</p>
                      {override && (
                        <div className="mt-2 p-2 bg-primary/5 border border-primary/10 rounded-lg">
                          <p className="text-xs text-muted-foreground"><strong>Ghi chú KT:</strong> {override.note}</p>
                          <p className="text-[10px] text-muted-foreground/70">Xử lý bởi {profile.name} lúc {override.processedAt}</p>
                        </div>
                      )}
                    </div>
                    {status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setProcessDialog({ request: r, action: "approve" }); setProcessNote(""); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors">
                          <Check className="w-3.5 h-3.5" /> Duyệt
                        </button>
                        <button onClick={() => { setProcessDialog({ request: r, action: "reject" }); setProcessNote(""); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-xl text-xs font-medium hover:bg-destructive/90 transition-colors">
                          <X className="w-3.5 h-3.5" /> Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Process Dialog */}
      <Dialog open={!!processDialog} onOpenChange={() => setProcessDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {processDialog?.action === "approve"
                ? <><Check className="w-5 h-5 text-emerald-600" /> Duyệt hoàn tiền</>
                : <><X className="w-5 h-5 text-destructive" /> Từ chối hoàn tiền</>}
            </DialogTitle>
          </DialogHeader>
          {processDialog && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-sm font-medium text-foreground">{processDialog.request.className}</p>
                <p className="text-xs text-muted-foreground">
                  Gia sư: {processDialog.request.tutorName} • Số tiền: {processDialog.request.amount.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">
                  Lý do {processDialog.action === "approve" ? "duyệt" : "từ chối"} <span className="text-destructive">*</span>
                </label>
                <textarea value={processNote} onChange={e => setProcessNote(e.target.value)}
                  placeholder={processDialog.action === "approve" ? "Nhập lý do duyệt hoàn tiền..." : "Nhập lý do từ chối..."}
                  className="w-full mt-2 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={500}
                />
              </div>
              {processDialog.action === "approve" && (
                <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">Sau khi duyệt, hệ thống sẽ hoàn {processDialog.request.amount.toLocaleString("vi-VN")}đ về ví phụ huynh/học sinh và cập nhật Escrow.</p>
                </div>
              )}
              <button onClick={handleProcess} disabled={!processNote.trim()}
                className={cn("w-full py-2.5 rounded-xl font-medium disabled:opacity-50 transition-colors",
                  processDialog.action === "approve"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                )}>
                {processDialog.action === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Nhật ký xử lý hoàn tiền</DialogTitle></DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có log nào</p>
            ) : (
              logs.map(log => {
                const req = refundRequests.find(r => r.id === log.refundId);
                return (
                  <div key={log.id} className="p-3 border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium", statusColors[log.action])}>
                        {log.action === "approved" ? "Đã duyệt" : "Từ chối"}
                      </span>
                      <span className="text-xs font-medium text-foreground">{req?.className || log.refundId}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Người xử lý: <strong>{log.by}</strong></p>
                    <p className="text-xs text-muted-foreground">Lý do: {log.reason}</p>
                    <p className="text-[10px] text-muted-foreground/70">{log.timestamp}</p>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceRefunds;
