import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Clock, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Clock, text: "Mô phỏng thi thật (đúng format và thời gian)" },
  { icon: ShieldCheck, text: "AI Proctoring chống gian lận" },
  { icon: Sparkles, text: "Đề AI generate mới mỗi lần thi" },
  { icon: CreditCard, text: "Chỉ 10.000đ/lần (MoMo/VNPay)" },
];

const ExamSection = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden" id="exam">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 text-neon text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Thi thử Online
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-5 leading-tight">
              Luyện thi THPT Quốc gia với <span className="text-gradient">đề AI</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Hệ thống thi thử online với đề được AI generate theo chuẩn Bộ GD&DT, giám sát bằng AI proctoring để đảm bảo công bằng.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{f.text}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild className="bg-neon text-neon-foreground hover:bg-neon/90 px-10 h-14 rounded-full font-bold shadow-neon group">
              <Link to="/exam-online" className="flex items-center gap-2">
                Thi ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-neon/5 blur-[60px] rounded-full" />

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-neon">
                  <Sparkles className="w-6 h-6 text-neon" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground font-display text-lg">Đề thi thử Toán THPT QG 2025</h3>
                  <p className="text-xs text-muted-foreground">AI Generated · Cập nhật mới nhất</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Thời gian", value: "90 phút" },
                  { label: "Số câu", value: "50 câu" },
                  { label: "Phí thi", value: "10.000đ", highlight: true },
                  { label: "Lượt thi", value: "1,234" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/50 rounded-2xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                    <div className={`font-bold font-display text-lg ${item.highlight ? "text-neon" : "text-foreground"}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full gradient-blue text-primary-foreground h-14 rounded-full font-bold text-base" asChild>
                <Link to="/exam-online">Bắt đầu thi thử</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExamSection;
