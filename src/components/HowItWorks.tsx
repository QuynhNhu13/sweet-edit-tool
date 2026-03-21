import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, FileCheck, BookOpen, Wallet, ClipboardList, Users, BarChart3, FileBarChart } from "lucide-react";

const tutorSteps = [
  { num: "01", title: "Đăng ký & Xác thực", desc: "Upload bằng điểm, chứng chỉ. AI kiểm tra tự động + Admin phê duyệt trong 48h", icon: UserCheck },
  { num: "02", title: "Làm bài test", desc: "Hoàn thành bài kiểm tra năng lực môn học", icon: FileCheck },
  { num: "03", title: "Nhận lớp & Dạy", desc: "Xem lớp phù hợp, đăng ký, thanh toán 10% phí và bắt đầu giảng dạy", icon: BookOpen },
  { num: "04", title: "Nhận lương", desc: "Nhận 80% lương hàng tháng, 20% escrow giải ngân sau khi hoàn thành", icon: Wallet },
];

const studentSteps = [
  { num: "01", title: "Đăng ký lớp học", desc: "Chọn môn, lịch học, hình thức và mức giá phù hợp", icon: ClipboardList },
  { num: "02", title: "Ghép gia sư", desc: "Hệ thống gợi ý gia sư phù hợp, xác nhận và bắt đầu học", icon: Users },
  { num: "03", title: "Học & Đánh giá", desc: "Tham gia lớp học, làm test cuối tháng để đo lường tiến độ", icon: BarChart3 },
  { num: "04", title: "Báo cáo cho phụ huynh", desc: "Phụ huynh nhận báo cáo AI về tiến độ và kết quả học tập", icon: FileBarChart },
];

const HowItWorks = () => {
  const [tab, setTab] = useState<"tutor" | "student">("tutor");
  const steps = tab === "tutor" ? tutorSteps : studentSteps;

  return (
    <section className="py-24 md:py-32 gradient-hero relative overflow-hidden" id="how-it-works">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon/5 blur-[150px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-4">
            Cách <span className="text-gradient">hoạt động</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quy trình đơn giản, minh bạch cho cả gia sư và học sinh
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-14">
          {(["tutor", "student"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-neon"
                  : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              {t === "tutor" ? "Dành cho Gia sư" : "Dành cho Học sinh"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all group shadow-soft"
              >
                <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-5 group-hover:bg-neon/20 transition-colors">
                  <step.icon className="w-6 h-6 text-neon" />
                </div>
                <span className="text-primary/20 text-6xl font-black font-display absolute top-3 right-4">{step.num}</span>
                <h3 className="font-bold text-foreground font-display text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-neon/30" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HowItWorks;
