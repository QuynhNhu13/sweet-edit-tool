import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Zap, Save } from "lucide-react";

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState(settings);
  const { toast } = useToast();

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Đã lưu cài đặt thành công" });
  };

  const toggleItems = [
    { key: "enableExams" as const, label: "Thi thử online", desc: "Cho phép học sinh làm bài test trực tuyến", icon: "📝" },
    { key: "enableChat" as const, label: "Chat", desc: "Cho phép nhắn tin giữa gia sư và học sinh", icon: "💬" },
    { key: "enablePayments" as const, label: "Thanh toán", desc: "Bật/tắt thanh toán online", icon: "💳" },
    { key: "maintenanceMode" as const, label: "Chế độ bảo trì", desc: "Tạm ngưng hệ thống để bảo trì", icon: "🔧" },
  ];

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* Platform info */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Thông tin nền tảng</h3>
              <p className="text-xs text-muted-foreground">Cấu hình chung cho hệ thống</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Tên nền tảng</Label>
              <Input value={form.platformName} onChange={e => setForm(f => ({ ...f, platformName: e.target.value }))} className="rounded-xl mt-1.5 max-w-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phí Escrow (%)</Label>
              <Input type="number" min={0} max={100} value={form.escrowPercent} onChange={e => setForm(f => ({ ...f, escrowPercent: Number(e.target.value) }))} className="rounded-xl mt-1.5 max-w-xs" />
              <p className="text-xs text-muted-foreground mt-1">Phần trăm nền tảng giữ lại từ mỗi giao dịch</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature toggles */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tính năng</h3>
              <p className="text-xs text-muted-foreground">Bật/tắt các tính năng của hệ thống</p>
            </div>
          </div>
          <div className="space-y-1">
            {toggleItems.map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={form[item.key]}
                  onCheckedChange={v => setForm(f => ({ ...f, [item.key]: v }))}
                />
              </div>
            ))}
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
