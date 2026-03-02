import { useTutor } from "@/contexts/TutorContext";
import { BookOpen, Wallet, Star, Users, Clock, CalendarDays, ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const TutorDashboard = () => {
  const { profile, classes, trials, wallet, walletBalance, escrowBalance, chatMessages, reviews, studentProgress } = useTutor();
  const navigate = useNavigate();

  const activeClasses = classes.filter(c => c.escrowStatus !== "completed" && c.escrowStatus !== "refunded");
  const pendingTrials = trials.filter(t => t.status === "pending");
  const unreadMessages = chatMessages.filter(m => !m.read && m.sender !== "tutor").length;

  // Next session
  const upcomingSessions = classes.flatMap(c => c.sessions.filter(s => s.status === "scheduled")).sort((a, b) => a.date.localeCompare(b.date));
  const nextSession = upcomingSessions[0];
  const nextClass = nextSession ? classes.find(c => c.sessions.some(s => s.id === nextSession.id)) : null;

  // Time until next session
  const getCountdown = () => {
    if (!nextSession) return null;
    const sessionDate = new Date(`${nextSession.date}T${nextSession.time.split("-")[0]}:00`);
    const now = new Date();
    const diff = sessionDate.getTime() - now.getTime();
    if (diff <= 0) return "Đang diễn ra";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)} ngày`;
    return `${hours}h ${mins}m`;
  };

  const stats = [
    { label: "Lớp đang dạy", value: activeClasses.length, icon: BookOpen, color: "text-primary", bg: "bg-primary/10", link: "/tutor/classes" },
    { label: "Ví khả dụng", value: `${walletBalance.toLocaleString("vi-VN")}đ`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", link: "/tutor/wallet" },
    { label: "Đánh giá TB", value: profile.rating.toFixed(1), icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", link: "/tutor/reviews" },
    { label: "Tổng buổi dạy", value: profile.totalSessions, icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", link: "/tutor/schedule" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <button key={i} onClick={() => navigate(s.link)} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-elevated transition-all text-left group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.bg)}>
              <s.icon className={cn("w-6 h-6", s.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Session */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Buổi học sắp tới
          </h3>
          {nextSession && nextClass ? (
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground">{nextClass.name}</p>
                <p className="text-sm text-muted-foreground">{nextSession.date} • {nextSession.time}</p>
                <p className="text-xs text-muted-foreground">Học sinh: {nextClass.studentName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Còn</p>
                <p className="text-lg font-bold text-primary">{getCountdown()}</p>
              </div>
              <button
                onClick={() => navigate("/tutor/classes")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Vào lớp
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Không có buổi học nào sắp tới</p>
          )}

          {/* Escrow Overview */}
          <h3 className="text-sm font-semibold text-foreground mt-6 mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" /> Escrow
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Đang giữ</p>
              <p className="text-lg font-bold text-foreground">{escrowBalance.toLocaleString("vi-VN")}đ</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Đã giải ngân</p>
              <p className="text-lg font-bold text-emerald-600">
                {classes.reduce((s, c) => s + c.escrowReleased, 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pending Trials */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Yêu cầu học thử ({pendingTrials.length})</h3>
            {pendingTrials.length > 0 ? pendingTrials.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2 last:mb-0">
                <img src={t.parentAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.studentName}</p>
                  <p className="text-xs text-muted-foreground">{t.subject} • {t.requestedDate}</p>
                </div>
                <button onClick={() => navigate("/tutor/classes")} className="text-xs text-primary font-medium">Xem</button>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-4">Không có yêu cầu mới</p>
            )}
          </div>

          {/* Unread Messages */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Tin nhắn chưa đọc
              {unreadMessages > 0 && <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">{unreadMessages}</span>}
            </h3>
            {unreadMessages > 0 ? (
              <button onClick={() => navigate("/tutor/chat")} className="w-full text-sm text-primary font-medium hover:underline">
                Xem {unreadMessages} tin nhắn →
              </button>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Không có tin nhắn mới</p>
            )}
          </div>

          {/* Latest Review */}
          {reviews.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Đánh giá gần nhất</h3>
              <div className="flex items-start gap-3">
                <img src={reviews[0].avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < reviews[0].rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{reviews[0].comment}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">– {reviews[0].parentName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
