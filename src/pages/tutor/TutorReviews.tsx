import { useTutor } from "@/contexts/TutorContext";
import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const TutorReviews = () => {
  const { profile, reviews } = useTutor();

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: reviews.length > 0 ? (reviews.filter(rv => rv.rating === r).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Summary */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{profile.rating.toFixed(1)}</p>
            <div className="flex items-center gap-0.5 justify-center my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < Math.round(profile.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{profile.totalReviews} đánh giá</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map(r => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4">{r.stars}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-amber-400 rounded-full h-2 transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="text-center px-6 border-l border-border">
            <p className="text-3xl font-bold text-primary">{profile.testPassRate}%</p>
            <p className="text-xs text-muted-foreground">Tỷ lệ đậu test</p>
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.parentName}</p>
                    <p className="text-xs text-muted-foreground">{r.className} • HS: {r.studentName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorReviews;
