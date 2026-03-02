import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, CreditCard, Bell, Shield, Save, Zap } from "lucide-react";

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState(settings);
  const { toast } = useToast();

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Đã lưu cài đặt thành công" });
  };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      {/* Giao dịch & Escrow */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Giao dịch & Escrow</h3>
              <p className="text-xs text-muted-foreground">Cấu hình phí giao dịch và thời gian giữ tiền</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Phí Escrow (%)</Label>
              <Input type="number" min={0} max={100} value={form.escrowPercent} onChange={e => setForm(f => ({ ...f, escrowPercent: Number(e.target.value) }))} className="rounded-xl mt-1.5" />
              <p className="text-xs text-muted-foreground mt-1">Phần trăm nền tảng giữ lại mỗi giao dịch</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Thời gian giữ tiền (ngày)</Label>
              <Input type="number" min={1} max={30} value={form.escrowHoldDays} onChange={e => setForm(f => ({ ...f, escrowHoldDays: Number(e.target.value) }))} className="rounded-xl mt-1.5" />
              <p className="text-xs text-muted-foreground mt-1">Số ngày giữ tiền trước khi chuyển cho gia sư</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">Thanh toán online</p>
              <p className="text-xs text-muted-foreground">Bật/tắt thanh toán trực tuyến</p>
            </div>
            <Switch checked={form.enablePayments} onCheckedChange={v => setForm(f => ({ ...f, enablePayments: v }))} />
          </div>
        </CardContent>
      </Card>

      {/* Hệ thống chung */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Hệ thống chung</h3>
              <p className="text-xs text-muted-foreground">Cấu hình chung cho nền tảng</p>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tên nền tảng</Label>
            <Input value={form.platformName} onChange={e => setForm(f => ({ ...f, platformName: e.target.value }))} className="rounded-xl mt-1.5 max-w-sm" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">📝 Thi thử online</p>
                <p className="text-xs text-muted-foreground">Cho phép học sinh làm bài test trực tuyến</p>
              </div>
              <Switch checked={form.enableExams} onCheckedChange={v => setForm(f => ({ ...f, enableExams: v }))} />
            </div>
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">💬 Chat</p>
                <p className="text-xs text-muted-foreground">Cho phép nhắn tin giữa gia sư và học sinh</p>
              </div>
              <Switch checked={form.enableChat} onCheckedChange={v => setForm(f => ({ ...f, enableChat: v }))} />
            </div>
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">🔧 Chế độ bảo trì</p>
                <p className="text-xs text-muted-foreground">Tạm ngưng hệ thống để bảo trì</p>
              </div>
              <Switch checked={form.maintenanceMode} onCheckedChange={v => setForm(f => ({ ...f, maintenanceMode: v }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông báo */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Thông báo</h3>
              <p className="text-xs text-muted-foreground">Cấu hình kênh thông báo cho hệ thống</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">📧 Email</p>
                <p className="text-xs text-muted-foreground">Gửi thông báo qua email</p>
              </div>
              <Switch checked={form.emailNotifications} onCheckedChange={v => setForm(f => ({ ...f, emailNotifications: v }))} />
            </div>
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">📱 SMS</p>
                <p className="text-xs text-muted-foreground">Gửi thông báo qua tin nhắn SMS</p>
              </div>
              <Switch checked={form.smsNotifications} onCheckedChange={v => setForm(f => ({ ...f, smsNotifications: v }))} />
            </div>
            <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">🔔 Push notification</p>
                <p className="text-xs text-muted-foreground">Gửi thông báo đẩy trên trình duyệt</p>
              </div>
              <Switch checked={form.pushNotifications} onCheckedChange={v => setForm(f => ({ ...f, pushNotifications: v }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bảo mật & Phân quyền */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Bảo mật & Phân quyền</h3>
              <p className="text-xs text-muted-foreground">Cấu hình bảo mật cho tài khoản và hệ thống</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">🔐 Xác thực 2 bước (2FA)</p>
              <p className="text-xs text-muted-foreground">Yêu cầu xác thực 2 lớp khi đăng nhập</p>
            </div>
            <Switch checked={form.twoFactorAuth} onCheckedChange={v => setForm(f => ({ ...f, twoFactorAuth: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Thời gian phiên đăng nhập (phút)</Label>
              <Input type="number" min={5} max={120} value={form.sessionTimeout} onChange={e => setForm(f => ({ ...f, sessionTimeout: Number(e.target.value) }))} className="rounded-xl mt-1.5" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Số lần đăng nhập sai tối đa</Label>
              <Input type="number" min={3} max={10} value={form.maxLoginAttempts} onChange={e => setForm(f => ({ ...f, maxLoginAttempts: Number(e.target.value) }))} className="rounded-xl mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="rounded-xl" onClick={handleSave}>
        <Save className="w-4 h-4 mr-1.5" /> Lưu cài đặt
      </Button>
    </div>
  );
};

export default AdminSettings;
