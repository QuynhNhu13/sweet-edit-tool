import { useStudent, AvailabilitySlot } from "@/contexts/StudentContext";
import { Clock, Plus, Trash2, Copy, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const StudentAvailability = () => {
  const { availability, updateAvailability } = useStudent();
  const { toast } = useToast();
  const [localAvail, setLocalAvail] = useState<AvailabilitySlot[]>(JSON.parse(JSON.stringify(availability)));

  const toggleDay = (idx: number) => {
    setLocalAvail(prev => prev.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  };

  const addSlot = (dayIdx: number) => {
    setLocalAvail(prev => prev.map((a, i) => i === dayIdx ? { ...a, slots: [...a.slots, { from: "18:00", to: "20:00" }] } : a));
  };

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setLocalAvail(prev => prev.map((a, i) => i === dayIdx ? { ...a, slots: a.slots.filter((_, si) => si !== slotIdx) } : a));
  };

  const updateSlot = (dayIdx: number, slotIdx: number, field: "from" | "to", value: string) => {
    setLocalAvail(prev => prev.map((a, i) => i === dayIdx ? {
      ...a, slots: a.slots.map((s, si) => si === slotIdx ? { ...s, [field]: value } : s)
    } : a));
  };

  const copyPreviousDay = (dayIdx: number) => {
    if (dayIdx === 0) return;
    const prev = localAvail[dayIdx - 1];
    setLocalAvail(a => a.map((slot, i) => i === dayIdx ? { ...slot, enabled: prev.enabled, slots: JSON.parse(JSON.stringify(prev.slots)) } : slot));
  };

  const handleSave = () => {
    updateAvailability(localAvail);
    toast({ title: "Đã lưu!", description: "Khung giờ rảnh đã được cập nhật." });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Quản lý khung giờ rảnh
          </h3>
          <Button className="rounded-xl gap-2" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4" /> Lưu thay đổi
          </Button>
        </div>

        <div className="space-y-4">
          {localAvail.map((day, dayIdx) => (
            <div key={day.day} className={cn("border border-border rounded-xl p-4 transition-all", day.enabled ? "bg-card" : "bg-muted/30 opacity-60")}>
              <div className="flex items-center gap-4 mb-3">
                <Switch checked={day.enabled} onCheckedChange={() => toggleDay(dayIdx)} />
                <span className="text-sm font-semibold text-foreground w-20">{day.day}</span>
                <div className="flex-1" />
                {dayIdx > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-lg h-7" onClick={() => copyPreviousDay(dayIdx)}>
                    <Copy className="w-3 h-3" /> Copy ngày trước
                  </Button>
                )}
                {day.enabled && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-lg h-7" onClick={() => addSlot(dayIdx)}>
                    <Plus className="w-3 h-3" /> Thêm
                  </Button>
                )}
              </div>

              {day.enabled && (
                <div className="space-y-2 ml-14">
                  {day.slots.map((slot, slotIdx) => (
                    <div key={slotIdx} className="flex items-center gap-3">
                      <input type="time" value={slot.from} onChange={e => updateSlot(dayIdx, slotIdx, "from", e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm" />
                      <span className="text-xs text-muted-foreground">đến</span>
                      <input type="time" value={slot.to} onChange={e => updateSlot(dayIdx, slotIdx, "to", e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm" />
                      <button onClick={() => removeSlot(dayIdx, slotIdx)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {day.slots.length === 0 && <p className="text-xs text-muted-foreground">Chưa có khung giờ nào. Bấm "Thêm" để thêm.</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAvailability;
