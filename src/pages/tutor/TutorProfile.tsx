import { useTutor } from "@/contexts/TutorContext";
import { ShieldCheck, Star, BookOpen, Trophy, Video, Edit2, Save, MapPin, Phone, Mail, Calendar, Award, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const TutorProfile = () => {
  const { profile, updateProfile, classes, reviews, studentProgress } = useTutor();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: profile.bio, hourlyRate: profile.hourlyRate, videoUrl: profile.videoUrl, teachingStyle: profile.teachingStyle, location: profile.location });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Đã cập nhật hồ sơ!");
  };

  const totalStudents = new Set(studentProgress.map(s => s.studentId)).size;
  const completedClasses = classes.filter(c => c.escrowStatus === "completed").length;
  const activeClasses = classes.filter(c => c.escrowStatus === "in_progress").length;

  // Radar data for subjects
  const subjectData = profile.subjects.map(s => {
    const subReviews = reviews.filter(r => r.subject === s);
    return { subject: s, rating: subReviews.length > 0 ? subReviews.reduce((sum, r) => sum + r.rating, 0) / subReviews.length : 0, fullMark: 5 };
  });

  // Monthly sessions chart
  const monthlySessionData = [
    { month: "T10", sessions: 15 }, { month: "T11", sessions: 22 },
    { month: "T12", sessions: 18 }, { month: "T1", sessions: 25 },
    { month: "T2", sessions: 28 }, { month: "T3", sessions: 8 },
  ];

  const chartConfig = {
    rating: { label: "Đánh giá", color: "hsl(var(--primary))" },
    sessions: { label: "Buổi dạy", color: "hsl(var(--primary))" },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              {profile.degreeVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/15 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg"><ShieldCheck className="w-3 h-3" /> Verified</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{profile.school} • {profile.degree}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-sm font-semibold">{profile.rating}</span><span className="text-xs text-muted-foreground">({profile.totalReviews})</span></div>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="w-3 h-3" /> {profile.totalSessions} buổi</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Từ {profile.joinDate}</span>
            </div>
            <div className="flex gap-2 mt-3">
              {profile.subjects.map(s => <span key={s} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">{s}</span>)}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            {editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
          <p className="text-xs text-muted-foreground">Học sinh</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <BookOpen className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{activeClasses}</p>
          <p className="text-xs text-muted-foreground">Lớp đang dạy</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{completedClasses}</p>
          <p className="text-xs text-muted-foreground">Lớp hoàn thành</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{profile.testPassRate}%</p>
          <p className="text-xs text-muted-foreground">Test pass</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Award className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{profile.hourlyRate.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-muted-foreground">/ giờ</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-warning" /> Thành tích</h3>
        <div className="flex flex-wrap gap-2">
          {profile.achievements.map((a, i) => (
            <span key={i} className="px-3 py-1.5 bg-warning/15 dark:bg-amber-900/10 text-warning dark:text-amber-400 border border-warning/30 dark:border-warning/40 rounded-xl text-xs font-medium">{a}</span>
          ))}
        </div>
      </div>

      {/* Verified Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-4 rounded-2xl border flex items-center gap-3", profile.transcriptVerified ? "border-success/30 bg-success/15/50 dark:border-success/40 dark:bg-emerald-900/10" : "border-border bg-card")}>
          <ShieldCheck className={cn("w-6 h-6", profile.transcriptVerified ? "text-success" : "text-muted-foreground")} />
          <div><p className="text-sm font-medium text-foreground">Bảng điểm</p><p className="text-xs text-muted-foreground">{profile.transcriptVerified ? "Đã xác minh" : "Chưa xác minh"}</p></div>
        </div>
        <div className={cn("p-4 rounded-2xl border flex items-center gap-3", profile.degreeVerified ? "border-success/30 bg-success/15/50 dark:border-success/40 dark:bg-emerald-900/10" : "border-border bg-card")}>
          <Trophy className={cn("w-6 h-6", profile.degreeVerified ? "text-success" : "text-muted-foreground")} />
          <div><p className="text-sm font-medium text-foreground">Văn bằng</p><p className="text-xs text-muted-foreground">{profile.degreeVerified ? "Đã xác minh" : "Chưa xác minh"}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Thông tin liên hệ</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span>{profile.phone}</span></div>
            <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span>{profile.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{editing ? <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="px-2 py-1 bg-muted/50 border border-border rounded-lg text-sm" /> : profile.location}</span></div>
          </div>
        </div>

        {/* Monthly Sessions Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Số buổi dạy theo tháng</h3>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={monthlySessionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Giới thiệu</h3>
        {editing ? <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-24 resize-none" /> : <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>}
      </div>

      {/* Teaching Style */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Phương pháp giảng dạy</h3>
        {editing ? <textarea value={form.teachingStyle} onChange={e => setForm(p => ({ ...p, teachingStyle: e.target.value }))} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-20 resize-none" /> : <p className="text-sm text-muted-foreground leading-relaxed">{profile.teachingStyle}</p>}
      </div>

      {/* Video */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Video giới thiệu</h3>
        {editing ? <input value={form.videoUrl} onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" placeholder="YouTube embed URL" /> : profile.videoUrl ? (
          <div className="aspect-video rounded-xl overflow-hidden bg-muted"><iframe src={profile.videoUrl} className="w-full h-full" allowFullScreen title="Intro video" /></div>
        ) : <p className="text-sm text-muted-foreground text-center py-8">Chưa có video</p>}
      </div>

      {/* Hourly Rate */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Giá dạy</h3>
        {editing ? (
          <div className="flex items-center gap-2"><input type="number" value={form.hourlyRate} onChange={e => setForm(p => ({ ...p, hourlyRate: parseInt(e.target.value) || 0 }))} className="w-40 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm" /><span className="text-sm text-muted-foreground">đ/giờ</span></div>
        ) : <p className="text-2xl font-bold text-primary">{profile.hourlyRate.toLocaleString("vi-VN")}đ <span className="text-sm font-normal text-muted-foreground">/ giờ</span></p>}
      </div>

      {editing && (
        <div className="flex gap-3">
          <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">Lưu thay đổi</button>
          <button onClick={() => setEditing(false)} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-xl font-medium">Hủy</button>
        </div>
      )}
    </div>
  );
};

export default TutorProfile;
