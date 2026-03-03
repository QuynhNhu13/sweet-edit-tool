import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import studentAvatar1 from "@/assets/student-avatar-1.jpg";
import studentAvatar2 from "@/assets/student-avatar-2.jpg";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor5 from "@/assets/tutor-5.jpg";

export interface ParentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface ChildInfo {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  school: string;
  gpa: number;
  totalClasses: number;
  attendance: number;
  classes: ChildClass[];
}

export interface ChildClass {
  id: string;
  name: string;
  subject: string;
  tutorName: string;
  tutorAvatar: string;
  schedule: string;
  fee: number;
  totalSessions: number;
  completedSessions: number;
  status: "active" | "completed";
  dueDate?: string;
  paid: boolean;
}

export interface ParentNotification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ParentChatMessage {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  sender: "parent" | "other";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ParentTransaction {
  id: string;
  type: "deposit" | "tuition_payment" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
  childId?: string;
}

export interface ChildMonthlyProgress {
  month: string;
  gpa: number;
  attendance: number;
  sessionsCompleted: number;
}

// ========== SEED DATA ==========

const parentProfile: ParentProfile = {
  id: "p1",
  name: "Nguyễn Văn Phụ Huynh",
  avatar: avatarMale1,
  email: "phuhuynh.nguyen@gmail.com",
  phone: "0901234567",
};

const children: ChildInfo[] = [
  {
    id: "c1", name: "Nguyễn Minh An", avatar: studentAvatar1, grade: "Lớp 12",
    school: "THPT Nguyễn Thị Minh Khai", gpa: 8.2, totalClasses: 3, attendance: 92,
    classes: [
      { id: "cc1", name: "Toán 12 - Ôn thi ĐH", subject: "Toán", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, schedule: "T2, T4, T6 - 19:00-21:00", fee: 2000000, totalSessions: 24, completedSessions: 12, status: "active", dueDate: "2026-03-15", paid: false },
      { id: "cc2", name: "IELTS Writing", subject: "Anh văn", tutorName: "Phạm Đức Huy", tutorAvatar: tutor3, schedule: "T7 - 9:00-10:30", fee: 3000000, totalSessions: 12, completedSessions: 4, status: "active", dueDate: "2026-03-10", paid: false },
      { id: "cc3", name: "Hóa 11 - Cơ bản", subject: "Hóa", tutorName: "Trần Thị Bích Ngọc", tutorAvatar: tutor5, schedule: "T5 - 19:00-20:30", fee: 1800000, totalSessions: 20, completedSessions: 20, status: "completed", paid: true },
    ],
  },
  {
    id: "c2", name: "Nguyễn Thu Hà", avatar: studentAvatar2, grade: "Lớp 9",
    school: "THCS Trần Văn Ơn", gpa: 8.8, totalClasses: 2, attendance: 96,
    classes: [
      { id: "cc4", name: "Toán 9 - Luyện thi", subject: "Toán", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, schedule: "T3, T5 - 17:00-18:30", fee: 1500000, totalSessions: 20, completedSessions: 10, status: "active", dueDate: "2026-03-20", paid: false },
      { id: "cc5", name: "Văn 9 - Nâng cao", subject: "Văn", tutorName: "Lê Thị Hồng Nhung", tutorAvatar: tutor5, schedule: "T7 - 14:00-16:00", fee: 1200000, totalSessions: 16, completedSessions: 8, status: "active", paid: true },
    ],
  },
];

const seedNotifications: ParentNotification[] = [
  { id: "pn1", type: "warning", title: "Học phí sắp đến hạn", message: "Lớp Toán 12 của Minh An cần thanh toán trước 15/03.", timestamp: "03/03/2026 08:00", read: false },
  { id: "pn2", type: "info", title: "Báo cáo tuần", message: "Báo cáo tuần 9 của Minh An đã sẵn sàng.", timestamp: "02/03/2026 10:00", read: false },
  { id: "pn3", type: "success", title: "Hoàn thành buổi học", message: "Thu Hà đã hoàn thành buổi Toán 9 ngày 01/03.", timestamp: "01/03/2026 18:35", read: false },
  { id: "pn4", type: "warning", title: "Vắng buổi học", message: "Minh An vắng buổi Lý 12 ngày 25/02.", timestamp: "25/02/2026 18:00", read: true },
  { id: "pn5", type: "info", title: "Tin nhắn mới", message: "Thầy Nguyễn Văn An gửi tin nhắn về tiến độ học tập.", timestamp: "28/02/2026 20:20", read: true },
];

const seedChatMessages: ParentChatMessage[] = [
  { id: "pcm1", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "other", message: "Chị ơi, em An tuần này tiến bộ rất nhiều phần tích phân ạ.", timestamp: "28/02 20:15", read: true },
  { id: "pcm2", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "parent", message: "Cảm ơn thầy, ở nhà em cũng chăm chỉ lắm ạ.", timestamp: "28/02 20:30", read: true },
  { id: "pcm3", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "other", message: "Tuần tới thầy sẽ cho kiểm tra thử nhé chị.", timestamp: "01/03 09:00", read: false },
  { id: "pcm4", contactId: "t3", contactName: "Phạm Đức Huy", contactAvatar: tutor3, sender: "other", message: "Em An cần luyện thêm Writing Task 2, tuần sau thầy tập trung phần này.", timestamp: "02/03 14:00", read: false },
  { id: "pcm5", contactId: "t3", contactName: "Phạm Đức Huy", contactAvatar: tutor3, sender: "parent", message: "Dạ vâng thầy, nhờ thầy kèm thêm em ạ.", timestamp: "02/03 14:30", read: true },
];

const seedTransactions: ParentTransaction[] = [
  { id: "pt1", type: "deposit", amount: 10000000, description: "Nạp tiền vào ví", date: "2026-01-10", status: "completed" },
  { id: "pt2", type: "tuition_payment", amount: -2000000, description: "Thanh toán - Toán 12 (Minh An)", date: "2026-01-15", status: "completed", childId: "c1" },
  { id: "pt3", type: "tuition_payment", amount: -3000000, description: "Thanh toán - IELTS Writing (Minh An)", date: "2026-02-01", status: "completed", childId: "c1" },
  { id: "pt4", type: "tuition_payment", amount: -1500000, description: "Thanh toán - Toán 9 (Thu Hà)", date: "2026-02-05", status: "completed", childId: "c2" },
  { id: "pt5", type: "tuition_payment", amount: -1200000, description: "Thanh toán - Văn 9 (Thu Hà)", date: "2026-02-10", status: "completed", childId: "c2" },
  { id: "pt6", type: "refund", amount: 500000, description: "Hoàn tiền 3 buổi - Hóa 11 (Minh An)", date: "2026-02-15", status: "completed", childId: "c1" },
  { id: "pt7", type: "deposit", amount: 5000000, description: "Nạp tiền vào ví", date: "2026-02-28", status: "completed" },
];

const childProgress: Record<string, ChildMonthlyProgress[]> = {
  c1: [
    { month: "T10/2025", gpa: 7.8, attendance: 88, sessionsCompleted: 10 },
    { month: "T11/2025", gpa: 8.0, attendance: 90, sessionsCompleted: 12 },
    { month: "T12/2025", gpa: 7.9, attendance: 85, sessionsCompleted: 10 },
    { month: "T1/2026", gpa: 8.1, attendance: 92, sessionsCompleted: 14 },
    { month: "T2/2026", gpa: 8.2, attendance: 92, sessionsCompleted: 16 },
  ],
  c2: [
    { month: "T10/2025", gpa: 8.4, attendance: 95, sessionsCompleted: 8 },
    { month: "T11/2025", gpa: 8.5, attendance: 96, sessionsCompleted: 8 },
    { month: "T12/2025", gpa: 8.6, attendance: 94, sessionsCompleted: 7 },
    { month: "T1/2026", gpa: 8.7, attendance: 96, sessionsCompleted: 8 },
    { month: "T2/2026", gpa: 8.8, attendance: 96, sessionsCompleted: 10 },
  ],
};

// ========== CONTEXT ==========

interface ParentContextType {
  profile: ParentProfile;
  children: ChildInfo[];
  notifications: ParentNotification[];
  chatMessages: ParentChatMessage[];
  transactions: ParentTransaction[];
  walletBalance: number;
  childProgress: Record<string, ChildMonthlyProgress[]>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendChatMessage: (contactId: string, message: string) => void;
  markChatRead: (contactId: string) => void;
  payChildTuition: (classId: string, childId: string, amount: number, description: string) => void;
  depositWallet: (amount: number) => void;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export const useParent = () => {
  const ctx = useContext(ParentContext);
  if (!ctx) throw new Error("useParent must be used within ParentProvider");
  return ctx;
};

export const ParentProvider = ({ children: kids }: { children: ReactNode }) => {
  const [profile] = useState(parentProfile);
  const [childrenState, setChildren] = useState(children);
  const [notifs, setNotifs] = useState(seedNotifications);
  const [chatMsgs, setChatMsgs] = useState(seedChatMessages);
  const [txns, setTxns] = useState(seedTransactions);

  const walletBalance = txns.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const markNotificationRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const sendChatMessage = useCallback((contactId: string, message: string) => {
    const contact = chatMsgs.find(m => m.contactId === contactId);
    const newMsg: ParentChatMessage = {
      id: `pcm${Date.now()}`, contactId,
      contactName: contact?.contactName || "", contactAvatar: contact?.contactAvatar || "",
      sender: "parent", message,
      timestamp: new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setChatMsgs(prev => [...prev, newMsg]);
  }, [chatMsgs]);

  const markChatRead = useCallback((contactId: string) => {
    setChatMsgs(prev => prev.map(m => m.contactId === contactId ? { ...m, read: true } : m));
  }, []);

  const payChildTuition = useCallback((classId: string, childId: string, amount: number, description: string) => {
    setTxns(prev => [...prev, { id: `pt${Date.now()}`, type: "tuition_payment" as const, amount: -amount, description, date: new Date().toISOString().split("T")[0], status: "completed" as const, childId }]);
    setChildren(prev => prev.map(c => c.id === childId ? { ...c, classes: c.classes.map(cl => cl.id === classId ? { ...cl, paid: true } : cl) } : c));
  }, []);

  const depositWallet = useCallback((amount: number) => {
    setTxns(prev => [...prev, { id: `pt${Date.now()}`, type: "deposit" as const, amount, description: "Nạp tiền vào ví", date: new Date().toISOString().split("T")[0], status: "completed" as const }]);
  }, []);

  return (
    <ParentContext.Provider value={{
      profile, children: childrenState, notifications: notifs, chatMessages: chatMsgs,
      transactions: txns, walletBalance, childProgress,
      markNotificationRead, markAllNotificationsRead, sendChatMessage, markChatRead,
      payChildTuition, depositWallet,
    }}>
      {kids}
    </ParentContext.Provider>
  );
};
