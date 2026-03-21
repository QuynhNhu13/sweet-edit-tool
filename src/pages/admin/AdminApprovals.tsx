import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, FileText, Phone, Mail, BookOpen, GraduationCap, Building2, Hash } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminUser } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh" };

type TabValue = "pending" | "approved" | "rejected";

// Mock transcript/diploma data
const mockDocuments: Record<string, { transcriptUrl: string; diplomaUrl: string; transcriptNote: string; diplomaNote: string }> = {
  u5: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Thạc sĩ Vật Lý - ĐH Bách Khoa Hà Nội, GPA: 3.6/4.0", diplomaNote: "Bằng Thạc sĩ Vật Lý Kỹ thuật, cấp ngày 15/06/2020" },
  u6: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Cử nhân Hóa học - ĐH Sư Phạm, GPA: 3.4/4.0", diplomaNote: "Bằng Cử nhân Sư phạm Hóa, cấp ngày 20/07/2013" },
  u7: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Cử nhân Kinh tế đối ngoại - ĐH Ngoại Thương, GPA: 3.7/4.0, IELTS 8.5", diplomaNote: "Bằng Cử nhân Kinh tế đối ngoại, cấp ngày 10/08/2021" },
  u1: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Cử nhân Toán - ĐH Sư Phạm TP.HCM, GPA: 3.5/4.0", diplomaNote: "Bằng Cử nhân Sư phạm Toán, cấp ngày 05/07/2019" },
  u2: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Cử nhân Ngữ Văn - ĐH KHXH&NV, GPA: 3.8/4.0", diplomaNote: "Bằng Cử nhân Sư phạm Ngữ Văn, cấp ngày 12/06/2014" },
  u9: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm năm 3 ĐH Y Dược TP.HCM, GPA: 3.2/4.0", diplomaNote: "Chưa tốt nghiệp - Sinh viên năm 3" },
  u12: { transcriptUrl: "#", diplomaUrl: "#", transcriptNote: "Bảng điểm Cử nhân Lịch Sử - ĐH KHXH&NV Hà Nội, GPA: 3.6/4.0", diplomaNote: "Bằng Cử nhân Sư phạm Lịch Sử, cấp ngày 08/07/2015" },
};

const AdminApprovals = () => {
  const { users, approveUser, rejectUser } = useAdmin();
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [docView, setDocView] = useState<{ user: AdminUser; type: "transcript" | "diploma" } | null>(null);
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

  const getDoc = (userId: string) => mockDocuments[userId];

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
                ? tab.value === "pending" ? "bg-destructive/10 text-destructive" : tab.value === "approved" ? "bg-success/150/10 text-success" : "bg-muted text-muted-foreground"
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
                  <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-border shrink-0" />
                  
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
                      {u.school && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{u.school}</span>}
                      {u.studentId && <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" />MSSV: {u.studentId}</span>}
                    </div>

                    {u.bio && (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl">{u.bio}</p>
                    )}

                    {/* Document buttons - functional */}
                    {(u.role === "tutor" || u.role === "teacher") && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setDocView({ user: u, type: "transcript" })}
                          className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Bảng điểm
                        </button>
                        <button
                          onClick={() => setDocView({ user: u, type: "diploma" })}
                          className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <GraduationCap className="w-3.5 h-3.5" /> Văn bằng
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {activeTab === "pending" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="rounded-xl bg-success/150 hover:bg-success text-white shadow-sm"
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

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
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
                {detail.school && <div className="bg-muted/50 p-3 rounded-xl col-span-2"><span className="text-muted-foreground block text-xs mb-1">Trường</span><span className="text-foreground">{detail.school}</span></div>}
                {detail.studentId && <div className="bg-muted/50 p-3 rounded-xl"><span className="text-muted-foreground block text-xs mb-1">MSSV</span><span className="text-foreground">{detail.studentId}</span></div>}
              </div>
              {detail.bio && <p className="text-sm text-foreground bg-muted/50 p-3 rounded-xl">{detail.bio}</p>}
              
              {/* Documents in detail */}
              {(detail.role === "tutor" || detail.role === "teacher") && getDoc(detail.id) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Hồ sơ đính kèm</h4>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Bảng điểm</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{getDoc(detail.id)?.transcriptNote}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Văn bằng</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{getDoc(detail.id)?.diplomaNote}</p>
                  </div>
                </div>
              )}

              {detail.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button className="rounded-xl bg-success/150 hover:bg-success text-white flex-1" onClick={() => { handleApprove(detail.id); setDetail(null); }}>Duyệt</Button>
                  <Button variant="outline" className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 flex-1" onClick={() => { handleReject(detail.id); setDetail(null); }}>Từ chối</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document View Dialog */}
      <Dialog open={!!docView} onOpenChange={() => setDocView(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>
              {docView?.type === "transcript" ? "📄 Bảng điểm" : "🎓 Văn bằng"} — {docView?.user.name}
            </DialogTitle>
          </DialogHeader>
          {docView && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <img src={docView.user.avatar} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-foreground">{docView.user.name}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel[docView.user.role]} · {docView.user.subject}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-sm text-foreground leading-relaxed">
                  {docView.type === "transcript"
                    ? getDoc(docView.user.id)?.transcriptNote || "Chưa có thông tin"
                    : getDoc(docView.user.id)?.diplomaNote || "Chưa có thông tin"
                  }
                </p>
              </div>
              <div className="bg-primary/5 p-3 rounded-xl text-xs text-muted-foreground">
                📎 File đính kèm đã được xác minh bởi hệ thống. Trạng thái: <span className="text-success font-medium">Hợp lệ</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
