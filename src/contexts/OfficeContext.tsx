import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  tutor: string;
  student: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "reported" | "upcoming" | "completed";
  parentConfirmed: boolean;
  issue?: string;
}

export interface IncidentReport {
  id: string;
  attendanceId: string;
  className: string;
  reporter: string;
  reporterRole: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "investigating" | "resolved";
  createdAt: string;
  resolution?: string;
}

export interface OfficeClass {
  id: string;
  name: string;
  tutor: string;
  tutorAvatar: string;
  student: string;
  studentAvatar: string;
  schedule: string;
  fee: number;
  status: "active" | "completed" | "paused" | "searching";
  subject: string;
  totalSessions: number;
  completedSessions: number;
}

export interface ScheduleConstraint {
  id: string;
  type: "tutor_unavailable" | "student_unavailable" | "room_occupied" | "preferred_time";
  description: string;
  personId: string;
  personName: string;
  timeSlots: string[];
}

export interface AIScheduleResult {
  id: string;
  className: string;
  suggestedTime: string;
  confidence: number;
  conflicts: string[];
}

export interface OfficeNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

const seedAttendance: AttendanceRecord[] = [
  { id: "a1", classId: "c1", className: "Toán 12 - Ôn thi ĐH", tutor: "Nguyễn Văn An", student: "Lê Minh Châu", date: "03/03/2026", time: "19:00-21:00", status: "pending", parentConfirmed: false },
  { id: "a2", classId: "c2", className: "Văn 11 - Nâng cao", tutor: "Trần Thị Bích", student: "Ngô Thị Lan", date: "03/03/2026", time: "18:00-20:00", status: "completed", parentConfirmed: true },
  { id: "a3", classId: "c1", className: "Toán 12 - Ôn thi ĐH", tutor: "Nguyễn Văn An", student: "Lê Minh Châu", date: "02/03/2026", time: "19:00-21:00", status: "reported", parentConfirmed: false, issue: "Học sinh báo gia sư vắng mặt" },
  { id: "a4", classId: "c3", className: "IELTS Writing", tutor: "Đỗ Quang Minh", student: "Trương Văn Kiên", date: "04/03/2026", time: "09:00-12:00", status: "upcoming", parentConfirmed: false },
  { id: "a5", classId: "c2", className: "Văn 11 - Nâng cao", tutor: "Trần Thị Bích", student: "Ngô Thị Lan", date: "01/03/2026", time: "18:00-20:00", status: "completed", parentConfirmed: true },
  { id: "a6", classId: "c1", className: "Toán 12 - Ôn thi ĐH", tutor: "Nguyễn Văn An", student: "Lê Minh Châu", date: "28/02/2026", time: "19:00-21:00", status: "completed", parentConfirmed: true },
  { id: "a7", classId: "c3", className: "IELTS Writing", tutor: "Đỗ Quang Minh", student: "Trương Văn Kiên", date: "01/03/2026", time: "09:00-12:00", status: "pending", parentConfirmed: false },
  { id: "a8", classId: "c4", className: "Lý 10 - Nâng cao", tutor: "Hoàng Đức Em", student: "Lê Minh Châu", date: "05/03/2026", time: "17:00-19:00", status: "upcoming", parentConfirmed: false },
];

const seedIncidents: IncidentReport[] = [
  { id: "i1", attendanceId: "a3", className: "Toán 12 - Ôn thi ĐH", reporter: "Phạm Hồng Đào", reporterRole: "Phụ huynh", description: "Gia sư không có mặt đúng giờ, học sinh chờ 30 phút", priority: "high", status: "pending", createdAt: "02/03/2026 19:45" },
  { id: "i2", attendanceId: "a2", className: "Văn 11 - Nâng cao", reporter: "Ngô Thị Lan", reporterRole: "Học sinh", description: "Buổi học kết thúc sớm 20 phút so với lịch", priority: "medium", status: "investigating", createdAt: "01/03/2026 20:05" },
  { id: "i3", attendanceId: "a6", className: "Toán 12 - Ôn thi ĐH", reporter: "Lê Minh Châu", reporterRole: "Học sinh", description: "Nội dung bài học không khớp với chương trình đã thỏa thuận", priority: "low", status: "resolved", createdAt: "28/02/2026 21:15" },
];

const seedClasses: OfficeClass[] = [
  { id: "c1", name: "Toán 12 - Ôn thi ĐH", tutor: "Nguyễn Văn An", tutorAvatar: avatarMale1, student: "Lê Minh Châu", studentAvatar: avatarMale2, schedule: "T2, T4, T6 - 19:00", fee: 2000000, status: "active", subject: "Toán", totalSessions: 24, completedSessions: 14 },
  { id: "c2", name: "Văn 11 - Nâng cao", tutor: "Trần Thị Bích", tutorAvatar: avatarFemale1, student: "Ngô Thị Lan", studentAvatar: avatarFemale2, schedule: "T3, T5 - 18:00", fee: 1500000, status: "active", subject: "Văn", totalSessions: 16, completedSessions: 9 },
  { id: "c3", name: "IELTS Writing", tutor: "Đỗ Quang Minh", tutorAvatar: avatarMale3, student: "Trương Văn Kiên", studentAvatar: avatarMale2, schedule: "T7 - 09:00", fee: 3000000, status: "active", subject: "Anh", totalSessions: 12, completedSessions: 2 },
  { id: "c4", name: "Lý 10 - Nâng cao", tutor: "Hoàng Đức Em", tutorAvatar: avatarMale3, student: "Lê Minh Châu", studentAvatar: avatarMale2, schedule: "T3, T6 - 17:00", fee: 1800000, status: "searching", subject: "Lý", totalSessions: 20, completedSessions: 0 },
  { id: "c5", name: "Hóa 12 - Ôn thi", tutor: "Vũ Thị Phương", tutorAvatar: avatarFemale3, student: "Ngô Thị Lan", studentAvatar: avatarFemale2, schedule: "T2, T5 - 15:00", fee: 1700000, status: "completed", subject: "Hóa", totalSessions: 20, completedSessions: 20 },
];

const seedConstraints: ScheduleConstraint[] = [
  { id: "sc1", type: "tutor_unavailable", description: "Gia sư An không dạy sáng T2-T6", personId: "u1", personName: "Nguyễn Văn An", timeSlots: ["T2-T6: 07:00-12:00"] },
  { id: "sc2", type: "student_unavailable", description: "HS Châu học chính khóa buổi sáng", personId: "u3", personName: "Lê Minh Châu", timeSlots: ["T2-T6: 07:00-17:00"] },
  { id: "sc3", type: "preferred_time", description: "HS Lan ưu tiên học buổi tối", personId: "u8", personName: "Ngô Thị Lan", timeSlots: ["T2-CN: 18:00-21:00"] },
];

const seedNotifications: OfficeNotification[] = [
  { id: "on1", title: "Điểm danh cần xác nhận", message: "3 buổi học chờ xác nhận điểm danh", type: "warning", read: false, timestamp: "03/03/2026 08:00" },
  { id: "on2", title: "Sự cố mới báo cáo", message: "Phụ huynh Phạm Hồng Đào báo cáo sự cố lớp Toán 12", type: "error", read: false, timestamp: "02/03/2026 19:45" },
  { id: "on3", title: "Lớp mới cần xếp lịch", message: "Lớp Lý 10 - Nâng cao đang tìm lịch phù hợp", type: "info", read: false, timestamp: "01/03/2026 10:00" },
  { id: "on4", title: "Đăng ký mới", message: "2 học sinh mới đăng ký trong tuần", type: "success", read: true, timestamp: "28/02/2026 16:00" },
  { id: "on5", title: "Báo cáo tuần", message: "Báo cáo tuần 9 đã sẵn sàng để xem", type: "info", read: true, timestamp: "27/02/2026 09:00" },
];

interface OfficeContextType {
  attendance: AttendanceRecord[];
  incidents: IncidentReport[];
  classes: OfficeClass[];
  constraints: ScheduleConstraint[];
  notifications: OfficeNotification[];
  confirmAttendance: (id: string) => void;
  resolveIncident: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addClass: (cls: OfficeClass) => void;
  profile: { name: string; role: string; avatar: string };
}

const OfficeContext = createContext<OfficeContextType | null>(null);

export const useOffice = () => {
  const ctx = useContext(OfficeContext);
  if (!ctx) throw new Error("useOffice must be inside OfficeProvider");
  return ctx;
};

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [attendance, setAttendance] = useState(seedAttendance);
  const [incidents, setIncidents] = useState(seedIncidents);
  const [classes, setClasses] = useState(seedClasses);
  const [constraints] = useState(seedConstraints);
  const [notifications, setNotifications] = useState(seedNotifications);

  const confirmAttendance = useCallback((id: string) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, status: "confirmed" as const, parentConfirmed: true } : a));
  }, []);

  const resolveIncident = useCallback((id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: "resolved" as const } : i));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addClass = useCallback((cls: OfficeClass) => {
    setClasses(prev => [cls, ...prev]);
  }, []);

  const profile = { name: "Trần Minh Tú", role: "Nhân viên văn phòng", avatar: avatarFemale1 };

  return (
    <OfficeContext.Provider value={{ attendance, incidents, classes, constraints, notifications, confirmAttendance, resolveIncident, markNotificationRead, markAllNotificationsRead, addClass, profile }}>
      {children}
    </OfficeContext.Provider>
  );
};
