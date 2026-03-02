import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đăng nhập thành công!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold font-display text-foreground mb-2">Đăng nhập</h1>
            <p className="text-muted-foreground">Chào mừng trở lại EduConnect</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" className="mt-1.5 rounded-xl h-11" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 rounded-xl h-11" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full h-12 rounded-2xl gradient-blue text-white text-base font-bold">
                Đăng nhập
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-neon font-semibold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Login;
