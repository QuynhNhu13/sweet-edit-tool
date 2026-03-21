import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, GraduationCap, ThumbsUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import heroBanner from "@/assets/hero-english-banner.png";

const stats = [
  { icon: Users, value: "1,200+", label: "Gia sư & Giáo viên" },
  { icon: GraduationCap, value: "890+", label: "Học sinh" },
  { icon: ThumbsUp, value: "98%", label: "Hài lòng" },
];

const bullets = [
  "Gia sư được kiểm tra năng lực",
  "AI hỗ trợ đánh giá học tập",
  "Thanh toán an toàn, minh bạch",
];

const avatars = [tutor1, tutor2, tutor3, tutor4, tutor5];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="absolute top-0 -right-20 w-[460px] h-[460px] bg-primary/15 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -left-20 w-[380px] h-[380px] bg-info/15 blur-[100px] rounded-full" />
      <div className="absolute top-24 left-[38%] w-[320px] h-[320px] bg-success/10 blur-[120px] rounded-full" />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.35) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Nền tảng giáo dục hàng đầu Việt Nam
            </motion.span>

            <h1 className="text-hero md:text-hero-lg lg:text-[4.5rem] leading-[1.1] mb-6">
              <span className="text-deep-blue">Kết nối</span>
              <br />
              <span className="text-gradient">Gia sư chất lượng</span>
              <br />
              <span className="text-deep-blue">với Học sinh</span>
            </h1>

            <p className="text-muted-foreground text-body-lg mb-8 max-w-lg leading-relaxed">
              EduConnect giúp phụ huynh tìm gia sư phù hợp, đảm bảo chất lượng giảng dạy thông qua hệ thống kiểm tra năng lực và đánh giá AI.
            </p>

            <ul className="space-y-3 mb-10">
              {bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-foreground/80"
                >
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="font-medium text-body">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 h-14 rounded-full font-bold shadow-neon group">
                <Link to="/find-tutor" className="flex items-center gap-2">
                  Tìm gia sư ngay
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary/30 text-primary hover:bg-primary/10 text-body px-10 h-14 rounded-full font-semibold">
                <Link to="/register-tutor">Đăng ký làm gia sư</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Gia sư"
                    className="w-11 h-11 rounded-full border-2 border-deep-blue bg-muted object-cover"
                  />
                ))}
              </div>
              <div>
                <span className="text-success font-bold text-sm">+180</span>
                <span className="text-foreground/60 text-sm ml-1">gia sư nổi bật</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
             className="relative lg:-mr-20 xl:-mr-28"
          >
            <div className="relative overflow-visible">
              <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-[3rem]" />
              <div className="absolute inset-x-0 -bottom-2 h-24 bg-gradient-to-t from-background via-background/70 to-transparent z-20" />
              <img
                src={heroBanner}
                alt="Minh họa gia sư và học sinh học tiếng Anh trực tuyến"
                className="relative z-10 w-[108%] max-w-none h-[390px] md:h-[500px] lg:h-[560px] object-cover object-center rounded-[2.25rem] shadow-elevated"
              />
            </div>

            <div className="absolute -bottom-8 left-3 right-3 md:left-6 md:right-6 grid grid-cols-1 sm:grid-cols-3 gap-3 z-30">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card/95 backdrop-blur rounded-2xl px-4 py-3 border border-primary/15 shadow-soft"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="absolute top-5 right-5 bg-success/15 text-success border border-success/30 px-4 py-2 rounded-full text-xs font-bold z-20">
              Tỉ lệ hoàn thành mục tiêu cao
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
