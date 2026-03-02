import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Sparkles, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

const exams = [
  { subject: "Toán", time: "90 phút", questions: 50, price: "10.000đ", attempts: "1,234" },
  { subject: "Vật lý", time: "50 phút", questions: 40, price: "10.000đ", attempts: "876" },
  { subject: "Hóa học", time: "50 phút", questions: 40, price: "10.000đ", attempts: "654" },
  { subject: "Sinh học", time: "50 phút", questions: 40, price: "10.000đ", attempts: "543" },
  { subject: "Tiếng Anh", time: "60 phút", questions: 50, price: "10.000đ", attempts: "1,567" },
  { subject: "Ngữ văn", time: "120 phút", questions: 2, price: "10.000đ", attempts: "432" },
  { subject: "Lịch sử", time: "50 phút", questions: 40, price: "10.000đ", attempts: "321" },
  { subject: "Địa lý", time: "50 phút", questions: 40, price: "10.000đ", attempts: "298" },
];

const ExamOnline = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="gradient-hero rounded-2xl p-10 md:p-14 mb-12 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4">
              AI Proctoring
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-3">Thi thử THPT Quốc gia Online</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-6">
              Đề thi AI generate theo chuẩn Bộ GD&DT, giám sát chống gian lận
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-secondary" /> AI Proctoring</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-secondary" /> Đề mới mỗi lần</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /> Mô phỏng thật</span>
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-secondary" /> 10.000đ/lần</span>
            </div>
          </div>

          {/* Exam grid */}
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Chọn môn thi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exams.map((e) => (
              <div key={e.subject} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow">
                <h3 className="font-bold text-lg text-foreground mb-3">{e.subject}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-5">
                  <div className="flex justify-between"><span>Thời gian</span><span className="text-foreground font-medium">{e.time}</span></div>
                  <div className="flex justify-between"><span>Số câu</span><span className="text-foreground font-medium">{e.questions} câu</span></div>
                  <div className="flex justify-between"><span>Phí thi</span><span className="text-secondary font-bold">{e.price}</span></div>
                  <div className="flex justify-between"><span>Lượt thi</span><span className="text-foreground font-medium">{e.attempts}</span></div>
                </div>
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link to="/register">Thi ngay</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ExamOnline;
