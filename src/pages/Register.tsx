import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-section font-extrabold text-foreground mb-2">Đăng ký tài khoản</h1>
            <p className="text-muted-foreground text-body">Tham gia EduConnect ngay hôm nay</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
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
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" placeholder="0901234567" className="mt-1.5 rounded-xl h-11" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="Tối thiểu 6 ký tự" className="mt-1.5 rounded-xl h-11" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" className="mt-1.5 rounded-xl h-11" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              </div>

              <p className="text-[11px] text-muted-foreground">Sau khi đăng ký, Admin sẽ xác minh và phân quyền tài khoản cho bạn (Học sinh, Phụ huynh, Gia sư,...).</p>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang xử lý...</> : "Đăng ký"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Bạn là gia sư?{" "}
                <Link to="/register-tutor" className="text-primary font-semibold hover:underline">Đăng ký trở thành gia sư</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Register;
