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
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="gradient-hero rounded-3xl p-12 md:p-16 mb-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon/10 blur-[100px] rounded-full" />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 text-neon text-sm font-semibold mb-5 relative z-10">
              <Sparkles className="w-4 h-4" /> AI Proctoring
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-white mb-4 relative z-10">
              Thi thử THPT Quốc gia <span className="text-gradient">Online</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 relative z-10">
              Đề thi AI generate theo chuẩn Bộ GD&DT, giám sát chống gian lận
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/50 text-sm relative z-10">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-neon" /> AI Proctoring</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-neon" /> Đề mới mỗi lần</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-neon" /> Mô phỏng thật</span>
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-neon" /> 10.000đ/lần</span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold font-display text-foreground mb-8">Chọn môn thi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exams.map((e) => (
              <div key={e.subject} className="bg-card rounded-3xl p-6 shadow-soft border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-xl font-display text-foreground mb-4">{e.subject}</h3>
                <div className="space-y-2.5 text-sm text-muted-foreground mb-6">
                  <div className="flex justify-between"><span>Thời gian</span><span className="text-foreground font-medium">{e.time}</span></div>
                  <div className="flex justify-between"><span>Số câu</span><span className="text-foreground font-medium">{e.questions} câu</span></div>
                  <div className="flex justify-between"><span>Phí thi</span><span className="text-neon font-bold">{e.price}</span></div>
                  <div className="flex justify-between"><span>Lượt thi</span><span className="text-foreground font-medium">{e.attempts}</span></div>
                </div>
                <Button className="w-full rounded-full gradient-blue text-white font-semibold h-12" asChild>
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
