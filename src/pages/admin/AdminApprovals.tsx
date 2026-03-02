import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, FileText, Phone, Mail, BookOpen } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminUser } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh" };

type TabValue = "pending" | "approved" | "rejected";

const AdminApprovals = () => {
  const { users, approveUser, rejectUser } = useAdmin();
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const { toast } = useToast();

  const tabs: { value: TabValue; label: string; count: number }[] = [
    { value: "pending", label: "Chờ duyệt", count: users.filter(u => u.status === "pending").length },
    { value: "approved", label: "Đã duyệt", count: users.filter(u => u.status === "approved").length },
    { value: "rejected", label: "Từ chối", count: users.filter(u => u.status === "rejected").length },
  ];

  const filtered = users.filter(u => u.status === activeTab);

  const handleApprove = (id: string) => {
    approveUser(id);
    toast({ title: "Đã duyệt tài khoản thành công" });
  };

  const handleReject = (id: string) => {
    rejectUser(id);
    toast({ title: "Đã từ chối tài khoản", variant: "destructive" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Pill tabs */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className={`min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold rounded-full px-1.5 ${
              activeTab === tab.value
                ? tab.value === "pending" ? "bg-destructive/10 text-destructive" : tab.value === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Không có tài khoản nào trong mục này.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <Card key={u.id} className="border-0 shadow-soft hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-border shrink-0" />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-base">{u.name}</p>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {roleLabel[u.role] || u.role}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{u.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{u.phone}</span>
                      {u.subject && <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Môn: {u.subject}</span>}
                    </div>

                    {u.bio && (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl">{u.bio}</p>
                    )}

                    {/* Attachments mock */}
                    {(u.role === "tutor" || u.role === "teacher") && (
                      <div className="flex gap-2 pt-1">
                        <button className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                          <FileText className="w-3.5 h-3.5" /> Bảng điểm
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                          <FileText className="w-3.5 h-3.5" /> Văn bằng
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {activeTab === "pending" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                        onClick={() => handleApprove(u.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(u.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                      </Button>
                    </div>
                  )}
                  
                  {activeTab !== "pending" && (
                    <Button size="icon" variant="ghost" className="rounded-xl shrink-0" onClick={() => setDetail(u)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Chi tiết hồ sơ</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={detail.avatar} alt={detail.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-lg text-foreground">{detail.name}</p>
                  <p className="text-sm text-muted-foreground">{roleLabel[detail.role] || detail.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Email</span><span className="text-foreground">{detail.email}</span></div>
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">SĐT</span><span className="text-foreground">{detail.phone}</span></div>
                {detail.subject && <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Môn</span><span className="text-foreground">{detail.subject}</span></div>}
                <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">Ngày đăng ký</span><span className="text-foreground">{detail.createdAt}</span></div>
              </div>
              {detail.bio && <p className="text-sm text-foreground bg-muted/50 p-3 rounded-xl">{detail.bio}</p>}
              {detail.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex-1" onClick={() => { handleApprove(detail.id); setDetail(null); }}>Duyệt</Button>
                  <Button variant="outline" className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 flex-1" onClick={() => { handleReject(detail.id); setDetail(null); }}>Từ chối</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
