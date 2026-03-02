import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";

const Register = () => {
  const [role, setRole] = useState<"student" | "parent" | "tutor">("student");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
  };

  const roles = [
    { key: "student" as const, label: "Học sinh" },
    { key: "parent" as const, label: "Phụ huynh" },
    { key: "tutor" as const, label: "Gia sư" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold font-display text-foreground mb-2">Đăng ký tài khoản</h1>
            <p className="text-muted-foreground">Tham gia EduConnect ngay hôm nay</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
            <div className="flex gap-2 mb-6">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    role === r.key
                      ? "bg-neon text-neon-foreground shadow-neon"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Nguyễn Văn A" className="mt-1.5 rounded-xl h-11" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" className="mt-1.5 rounded-xl h-11" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 rounded-xl h-11" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="mt-1.5 rounded-xl h-11" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full h-12 rounded-2xl bg-neon text-neon-foreground hover:bg-neon/90 text-base font-bold shadow-neon">
                Đăng ký
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Register;
