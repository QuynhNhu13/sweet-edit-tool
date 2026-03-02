import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 gradient-hero relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-bright-blue/10 blur-[120px] rounded-full" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(82 100% 54% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(82 100% 54% / 0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 text-neon text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Bắt đầu miễn phí
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-extrabold font-display text-white mb-5 leading-tight">
            Sẵn sàng bắt đầu
            <br />
            <span className="text-gradient">hành trình học tập?</span>
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">
            Đăng ký ngay hôm nay để tìm gia sư phù hợp hoặc bắt đầu sự nghiệp giảng dạy của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-neon text-neon-foreground hover:bg-neon/90 text-base px-10 h-14 rounded-full font-bold shadow-neon group">
              <Link to="/find-tutor" className="flex items-center gap-2">
                Tìm gia sư ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 text-base px-10 h-14 rounded-full font-semibold">
              <Link to="/register-tutor">Trở thành gia sư</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
