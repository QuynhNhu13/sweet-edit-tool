import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";
import { CheckCircle, Loader2, Upload, FileText, X } from "lucide-react";

const benefits = [
  "Thu nhập ổn định, thanh toán minh bạch",
  "Tự do chọn lịch dạy phù hợp",
  "Được hỗ trợ công cụ giảng dạy AI",
  "Cộng đồng gia sư chuyên nghiệp",
];

const subjects = ["Toán", "Vật lý", "Hóa học", "Sinh học", "Tiếng Anh", "Ngữ văn", "Lịch sử", "Địa lý", "Tin học", "Khác"];

const RegisterTutor = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ của bạn trong 48 giờ.");
      formRef.current?.reset();
      setFiles([]);
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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                Tuyển gia sư
              </span>
              <h1 className="text-section-lg md:text-hero font-extrabold text-foreground mb-4">
                Trở thành gia sư <span className="text-primary">EduConnect</span>
              </h1>
              <p className="text-muted-foreground text-body-lg mb-8">
                Tham gia đội ngũ hơn 1,200 gia sư chất lượng và bắt đầu hành trình giảng dạy.
              </p>
              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Thông tin đăng ký gia sư</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Môn dạy chính</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl mt-1.5 h-11"><SelectValue placeholder="Chọn môn" /></SelectTrigger>
                      <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exp-years">Số năm kinh nghiệm</Label>
                    <Input id="exp-years" type="number" placeholder="VD: 3" className="mt-1.5 rounded-xl h-11" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="exp">Mô tả kinh nghiệm giảng dạy</Label>
                  <Textarea id="exp" placeholder="Mô tả kinh nghiệm dạy kèm, phương pháp giảng dạy..." className="mt-1.5 rounded-xl min-h-[100px]" required />
                </div>
                <div>
                  <Label htmlFor="education">Bằng cấp / Chứng chỉ</Label>
                  <Input id="education" placeholder="VD: Cử nhân Sư phạm Toán - ĐH Sư phạm HN" className="mt-1.5 rounded-xl h-11" required />
                </div>

                {/* File Upload */}
                <div>
                  <Label>Upload bằng cấp / chứng chỉ (tối đa 5 file)</Label>
                  <div
                    className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Kéo thả hoặc click để upload</p>
                    <p className="text-[10px] text-muted-foreground mt-1">PDF, JPG, PNG (tối đa 5MB/file)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-muted/50 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-sm text-foreground truncate">{file.name}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button type="button" onClick={() => removeFile(idx)} className="p-1 hover:bg-destructive/10 rounded-lg transition-colors">
                            <X className="w-3.5 h-3.5 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang gửi...</> : "Gửi đăng ký gia sư"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
                </p>
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
