import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";

// ========== TYPES ==========

export type EscrowStatus = "pending" | "in_progress" | "completed" | "refunded";
export type SessionStatus = "scheduled" | "completed" | "missed" | "cancelled";
export type TrialStatus = "pending" | "confirmed" | "rejected" | "completed";
export type WalletTxType = "escrow_in" | "escrow_release" | "withdrawal" | "refund" | "platform_fee";

export interface TutorProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  subjects: string[];
  bio: string;
  school: string;
  degree: string;
  degreeVerified: boolean;
  transcriptVerified: boolean;
  videoUrl: string;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  testPassRate: number;
  hourlyRate: number;
  availability: { day: string; slots: string[] }[];
}

export interface TutorClass {
  id: string;
  name: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  parentName: string;
  format: "online" | "offline" | "hybrid";
  fee: number;
  totalSessions: number;
  completedSessions: number;
  escrowStatus: EscrowStatus;
  escrowAmount: number;
  escrowReleased: number;
  releaseMilestone: number; // sessions needed for next release
  schedule: string;
  createdAt: string;
  sessions: TutorSession[];
}

export interface TutorSession {
  id: string;
  classId: string;
  date: string;
  time: string;
  status: SessionStatus;
  startedAt?: string;
  endedAt?: string;
  content?: string;
  notes?: string;
  homework?: string;
  rating?: number;
  ratingComment?: string;
}

export interface TrialBooking {
  id: string;
  parentName: string;
  parentAvatar: string;
  studentName: string;
  subject: string;
  requestedDate: string;
  requestedTime: string;
  status: TrialStatus;
  feedback?: string;
  rating?: number;
}

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  amount: number;
  date: string;
  description: string;
  classId?: string;
  status: "completed" | "pending";
}

export interface ChatMessage {
  id: string;
  classId: string;
  sender: "tutor" | "student" | "parent";
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  classId: string;
  className: string;
  subject: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  attendanceRate: number;
  goalCompletion: number;
  skills: { name: string; score: number; prevScore: number }[];
  weeklyReports: { week: string; sessions: number; avgScore: number; notes: string }[];
}

export interface TutorReview {
  id: string;
  classId: string;
  className: string;
  studentName: string;
  parentName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

// ========== SEED DATA ==========

const tutorProfile: TutorProfile = {
  id: "u1",
  name: "Nguyễn Văn An",
  avatar: avatarMale1,
  email: "an.nguyen@edu.vn",
  phone: "0901234567",
  subjects: ["Toán", "Lý"],
  bio: "Gia sư Toán - Lý với 5 năm kinh nghiệm dạy ôn thi đại học. Tốt nghiệp loại Giỏi ĐH Sư Phạm TP.HCM. Phương pháp giảng dạy tập trung vào tư duy logic và giải quyết vấn đề.",
  school: "ĐH Sư Phạm TP.HCM",
  degree: "Cử nhân Sư phạm Toán",
  degreeVerified: true,
  transcriptVerified: true,
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  rating: 4.8,
  totalReviews: 47,
  totalSessions: 312,
  testPassRate: 92,
  hourlyRate: 250000,
  availability: [
    { day: "Thứ 2", slots: ["17:00-19:00", "19:00-21:00"] },
    { day: "Thứ 3", slots: ["19:00-21:00"] },
    { day: "Thứ 4", slots: ["17:00-19:00", "19:00-21:00"] },
    { day: "Thứ 5", slots: ["19:00-21:00"] },
    { day: "Thứ 6", slots: ["17:00-19:00", "19:00-21:00"] },
    { day: "Thứ 7", slots: ["9:00-11:00", "14:00-16:00"] },
  ],
};

const seedSessions: TutorSession[] = [
  { id: "s1", classId: "c1", date: "2026-02-03", time: "19:00-21:00", status: "completed", startedAt: "19:02", endedAt: "20:58", content: "Giới hạn hàm số", notes: "Học sinh nắm tốt lý thuyết, cần luyện thêm bài tập", homework: "Bài 1-5 trang 45 SGK" },
  { id: "s2", classId: "c1", date: "2026-02-05", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:00", content: "Đạo hàm cơ bản", notes: "Cần ôn lại công thức", homework: "Làm đề số 3", rating: 5, ratingComment: "Thầy giảng rất dễ hiểu" },
  { id: "s3", classId: "c1", date: "2026-02-07", time: "19:00-21:00", status: "completed", startedAt: "19:05", endedAt: "20:55", content: "Đạo hàm nâng cao", notes: "Tiến bộ rõ rệt", homework: "Bài tập trắc nghiệm chương 3" },
  { id: "s4", classId: "c1", date: "2026-02-10", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:02", content: "Tích phân", notes: "Hiểu khái niệm nhưng cần luyện nhiều", homework: "10 bài tích phân cơ bản", rating: 4, ratingComment: "Bài hơi khó" },
  { id: "s5", classId: "c1", date: "2026-02-12", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:50", content: "Ôn tập tích phân", notes: "Đã làm tốt hơn", homework: "Đề thi thử số 1" },
  { id: "s6", classId: "c1", date: "2026-02-14", time: "19:00-21:00", status: "completed", startedAt: "19:01", endedAt: "21:00", content: "Hình học không gian", notes: "Yếu phần nhìn hình, cần bổ sung", homework: "Vẽ 5 hình không gian" },
  { id: "s7", classId: "c1", date: "2026-02-17", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:58", content: "Hình học giải tích", notes: "Khá tốt", homework: "Bài 1-8 chương 4" },
  { id: "s8", classId: "c1", date: "2026-02-19", time: "19:00-21:00", status: "completed", startedAt: "19:03", endedAt: "21:00", content: "Xác suất thống kê", notes: "Nắm vững", homework: "Bài tập xác suất", rating: 5, ratingComment: "Rất hài lòng" },
  { id: "s9", classId: "c1", date: "2026-02-21", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:55", content: "Tổ hợp chỉnh hợp", notes: "OK", homework: "Đề thi thử số 2" },
  { id: "s10", classId: "c1", date: "2026-02-24", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:05", content: "Ôn tập tổng hợp", notes: "Sẵn sàng cho đề thi thử", homework: "Làm 2 đề thi thử" },
  { id: "s11", classId: "c1", date: "2026-02-26", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:50", content: "Chữa đề thi thử 1", notes: "Điểm 7.5/10 - Cần cải thiện phần hình học" },
  { id: "s12", classId: "c1", date: "2026-02-28", time: "19:00-21:00", status: "completed", startedAt: "19:02", endedAt: "21:00", content: "Chữa đề thi thử 2", notes: "Điểm 8.0/10 - Tiến bộ tốt", rating: 5, ratingComment: "Con tiến bộ nhiều" },
  { id: "s13", classId: "c1", date: "2026-03-03", time: "19:00-21:00", status: "scheduled" },
  { id: "s14", classId: "c1", date: "2026-03-05", time: "19:00-21:00", status: "scheduled" },
  // Class c3 sessions
  { id: "s20", classId: "c3", date: "2026-03-01", time: "9:00-12:00", status: "scheduled" },
  { id: "s21", classId: "c3", date: "2026-03-08", time: "9:00-12:00", status: "scheduled" },
];

const seedClasses: TutorClass[] = [
  {
    id: "c1", name: "Toán 12 - Ôn thi ĐH", subject: "Toán",
    studentId: "u3", studentName: "Lê Minh Châu", studentAvatar: avatarMale2,
    parentName: "Phạm Hồng Đào", format: "online", fee: 2000000,
    totalSessions: 24, completedSessions: 12,
    escrowStatus: "in_progress", escrowAmount: 2000000, escrowReleased: 800000, releaseMilestone: 5,
    schedule: "T2, T4, T6 - 19:00-21:00", createdAt: "2026-01-15",
    sessions: seedSessions.filter(s => s.classId === "c1"),
  },
  {
    id: "c3", name: "IELTS Writing", subject: "Anh",
    studentId: "u11", studentName: "Trương Văn Kiên", studentAvatar: avatarMale3,
    parentName: "Trương Thị Hạnh", format: "hybrid", fee: 3000000,
    totalSessions: 12, completedSessions: 0,
    escrowStatus: "pending", escrowAmount: 3000000, escrowReleased: 0, releaseMilestone: 4,
    schedule: "T7 - 9:00-12:00", createdAt: "2026-02-15",
    sessions: seedSessions.filter(s => s.classId === "c3"),
  },
  {
    id: "c4", name: "Lý 10 - Cơ bản", subject: "Lý",
    studentId: "u3", studentName: "Lê Minh Châu", studentAvatar: avatarMale2,
    parentName: "Phạm Hồng Đào", format: "online", fee: 1800000,
    totalSessions: 20, completedSessions: 20,
    escrowStatus: "completed", escrowAmount: 1800000, escrowReleased: 1800000, releaseMilestone: 5,
    schedule: "T2, T6 - 17:00-19:00", createdAt: "2025-11-01",
    sessions: [],
  },
];

const seedTrials: TrialBooking[] = [
  { id: "tr1", parentName: "Ngô Thị Lan", parentAvatar: avatarFemale1, studentName: "Ngô Minh Tuấn", subject: "Toán", requestedDate: "2026-03-05", requestedTime: "19:00-20:00", status: "pending" },
  { id: "tr2", parentName: "Lý Thị Mai", parentAvatar: avatarFemale2, studentName: "Lý Quốc Bảo", subject: "Lý", requestedDate: "2026-03-06", requestedTime: "17:00-18:00", status: "confirmed" },
  { id: "tr3", parentName: "Phạm Hồng Đào", parentAvatar: avatarFemale3, studentName: "Lê Minh Châu", subject: "Toán", requestedDate: "2026-01-10", requestedTime: "19:00-20:00", status: "completed", feedback: "Thầy dạy rất tốt, con hiểu bài ngay", rating: 5 },
];

const seedWallet: WalletTransaction[] = [
  { id: "w1", type: "escrow_in", amount: 2000000, date: "2026-01-15", description: "Escrow nhận lớp Toán 12", classId: "c1", status: "completed" },
  { id: "w2", type: "escrow_release", amount: 400000, date: "2026-02-01", description: "Giải ngân đợt 1 - Toán 12 (5 buổi)", classId: "c1", status: "completed" },
  { id: "w3", type: "escrow_release", amount: 400000, date: "2026-02-15", description: "Giải ngân đợt 2 - Toán 12 (10 buổi)", classId: "c1", status: "completed" },
  { id: "w4", type: "platform_fee", amount: -160000, date: "2026-02-15", description: "Phí nền tảng 20% đợt giải ngân", status: "completed" },
  { id: "w5", type: "withdrawal", amount: -500000, date: "2026-02-20", description: "Rút tiền về tài khoản ngân hàng", status: "completed" },
  { id: "w6", type: "escrow_in", amount: 3000000, date: "2026-02-15", description: "Escrow nhận lớp IELTS Writing", classId: "c3", status: "pending" },
  { id: "w7", type: "escrow_in", amount: 1800000, date: "2025-11-01", description: "Escrow nhận lớp Lý 10", classId: "c4", status: "completed" },
  { id: "w8", type: "escrow_release", amount: 1440000, date: "2026-01-10", description: "Giải ngân toàn bộ - Lý 10 (hoàn thành)", classId: "c4", status: "completed" },
  { id: "w9", type: "platform_fee", amount: -360000, date: "2026-01-10", description: "Phí nền tảng 20% - Lý 10", status: "completed" },
];

const seedChat: ChatMessage[] = [
  { id: "m1", classId: "c1", sender: "parent", senderName: "Phạm Hồng Đào", message: "Thầy ơi, tuần này con có bài tập nhiều không ạ?", timestamp: "2026-02-28 20:15", read: true },
  { id: "m2", classId: "c1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Dạ chào chị, tuần này em giao 2 đề thi thử cho cháu ôn tập ạ", timestamp: "2026-02-28 20:18", read: true },
  { id: "m3", classId: "c1", sender: "student", senderName: "Lê Minh Châu", message: "Thầy ơi em không hiểu bài 3 đề 2 ạ", timestamp: "2026-03-01 15:30", read: true },
  { id: "m4", classId: "c1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Ok em, buổi tới thầy sẽ giải chi tiết nhé", timestamp: "2026-03-01 15:35", read: true },
  { id: "m5", classId: "c1", sender: "parent", senderName: "Phạm Hồng Đào", message: "Cảm ơn thầy ạ. Con tiến bộ nhiều rồi!", timestamp: "2026-03-01 21:00", read: false },
  { id: "m6", classId: "c3", sender: "student", senderName: "Trương Văn Kiên", message: "Thầy ơi buổi đầu mình học gì ạ?", timestamp: "2026-02-28 10:00", read: false },
];

const seedStudentProgress: StudentProgress[] = [
  {
    studentId: "u3", studentName: "Lê Minh Châu", studentAvatar: avatarMale2,
    classId: "c1", className: "Toán 12 - Ôn thi ĐH", subject: "Toán",
    totalSessions: 24, completedSessions: 12, averageScore: 7.8, attendanceRate: 100, goalCompletion: 65,
    skills: [
      { name: "Đại số", score: 8.5, prevScore: 6.0 },
      { name: "Giải tích", score: 7.5, prevScore: 5.5 },
      { name: "Hình học", score: 6.8, prevScore: 5.0 },
      { name: "Xác suất", score: 8.0, prevScore: 6.5 },
      { name: "Tổ hợp", score: 7.2, prevScore: 5.8 },
    ],
    weeklyReports: [
      { week: "T1/2026", sessions: 6, avgScore: 6.5, notes: "Bắt đầu ôn từ cơ bản, nắm lý thuyết chưa vững" },
      { week: "T2/2026 - Tuần 1", sessions: 3, avgScore: 7.0, notes: "Tiến bộ phần đạo hàm, cần luyện thêm tích phân" },
      { week: "T2/2026 - Tuần 2", sessions: 3, avgScore: 7.5, notes: "Làm tốt tích phân, yếu hình học không gian" },
      { week: "T2/2026 - Tuần 3", sessions: 3, avgScore: 7.8, notes: "Cải thiện hình học, xác suất tốt" },
      { week: "T2/2026 - Tuần 4", sessions: 3, avgScore: 8.0, notes: "Đề thi thử 7.5 và 8.0 điểm. Sẵn sàng ôn nâng cao" },
    ],
  },
  {
    studentId: "u11", studentName: "Trương Văn Kiên", studentAvatar: avatarMale3,
    classId: "c3", className: "IELTS Writing", subject: "Anh",
    totalSessions: 12, completedSessions: 0, averageScore: 0, attendanceRate: 0, goalCompletion: 0,
    skills: [
      { name: "Task 1", score: 5.0, prevScore: 5.0 },
      { name: "Task 2", score: 5.5, prevScore: 5.5 },
      { name: "Grammar", score: 6.0, prevScore: 6.0 },
      { name: "Vocabulary", score: 5.5, prevScore: 5.5 },
    ],
    weeklyReports: [],
  },
];

const seedReviews: TutorReview[] = [
  { id: "r1", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Thầy rất tận tâm, con tiến bộ rõ rệt sau 2 tháng. Phương pháp giảng dạy rõ ràng, dễ hiểu.", date: "2026-02-28", avatar: avatarFemale2 },
  { id: "r2", classId: "c4", className: "Lý 10 - Cơ bản", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Hoàn thành xuất sắc chương trình. Con đã tự tin hơn rất nhiều với môn Lý.", date: "2026-01-15", avatar: avatarFemale2 },
  { id: "r3", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 4, comment: "Buổi này hơi nhanh, con chưa kịp hiểu hết phần hình học không gian.", date: "2026-02-14", avatar: avatarFemale2 },
  { id: "r4", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Đề thi thử 8.0 điểm! Rất hài lòng!", date: "2026-02-28", avatar: avatarFemale2 },
];

// ========== CONTEXT ==========

interface TutorContextType {
  profile: TutorProfile;
  classes: TutorClass[];
  trials: TrialBooking[];
  wallet: WalletTransaction[];
  chatMessages: ChatMessage[];
  studentProgress: StudentProgress[];
  reviews: TutorReview[];
  walletBalance: number;
  escrowBalance: number;
  // Actions
  updateProfile: (data: Partial<TutorProfile>) => void;
  confirmTrial: (id: string) => void;
  rejectTrial: (id: string) => void;
  startSession: (sessionId: string, classId: string) => void;
  endSession: (sessionId: string, classId: string, content: string, notes: string, homework: string) => void;
  sendMessage: (classId: string, message: string) => void;
  markMessagesRead: (classId: string) => void;
  requestRefund: (classId: string) => void;
  requestWithdrawal: (amount: number) => void;
}

const TutorContext = createContext<TutorContextType | null>(null);

export const useTutor = () => {
  const ctx = useContext(TutorContext);
  if (!ctx) throw new Error("useTutor must be used within TutorProvider");
  return ctx;
};

let nextTutorId = 500;
const genId = (prefix: string) => `${prefix}${++nextTutorId}`;

export const TutorProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<TutorProfile>(tutorProfile);
  const [classes, setClasses] = useState<TutorClass[]>(seedClasses);
  const [trials, setTrials] = useState<TrialBooking[]>(seedTrials);
  const [wallet, setWallet] = useState<WalletTransaction[]>(seedWallet);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(seedChat);
  const [studentProgress] = useState<StudentProgress[]>(seedStudentProgress);
  const [reviews] = useState<TutorReview[]>(seedReviews);

  const walletBalance = wallet
    .filter(w => w.status === "completed" && w.type !== "escrow_in")
    .reduce((sum, w) => sum + w.amount, 0);

  const escrowBalance = classes
    .filter(c => c.escrowStatus !== "completed" && c.escrowStatus !== "refunded")
    .reduce((sum, c) => sum + (c.escrowAmount - c.escrowReleased), 0);

  const updateProfile = useCallback((data: Partial<TutorProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  }, []);

  const confirmTrial = useCallback((id: string) => {
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: "confirmed" as TrialStatus } : t));
  }, []);

  const rejectTrial = useCallback((id: string) => {
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" as TrialStatus } : t));
  }, []);

  const startSession = useCallback((sessionId: string, classId: string) => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        sessions: c.sessions.map(s =>
          s.id === sessionId ? { ...s, status: "completed" as SessionStatus, startedAt: now } : s
        ),
      };
    }));
  }, []);

  const endSession = useCallback((sessionId: string, classId: string, content: string, notes: string, homework: string) => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      const updatedSessions = c.sessions.map(s =>
        s.id === sessionId ? { ...s, status: "completed" as SessionStatus, endedAt: now, content, notes, homework } : s
      );
      const completedCount = updatedSessions.filter(s => s.status === "completed").length;
      let newEscrowReleased = c.escrowReleased;
      let newEscrowStatus = c.escrowStatus;
      // Check milestone release
      if (completedCount > 0 && completedCount % c.releaseMilestone === 0) {
        const releaseAmount = (c.escrowAmount / c.totalSessions) * c.releaseMilestone;
        newEscrowReleased = Math.min(c.escrowAmount, c.escrowReleased + releaseAmount);
      }
      if (completedCount >= c.totalSessions) {
        newEscrowStatus = "completed";
        newEscrowReleased = c.escrowAmount;
      } else if (completedCount > 0) {
        newEscrowStatus = "in_progress";
      }
      return { ...c, sessions: updatedSessions, completedSessions: completedCount, escrowReleased: newEscrowReleased, escrowStatus: newEscrowStatus as EscrowStatus };
    }));
  }, []);

  const sendMessage = useCallback((classId: string, message: string) => {
    setChatMessages(prev => [...prev, {
      id: genId("m"),
      classId,
      sender: "tutor",
      senderName: profile.name,
      message,
      timestamp: new Date().toLocaleString("vi-VN"),
      read: true,
    }]);
  }, [profile.name]);

  const markMessagesRead = useCallback((classId: string) => {
    setChatMessages(prev => prev.map(m => m.classId === classId ? { ...m, read: true } : m));
  }, []);

  const requestRefund = useCallback((classId: string) => {
    setClasses(prev => prev.map(c =>
      c.id === classId && (c.escrowStatus === "pending" || c.escrowStatus === "in_progress")
        ? { ...c, escrowStatus: "refunded" as EscrowStatus }
        : c
    ));
    setWallet(prev => [...prev, {
      id: genId("w"),
      type: "refund",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      description: `Yêu cầu hoàn tiền lớp ${classId} - đang chờ Admin xử lý`,
      classId,
      status: "pending",
    }]);
  }, []);

  const requestWithdrawal = useCallback((amount: number) => {
    setWallet(prev => [...prev, {
      id: genId("w"),
      type: "withdrawal",
      amount: -amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Rút ${amount.toLocaleString("vi-VN")}đ về tài khoản ngân hàng`,
      status: "pending",
    }]);
  }, []);

  return (
    <TutorContext.Provider value={{
      profile, classes, trials, wallet, chatMessages, studentProgress, reviews,
      walletBalance, escrowBalance,
      updateProfile, confirmTrial, rejectTrial,
      startSession, endSession, sendMessage, markMessagesRead,
      requestRefund, requestWithdrawal,
    }}>
      {children}
    </TutorContext.Provider>
  );
};
