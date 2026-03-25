import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, GraduationCap, ThumbsUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import heroCharacters from "@/assets/hero-characters.png";

const stats = [
  { icon: Users, value: "1,200+", label: "Gia sư & Giáo viên", desktopPos: "md:absolute md:left-4 md:top-8" },
  { icon: GraduationCap, value: "890+", label: "Học sinh", desktopPos: "md:absolute md:right-0 md:top-24" },
  { icon: ThumbsUp, value: "98%", label: "Hài lòng", desktopPos: "md:absolute md:left-20 md:bottom-6" },
];

const bullets = [
  "Gia sư được kiểm tra năng lực",
  "AI hỗ trợ đánh giá học tập",
  "Thanh toán an toàn, minh bạch",
];

const avatars = [tutor1, tutor2, tutor3, tutor4, tutor5];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-16 md:pt-20 md:pt-16 md:pb-24">
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

            {/* <p className="text-muted-foreground text-body-lg mb-8 max-w-lg leading-relaxed">
              EduConnect giúp phụ huynh tìm gia sư phù hợp, đảm bảo chất lượng giảng dạy thông qua hệ thống kiểm tra năng lực và đánh giá AI.
            </p> */}

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
            className="relative lg:-mr-16"
          >
            <div className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex items-center justify-center overflow-visible">
              <div className="absolute inset-x-10 top-16 h-[70%] rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute inset-x-16 bottom-8 h-[45%] rounded-full bg-success/15 blur-3xl" />
              <img
                src={heroCharacters}
                alt="Minh họa gia sư và học sinh học cùng laptop trong không gian học tập hiện đại"
                className="relative z-20 w-full max-w-[700px] h-[330px] md:h-[480px] lg:h-[560px] object-contain drop-shadow-[0_20px_40px_hsl(var(--primary)/0.28)]"
              />

              <div className="absolute inset-x-2 bottom-0 grid grid-cols-1 sm:grid-cols-3 gap-3 md:hidden z-30">
                {stats.map((stat) => (
                  <div
                    key={`mobile-${stat.label}`}
                    className="bg-card/95 backdrop-blur rounded-2xl px-4 py-3 border border-primary/15 shadow-soft"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="text-xl font-extrabold text-deep-blue">{stat.value}</div>
                  </div>
                ))}
              </div>

              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`hidden md:block ${stat.desktopPos} z-30 bg-card/95 backdrop-blur rounded-2xl px-4 py-3 border border-primary/15 shadow-soft`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-xl font-extrabold text-deep-blue">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* <div className="absolute top-5 right-5 bg-success/15 text-success border border-success/30 px-4 py-2 rounded-full text-xs font-bold z-30">
              Tỉ lệ hoàn thành mục tiêu cao
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
