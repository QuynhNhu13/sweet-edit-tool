import { useTutor } from "@/contexts/TutorContext";
import { BookOpen, Wallet, Star, Users, Clock, CalendarDays, ArrowUpRight, TrendingUp, CheckCircle2, MessageSquare, X, Send, Phone, Video, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const TutorDashboard = () => {
  const { profile, classes, trials, wallet, walletBalance, escrowBalance, chatMessages, reviews, studentProgress, sendMessage, markMessagesRead } = useTutor();
  const navigate = useNavigate();

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatClass, setSelectedChatClass] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeClasses = classes.filter(c => c.escrowStatus !== "completed" && c.escrowStatus !== "refunded");
  const completedClasses = classes.filter(c => c.escrowStatus === "completed");
  const pendingTrials = trials.filter(t => t.status === "pending");
  const unreadMessages = chatMessages.filter(m => !m.read && m.sender !== "tutor").length;

  const totalIncome = wallet.filter(w => w.type === "escrow_release" && w.status === "completed").reduce((s, w) => s + w.amount, 0);
  const totalFees = wallet.filter(w => w.type === "platform_fee" && w.status === "completed").reduce((s, w) => s + Math.abs(w.amount), 0);
  const netIncome = totalIncome - totalFees;
  const totalSessionsCompleted = classes.reduce((s, c) => s + c.completedSessions, 0);
  const totalSessionsAll = classes.reduce((s, c) => s + c.totalSessions, 0);

  const upcomingSessions = classes.flatMap(c => c.sessions.filter(s => s.status === "scheduled")).sort((a, b) => a.date.localeCompare(b.date));
  const nextSession = upcomingSessions[0];
  const nextClass = nextSession ? classes.find(c => c.sessions.some(s => s.id === nextSession.id)) : null;

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

  const chatClassMessages = selectedChatClass ? chatMessages.filter(m => m.classId === selectedChatClass) : [];
  const unreadByClass = (classId: string) => chatMessages.filter(m => m.classId === classId && !m.read && m.sender !== "tutor").length;

  useEffect(() => {
    if (selectedChatClass) {
      markMessagesRead(selectedChatClass);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatClass, chatClassMessages.length, markMessagesRead]);

  const handleSendChat = () => {
    if (!chatInput.trim() || !selectedChatClass) return;
    sendMessage(selectedChatClass, chatInput.trim());
    setChatInput("");
  };

  // Monthly income data for line chart
  const monthlyData = [
    { month: "T9", income: 800000 },
    { month: "T10", income: 1200000 },
    { month: "T11", income: 1800000 },
    { month: "T12", income: 1600000 },
    { month: "T1", income: 2200000 },
    { month: "T2", income: 2640000 },
    { month: "T3", income: 800000 },
  ];

  const chartConfig = {
    income: { label: "Thu nhập", color: "hsl(var(--primary))" },
  };

  const stats = [
    { label: "Lớp đang dạy", value: activeClasses.length, sub: `${completedClasses.length} hoàn thành`, icon: BookOpen, iconBg: "bg-blue-100", iconColor: "text-blue-600", bg: "from-blue-700 to-blue-900", link: "/tutor/classes" },
    { label: "Thu nhập ròng", value: `${(netIncome / 1000000).toFixed(1)}tr`, sub: `Tổng: ${(totalIncome / 1000000).toFixed(1)}tr`, icon: Wallet, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", bg: "from-emerald-500 to-teal-500", link: "/tutor/wallet" },
    { label: "Đánh giá TB", value: profile.rating.toFixed(1), sub: `${profile.totalReviews} đánh giá`, icon: Star, iconBg: "bg-amber-100", iconColor: "text-amber-600", bg: "from-amber-500 to-orange-500", link: "/tutor/reviews" },
    { label: "Buổi đã dạy", value: totalSessionsCompleted, sub: `/ ${totalSessionsAll} tổng`, icon: CheckCircle2, iconBg: "bg-rose-100", iconColor: "text-rose-600", bg: "from-rose-500 to-pink-500", link: "/tutor/schedule" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <button key={i} onClick={() => navigate(s.link)} className={`rounded-2xl p-5 flex items-center gap-4 hover:shadow-elevated transition-all text-left group bg-gradient-to-r ${s.bg} text-white`}> 
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.iconBg)}>
              <s.icon className={cn("w-6 h-6", s.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/80">{s.sub}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/90 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Tiến độ tổng quan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Buổi dạy</span>
              <span className="text-xs font-semibold text-foreground">{totalSessionsCompleted}/{totalSessionsAll}</span>
            </div>
            <Progress value={(totalSessionsCompleted / totalSessionsAll) * 100} className="h-2.5" />
            <p className="text-[10px] text-muted-foreground mt-1">{Math.round((totalSessionsCompleted / totalSessionsAll) * 100)}% hoàn thành</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Giải ngân Escrow</span>
              <span className="text-xs font-semibold text-success">
                {classes.reduce((s, c) => s + c.escrowReleased, 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div className="bg-success/150 h-full rounded-full transition-all" style={{ width: `${(classes.reduce((s, c) => s + c.escrowReleased, 0) / Math.max(1, classes.reduce((s, c) => s + c.escrowAmount, 0))) * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Đang giữ: {escrowBalance.toLocaleString("vi-VN")}đ</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Tỷ lệ đậu test</span>
              <span className="text-xs font-semibold text-foreground">{profile.testPassRate}%</span>
            </div>
            <Progress value={profile.testPassRate} className="h-2.5" />
            <p className="text-[10px] text-muted-foreground mt-1">{profile.totalReviews} đánh giá • {profile.rating.toFixed(1)} ★</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Income Line Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-success" /> Thu nhập theo tháng
            </h3>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}tr`} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString("vi-VN")}đ`} />} />
                <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Active Classes Progress */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Tiến độ lớp học
            </h3>
            <div className="space-y-4">
              {activeClasses.map(c => (
                <button key={c.id} onClick={() => navigate(`/tutor/classes/${c.id}`)} className="w-full text-left group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <img src={c.studentAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.studentName} • {c.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{c.completedSessions}/{c.totalSessions}</p>
                      <p className="text-[10px] text-muted-foreground">{Math.round((c.completedSessions / c.totalSessions) * 100)}%</p>
                    </div>
                  </div>
                  <Progress value={(c.completedSessions / c.totalSessions) * 100} className="h-1.5" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">Escrow: {c.escrowReleased.toLocaleString("vi-VN")}đ / {c.escrowAmount.toLocaleString("vi-VN")}đ</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
              {activeClasses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Không có lớp đang hoạt động</p>}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between">
              <span>Yêu cầu học thử</span>
              {pendingTrials.length > 0 && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-warning dark:bg-amber-900/30 dark:text-amber-400">{pendingTrials.length}</span>}
            </h3>
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

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Ví điện tử</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-success/15 dark:bg-emerald-900/20 rounded-xl">
                <span className="text-xs text-muted-foreground">Khả dụng</span>
                <span className="text-sm font-bold text-success">{walletBalance.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                <span className="text-xs text-muted-foreground">Escrow đang giữ</span>
                <span className="text-sm font-bold text-primary">{escrowBalance.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
            <button onClick={() => navigate("/tutor/wallet")} className="w-full mt-3 text-xs text-primary font-medium hover:underline">Xem chi tiết →</button>
          </div>

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

          {studentProgress.filter(sp => sp.completedSessions > 0).length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Tiến độ học sinh</h3>
              {studentProgress.filter(sp => sp.completedSessions > 0).slice(0, 3).map(sp => (
                <button key={sp.studentId + sp.classId} onClick={() => navigate("/tutor/students")} className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2 last:mb-0 text-left hover:bg-muted transition-colors">
                  <img src={sp.studentAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{sp.studentName}</p>
                    <p className="text-[10px] text-muted-foreground">{sp.className}</p>
                    <Progress value={sp.goalCompletion} className="h-1 mt-1" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">{sp.averageScore > 0 ? sp.averageScore.toFixed(1) : "—"}</p>
                    <p className="text-[10px] text-muted-foreground">ĐTB</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} className="relative w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105">
            <MessageSquare className="w-6 h-6" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
                {unreadMessages}
              </span>
            )}
          </button>
        ) : (
          <div className="w-[380px] h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedChatClass ? classes.find(c => c.id === selectedChatClass)?.name : "Tin nhắn"}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {selectedChatClass && (
                  <>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Gọi thoại"><Phone className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Gọi video"><Video className="w-4 h-4" /></button>
                    <button onClick={() => setSelectedChatClass(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                  </>
                )}
                <button onClick={() => { setChatOpen(false); setSelectedChatClass(null); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
            </div>
            {!selectedChatClass ? (
              <div className="flex-1 overflow-y-auto">
                {classes.filter(c => c.escrowStatus !== "refunded").map(c => {
                  const lastMsg = chatMessages.filter(m => m.classId === c.id).slice(-1)[0];
                  const unread = unreadByClass(c.id);
                  return (
                    <button key={c.id} onClick={() => setSelectedChatClass(c.id)} className="w-full text-left p-4 border-b border-border/50 hover:bg-muted/50 transition-colors flex items-center gap-3">
                      <div className="relative">
                        <img src={c.studentAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground px-0.5">{unread}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                          {lastMsg && <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{lastMsg.timestamp.split(" ")[1]}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{lastMsg ? `${lastMsg.senderName}: ${lastMsg.message}` : "Chưa có tin nhắn"}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {chatClassMessages.map(m => (
                    <div key={m.id} className={cn("flex", m.sender === "tutor" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] px-3 py-2 rounded-2xl text-sm", m.sender === "tutor" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                        {m.sender !== "tutor" && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{m.senderName}</p>}
                        <p className="text-[13px]">{m.message}</p>
                        <p className={cn("text-[9px] mt-0.5", m.sender === "tutor" ? "text-primary-foreground/60" : "text-muted-foreground")}>{m.timestamp.split(" ")[1]}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-border flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendChat()} className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="Nhập tin nhắn..." />
                  <button onClick={handleSendChat} disabled={!chatInput.trim()} className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
