import { useParent } from "@/contexts/ParentContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, Star, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(224, 76%, 48%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)"];

const ParentReports = () => {
  const { children, childProgress } = useParent();
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const [tab, setTab] = useState<"overview" | "subjects" | "trends">("overview");

  const child = children.find(c => c.id === selectedChild);
  const progress = childProgress[selectedChild] || [];
  const latest = progress[progress.length - 1];
  const prev = progress[progress.length - 2];
  const gpaDiff = latest && prev ? (latest.gpa - prev.gpa).toFixed(1) : "0";

  const totalSessions = child?.classes.reduce((s, c) => s + c.completedSessions, 0) || 0;
  const attended = Math.round(totalSessions * ((child?.attendance || 0) / 100));

  const handleExport = () => {
    toast.success("Đang xuất báo cáo PDF...");
    setTimeout(() => toast.success("Đã xuất báo cáo thành công!"), 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelectedChild(c.id)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", selectedChild === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
              {c.name}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-1" onClick={handleExport}>
          <Download className="w-3.5 h-3.5" /> Xuất báo cáo PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Tổng buổi học", value: String(totalSessions) },
          { icon: CheckCircle2, label: "Đã tham gia", value: String(attended) },
          { icon: Star, label: "Điểm trung bình", value: String(child?.gpa || 0) },
          { icon: TrendingUp, label: "So tháng trước", value: `${Number(gpaDiff) >= 0 ? "+" : ""}${gpaDiff}` },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><s.icon className="w-4 h-4 text-foreground" /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {[{ key: "overview", label: "Tổng quan" }, { key: "subjects", label: "Môn học" }, { key: "trends", label: "Phân tích & Xu hướng" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {tab === "overview" ? "Tiến triển GPA" : tab === "subjects" ? "Hiệu suất theo môn" : "Xu hướng chuyên cần"}
        </h3>
        {progress.length > 0 ? (
          <ChartContainer config={{ gpa: { label: "GPA", color: COLORS[0] }, attendance: { label: "Chuyên cần", color: COLORS[1] } }} className="h-[280px] w-full">
            <LineChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {(tab === "overview" || tab === "trends") && <Line type="monotone" dataKey="gpa" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />}
              {(tab === "trends" || tab === "subjects") && <Line type="monotone" dataKey="attendance" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 4 }} />}
              {tab === "overview" && <Line type="monotone" dataKey="sessionsCompleted" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 4 }} />}
            </LineChart>
          </ChartContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
};

export default ParentReports;
