import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, GraduationCap, ThumbsUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-28 pb-24 md:pt-40 md:pb-32">
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-neon/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-bright-blue/20 blur-[100px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(82 100% 54% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(82 100% 54% / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 text-neon text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              Nền tảng giáo dục hàng đầu Việt Nam
            </motion.span>

            <h1 className="text-hero md:text-hero-lg lg:text-[4.5rem] leading-[1.1] mb-6">
              <span className="text-white">Kết nối</span>
              <br />
              <span className="text-gradient">Gia sư chất lượng</span>
              <br />
              <span className="text-white">với Học sinh</span>
            </h1>

            <p className="text-white/60 text-body-lg mb-8 max-w-lg leading-relaxed">
              EduConnect giúp phụ huynh tìm gia sư phù hợp, đảm bảo chất lượng giảng dạy thông qua hệ thống kiểm tra năng lực và đánh giá AI.
            </p>

            <ul className="space-y-3 mb-10">
              {bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <CheckCircle className="w-5 h-5 text-neon flex-shrink-0" />
                  <span className="font-medium text-body">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" asChild className="bg-neon text-neon-foreground hover:bg-neon/90 text-body px-8 h-13 rounded-2xl font-bold shadow-neon group">
                <Link to="/find-tutor" className="flex items-center gap-2">
                  Tìm gia sư ngay
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 text-body px-8 h-13 rounded-2xl font-semibold">
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
                <span className="text-neon font-bold text-sm">+180</span>
                <span className="text-white/50 text-sm ml-1">gia sư nổi bật</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-7 flex items-center gap-6 border border-white/10 hover:border-neon/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-neon/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-neon" />
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-white/50 text-sm mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="self-end bg-neon text-neon-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-neon"
            >
              AI-Powered Platform
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
