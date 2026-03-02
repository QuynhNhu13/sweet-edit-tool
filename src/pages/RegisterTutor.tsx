import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

const benefits = [
  "Thu nhập ổn định, thanh toán minh bạch",
  "Tự do chọn lịch dạy phù hợp",
  "Được hỗ trợ công cụ giảng dạy AI",
  "Cộng đồng gia sư chuyên nghiệp",
];

const RegisterTutor = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ của bạn trong 48 giờ.");
      formRef.current?.reset();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-start max-w-5xl mx-auto">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 text-neon text-sm font-semibold mb-6">
                Tuyển gia sư
              </span>
              <h1 className="text-section-lg md:text-hero font-extrabold text-foreground mb-4">
                Trở thành gia sư <span className="text-gradient">EduConnect</span>
              </h1>
              <p className="text-muted-foreground text-body-lg mb-8">
                Tham gia đội ngũ hơn 1,200 gia sư chất lượng và bắt đầu hành trình giảng dạy.
              </p>
              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-neon flex-shrink-0" />
                    <span className="text-foreground font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Thông tin đăng ký</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input id="fullname" placeholder="Nguyễn Văn A" className="mt-1.5 rounded-xl h-11" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="0901234567" className="mt-1.5 rounded-xl h-11" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="temail">Email</Label>
                  <Input id="temail" type="email" placeholder="email@example.com" className="mt-1.5 rounded-xl h-11" required />
                </div>
                <div>
                  <Label htmlFor="subject">Môn dạy chính</Label>
                  <Input id="subject" placeholder="VD: Toán học, Vật lý" className="mt-1.5 rounded-xl h-11" required />
                </div>
                <div>
                  <Label htmlFor="exp">Kinh nghiệm giảng dạy</Label>
                  <Textarea id="exp" placeholder="Mô tả kinh nghiệm..." className="mt-1.5 rounded-xl min-h-[100px]" required />
                </div>
                <div>
                  <Label htmlFor="education">Bằng cấp / Chứng chỉ</Label>
                  <Input id="education" placeholder="VD: Cử nhân Sư phạm Toán" className="mt-1.5 rounded-xl h-11" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-neon text-neon-foreground hover:bg-neon/90 text-base font-bold shadow-neon">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang gửi...</> : "Gửi đăng ký"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default RegisterTutor;
