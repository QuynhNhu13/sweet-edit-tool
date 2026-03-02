import { useTutor } from "@/contexts/TutorContext";
import { Star, TrendingUp, Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const TutorReviews = () => {
  const { profile, reviews } = useTutor();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState("all");

  const subjects = [...new Set(reviews.map(r => r.subject))];
  const filtered = reviews.filter(r => {
    if (search && !r.comment.toLowerCase().includes(search.toLowerCase()) && !r.parentName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRating && r.rating !== filterRating) return false;
    if (filterSubject !== "all" && r.subject !== filterSubject) return false;
    return true;
  });

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: reviews.length > 0 ? (reviews.filter(rv => rv.rating === r).length / reviews.length) * 100 : 0,
  }));

  // Chart data
  const barData = ratingDist.map(r => ({ name: `${r.stars}★`, count: r.count }));
  const subjectRatings = subjects.map(s => {
    const subReviews = reviews.filter(r => r.subject === s);
    return { subject: s, avg: subReviews.reduce((sum, r) => sum + r.rating, 0) / subReviews.length, count: subReviews.length };
  });

  // Tags
  const allTags = reviews.flatMap(r => r.tags || []);
  const tagCounts = allTags.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {} as Record<string, number>);
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const chartConfig = { count: { label: "Số lượng", color: "hsl(var(--primary))" } };
  const pieColors = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#6366f1", "#ef4444"];

  return (
    <div className="p-6 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{profile.rating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 justify-center my-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < Math.round(profile.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />)}
              </div>
              <p className="text-xs text-muted-foreground">{profile.totalReviews} đánh giá</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDist.map(r => (
                <button key={r.stars} onClick={() => setFilterRating(filterRating === r.stars ? null : r.stars)} className="flex items-center gap-2 w-full group">
                  <span className="text-xs text-muted-foreground w-4">{r.stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className={cn("rounded-full h-2 transition-all", filterRating === r.stars ? "bg-primary" : "bg-amber-400")} style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{r.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating by subject */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Đánh giá theo môn</h3>
          <div className="space-y-3">
            {subjectRatings.map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-12">{s.subject}</span>
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div className="bg-primary rounded-full h-3 transition-all flex items-center justify-end pr-1" style={{ width: `${(s.avg / 5) * 100}%` }}>
                    <span className="text-[8px] text-primary-foreground font-bold">{s.avg.toFixed(1)}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{s.count} đánh giá</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Từ khóa nổi bật</h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span key={tag} className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-medium">
                {tag} <span className="text-primary/60 ml-1">({count})</span>
              </span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-3xl font-bold text-primary">{profile.testPassRate}%</p>
            <p className="text-xs text-muted-foreground">Tỷ lệ đậu test</p>
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Rating Distribution Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Phân bố đánh giá</h3>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo nội dung, phụ huynh..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="all">Tất cả môn</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-1">
          {[5, 4, 3, 2, 1].map(r => (
            <button key={r} onClick={() => setFilterRating(filterRating === r ? null : r)} className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-colors", filterRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {r}★
            </button>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.parentName}</p>
                    <p className="text-xs text-muted-foreground">{r.className} • HS: {r.studentName} • {r.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />)}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
                {r.tags && r.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">{r.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary rounded-lg">{t}</span>)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không có đánh giá nào</p>}
      </div>
    </div>
  );
};

export default TutorReviews;
