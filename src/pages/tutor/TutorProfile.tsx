import { useTutor } from "@/contexts/TutorContext";
import { ShieldCheck, Star, BookOpen, Trophy, Video, Edit2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const TutorProfile = () => {
  const { profile, updateProfile } = useTutor();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bio: profile.bio,
    hourlyRate: profile.hourlyRate,
    videoUrl: profile.videoUrl,
  });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Đã cập nhật hồ sơ!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              {profile.degreeVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{profile.school} • {profile.degree}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold">{profile.rating}</span>
                <span className="text-xs text-muted-foreground">({profile.totalReviews})</span>
              </div>
              <span className="text-xs text-muted-foreground">{profile.totalSessions} buổi đã dạy</span>
              <span className="text-xs text-muted-foreground">Test pass: {profile.testPassRate}%</span>
            </div>
            <div className="flex gap-2 mt-3">
              {profile.subjects.map(s => (
                <span key={s} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">{s}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            {editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Verified Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-4 rounded-2xl border flex items-center gap-3", profile.transcriptVerified ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10" : "border-border bg-card")}>
          <ShieldCheck className={cn("w-6 h-6", profile.transcriptVerified ? "text-emerald-600" : "text-muted-foreground")} />
          <div>
            <p className="text-sm font-medium text-foreground">Bảng điểm</p>
            <p className="text-xs text-muted-foreground">{profile.transcriptVerified ? "Đã xác minh bởi Admin" : "Chưa xác minh"}</p>
          </div>
        </div>
        <div className={cn("p-4 rounded-2xl border flex items-center gap-3", profile.degreeVerified ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10" : "border-border bg-card")}>
          <Trophy className={cn("w-6 h-6", profile.degreeVerified ? "text-emerald-600" : "text-muted-foreground")} />
          <div>
            <p className="text-sm font-medium text-foreground">Văn bằng</p>
            <p className="text-xs text-muted-foreground">{profile.degreeVerified ? "Đã xác minh bởi Admin" : "Chưa xác minh"}</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Giới thiệu</h3>
        {editing ? (
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm h-24 resize-none"
          />
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Video */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Video giới thiệu</h3>
        {editing ? (
          <input
            value={form.videoUrl}
            onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm"
            placeholder="YouTube embed URL"
          />
        ) : profile.videoUrl ? (
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <iframe src={profile.videoUrl} className="w-full h-full" allowFullScreen title="Intro video" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Chưa có video giới thiệu</p>
        )}
      </div>

      {/* Hourly Rate */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Giá dạy</h3>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.hourlyRate}
              onChange={e => setForm(p => ({ ...p, hourlyRate: parseInt(e.target.value) || 0 }))}
              className="w-40 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm"
            />
            <span className="text-sm text-muted-foreground">đ/giờ</span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-primary">{profile.hourlyRate.toLocaleString("vi-VN")}đ <span className="text-sm font-normal text-muted-foreground">/ giờ</span></p>
        )}
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
