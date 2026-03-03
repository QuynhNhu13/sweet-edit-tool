import { useParent } from "@/contexts/ParentContext";
import { Users, BookOpen, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ParentChildren = () => {
  const { children } = useParent();
  const totalClasses = children.reduce((s, c) => s + c.totalClasses, 0);
  const avgAttendance = children.length > 0 ? Math.round(children.reduce((s, c) => s + c.attendance, 0) / children.length) : 0;
  const avgGpa = children.length > 0 ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1) : "0";

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Số con em", value: String(children.length) },
          { icon: BookOpen, label: "Tổng lớp học", value: String(totalClasses) },
          { icon: CheckCircle2, label: "Chuyên cần TB", value: `${avgAttendance}%` },
          { icon: Star, label: "Điểm trung bình", value: avgGpa },
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

      {/* Children List */}
      <div className="space-y-4">
        {children.map(child => (
          <div key={child.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <img src={child.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground">{child.name}</p>
                <p className="text-xs text-muted-foreground">{child.grade} • {child.school}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-bold text-foreground">GPA: {child.gpa}</p>
                <p className="text-xs text-muted-foreground">Chuyên cần: {child.attendance}%</p>
              </div>
            </div>
            <div className="space-y-2">
              {child.classes.map(cls => (
                <div key={cls.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <img src={cls.tutorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{cls.name}</p>
                    <p className="text-[11px] text-muted-foreground">{cls.tutorName} • {cls.schedule}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{cls.completedSessions}/{cls.totalSessions} buổi</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5">{cls.status === "active" ? "Đang học" : "Hoàn thành"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentChildren;
