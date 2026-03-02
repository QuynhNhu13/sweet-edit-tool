import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";
import avatarMale4 from "@/assets/avatar-male-4.jpg";
import avatarFemale4 from "@/assets/avatar-female-4.jpg";
import avatarMale5 from "@/assets/avatar-male-5.jpg";
import avatarFemale5 from "@/assets/avatar-female-5.jpg";

// ========== TYPES ==========

export type EscrowStatus = "pending" | "in_progress" | "completed" | "refunded";
export type SessionStatus = "scheduled" | "completed" | "missed" | "cancelled";
export type TrialStatus = "pending" | "confirmed" | "rejected" | "completed";
export type WalletTxType = "escrow_in" | "escrow_release" | "withdrawal" | "refund" | "platform_fee" | "deposit";

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
  joinDate: string;
  location: string;
  teachingStyle: string;
  achievements: string[];
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
  releaseMilestone: number;
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
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  studentGrade: string;
  subject: string;
  requestedDate: string;
  requestedTime: string;
  status: TrialStatus;
  feedback?: string;
  rating?: number;
  note?: string;
  goals?: string;
  currentLevel?: string;
}

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  amount: number;
  date: string;
  description: string;
  classId?: string;
  status: "completed" | "pending";
  paymentMethod?: string;
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
  studentPhone: string;
  studentEmail: string;
  studentGrade: string;
  parentName: string;
  parentPhone: string;
  classId: string;
  className: string;
  subject: string;
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  averageScore: number;
  attendanceRate: number;
  goalCompletion: number;
  startDate: string;
  lastSessionDate: string;
  homeworkCompletion: number;
  notes: string;
  skills: { name: string; score: number; prevScore: number }[];
  weeklyReports: { week: string; sessions: number; avgScore: number; notes: string }[];
  scoreHistory: { date: string; score: number }[];
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
  subject: string;
  tags?: string[];
}

export interface TestQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ========== SEED DATA ==========

const tutorProfile: TutorProfile = {
  id: "u1",
  name: "Nguyễn Văn An",
  avatar: avatarMale1,
  email: "an.nguyen@edu.vn",
  phone: "0901234567",
  subjects: ["Toán", "Lý"],
  bio: "Gia sư Toán - Lý với 5 năm kinh nghiệm dạy ôn thi đại học. Tốt nghiệp loại Giỏi ĐH Sư Phạm TP.HCM. Phương pháp giảng dạy tập trung vào tư duy logic và giải quyết vấn đề. Đã giúp 50+ học sinh đạt điểm trên 8.0 trong kỳ thi THPT Quốc gia.",
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
  joinDate: "2024-06-15",
  location: "Quận 3, TP.HCM",
  teachingStyle: "Tập trung tư duy logic, giải bài từ cơ bản đến nâng cao. Sử dụng nhiều ví dụ thực tế.",
  achievements: ["Top 10 gia sư tháng 2/2026", "Gia sư Verified", "100+ buổi dạy hoàn thành", "Rating 4.8+"],
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
  { id: "s15", classId: "c1", date: "2026-03-07", time: "19:00-21:00", status: "scheduled" },
  // Class c2 sessions
  { id: "s16", classId: "c2", date: "2026-02-10", time: "17:00-19:00", status: "completed", startedAt: "17:00", endedAt: "19:00", content: "Cơ học Newton", notes: "Nắm tốt 3 định luật", homework: "Bài tập chương 1" },
  { id: "s17", classId: "c2", date: "2026-02-17", time: "17:00-19:00", status: "completed", startedAt: "17:05", endedAt: "18:55", content: "Động lượng", notes: "Khá", homework: "5 bài tập", rating: 4 },
  { id: "s18", classId: "c2", date: "2026-02-24", time: "17:00-19:00", status: "completed", startedAt: "17:00", endedAt: "19:02", content: "Năng lượng", notes: "Tốt", homework: "Đề thi thử" },
  { id: "s19", classId: "c2", date: "2026-03-03", time: "17:00-19:00", status: "scheduled" },
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
    id: "c2", name: "Lý 11 - Nâng cao", subject: "Lý",
    studentId: "u5", studentName: "Trần Thị Hương", studentAvatar: avatarFemale4,
    parentName: "Trần Văn Minh", format: "offline", fee: 1500000,
    totalSessions: 16, completedSessions: 3,
    escrowStatus: "in_progress", escrowAmount: 1500000, escrowReleased: 0, releaseMilestone: 4,
    schedule: "T2 - 17:00-19:00", createdAt: "2026-02-01",
    sessions: seedSessions.filter(s => s.classId === "c2"),
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
  { id: "tr1", parentName: "Ngô Thị Lan", parentAvatar: avatarFemale1, parentPhone: "0912345678", parentEmail: "lan.ngo@email.com", studentName: "Ngô Minh Tuấn", studentGrade: "Lớp 11", subject: "Toán", requestedDate: "2026-03-05", requestedTime: "19:00-20:00", status: "pending", note: "Con yếu phần hàm số, muốn thử trước khi đăng ký dài hạn", goals: "Đạt 7+ điểm thi HK2", currentLevel: "Trung bình (5-6 điểm)" },
  { id: "tr2", parentName: "Lý Thị Mai", parentAvatar: avatarFemale2, parentPhone: "0923456789", parentEmail: "mai.ly@email.com", studentName: "Lý Quốc Bảo", studentGrade: "Lớp 10", subject: "Lý", requestedDate: "2026-03-06", requestedTime: "17:00-18:00", status: "confirmed", note: "Muốn tìm gia sư dạy kèm lâu dài", goals: "Cải thiện từ 5 lên 7 điểm", currentLevel: "Yếu (4-5 điểm)" },
  { id: "tr3", parentName: "Phạm Hồng Đào", parentAvatar: avatarFemale3, parentPhone: "0934567890", parentEmail: "dao.pham@email.com", studentName: "Lê Minh Châu", studentGrade: "Lớp 12", subject: "Toán", requestedDate: "2026-01-10", requestedTime: "19:00-20:00", status: "completed", feedback: "Thầy dạy rất tốt, con hiểu bài ngay", rating: 5, note: "Ôn thi đại học", goals: "Đạt 8+ thi THPTQG", currentLevel: "Khá (6.5-7 điểm)" },
  { id: "tr4", parentName: "Võ Thị Hà", parentAvatar: avatarFemale5, parentPhone: "0945678901", parentEmail: "ha.vo@email.com", studentName: "Võ Đức Minh", studentGrade: "Lớp 9", subject: "Toán", requestedDate: "2026-03-08", requestedTime: "14:00-15:00", status: "pending", note: "Chuẩn bị thi vào 10", goals: "Đỗ trường chuyên", currentLevel: "Khá (7 điểm)" },
];

const seedWallet: WalletTransaction[] = [
  { id: "w1", type: "escrow_in", amount: 2000000, date: "2026-01-15", description: "Escrow nhận lớp Toán 12", classId: "c1", status: "completed" },
  { id: "w2", type: "escrow_release", amount: 400000, date: "2026-02-01", description: "Giải ngân đợt 1 - Toán 12 (5 buổi)", classId: "c1", status: "completed" },
  { id: "w3", type: "escrow_release", amount: 400000, date: "2026-02-15", description: "Giải ngân đợt 2 - Toán 12 (10 buổi)", classId: "c1", status: "completed" },
  { id: "w4", type: "platform_fee", amount: -160000, date: "2026-02-15", description: "Phí nền tảng 20% đợt giải ngân", status: "completed" },
  { id: "w5", type: "withdrawal", amount: -500000, date: "2026-02-20", description: "Rút tiền về Vietcombank ****1234", status: "completed", paymentMethod: "Vietcombank" },
  { id: "w6", type: "escrow_in", amount: 3000000, date: "2026-02-15", description: "Escrow nhận lớp IELTS Writing", classId: "c3", status: "pending" },
  { id: "w7", type: "escrow_in", amount: 1800000, date: "2025-11-01", description: "Escrow nhận lớp Lý 10", classId: "c4", status: "completed" },
  { id: "w8", type: "escrow_release", amount: 1440000, date: "2026-01-10", description: "Giải ngân toàn bộ - Lý 10 (hoàn thành)", classId: "c4", status: "completed" },
  { id: "w9", type: "platform_fee", amount: -360000, date: "2026-01-10", description: "Phí nền tảng 20% - Lý 10", status: "completed" },
  { id: "w10", type: "deposit", amount: 500000, date: "2026-02-25", description: "Nạp tiền từ MoMo", status: "completed", paymentMethod: "MoMo" },
  { id: "w11", type: "escrow_in", amount: 1500000, date: "2026-02-01", description: "Escrow nhận lớp Lý 11", classId: "c2", status: "completed" },
];

const seedChat: ChatMessage[] = [
  { id: "m1", classId: "c1", sender: "parent", senderName: "Phạm Hồng Đào", message: "Thầy ơi, tuần này con có bài tập nhiều không ạ?", timestamp: "2026-02-28 20:15", read: true },
  { id: "m2", classId: "c1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Dạ chào chị, tuần này em giao 2 đề thi thử cho cháu ôn tập ạ", timestamp: "2026-02-28 20:18", read: true },
  { id: "m3", classId: "c1", sender: "student", senderName: "Lê Minh Châu", message: "Thầy ơi em không hiểu bài 3 đề 2 ạ", timestamp: "2026-03-01 15:30", read: true },
  { id: "m4", classId: "c1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Ok em, buổi tới thầy sẽ giải chi tiết nhé", timestamp: "2026-03-01 15:35", read: true },
  { id: "m5", classId: "c1", sender: "parent", senderName: "Phạm Hồng Đào", message: "Cảm ơn thầy ạ. Con tiến bộ nhiều rồi!", timestamp: "2026-03-01 21:00", read: false },
  { id: "m6", classId: "c3", sender: "student", senderName: "Trương Văn Kiên", message: "Thầy ơi buổi đầu mình học gì ạ?", timestamp: "2026-02-28 10:00", read: false },
  { id: "m7", classId: "c2", sender: "student", senderName: "Trần Thị Hương", message: "Thầy cho em xin đề cương ôn tập ạ", timestamp: "2026-03-01 16:00", read: false },
  { id: "m8", classId: "c2", sender: "parent", senderName: "Trần Văn Minh", message: "Thầy ơi tuần sau con em nghỉ 1 buổi được không ạ?", timestamp: "2026-03-01 18:00", read: false },
];

const seedStudentProgress: StudentProgress[] = [
  {
    studentId: "u3", studentName: "Lê Minh Châu", studentAvatar: avatarMale2,
    studentPhone: "0901111111", studentEmail: "chau.le@email.com", studentGrade: "Lớp 12",
    parentName: "Phạm Hồng Đào", parentPhone: "0934567890",
    classId: "c1", className: "Toán 12 - Ôn thi ĐH", subject: "Toán",
    totalSessions: 24, completedSessions: 12, missedSessions: 0,
    averageScore: 7.8, attendanceRate: 100, goalCompletion: 65,
    startDate: "2026-01-15", lastSessionDate: "2026-02-28",
    homeworkCompletion: 92, notes: "Học sinh chăm chỉ, tiến bộ đều đặn. Cần tập trung hơn vào hình học.",
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
    scoreHistory: [
      { date: "2026-01-20", score: 5.5 }, { date: "2026-01-27", score: 6.0 },
      { date: "2026-02-03", score: 6.5 }, { date: "2026-02-10", score: 7.0 },
      { date: "2026-02-17", score: 7.5 }, { date: "2026-02-24", score: 7.8 },
      { date: "2026-02-28", score: 8.0 },
    ],
  },
  {
    studentId: "u5", studentName: "Trần Thị Hương", studentAvatar: avatarFemale4,
    studentPhone: "0902222222", studentEmail: "huong.tran@email.com", studentGrade: "Lớp 11",
    parentName: "Trần Văn Minh", parentPhone: "0945678901",
    classId: "c2", className: "Lý 11 - Nâng cao", subject: "Lý",
    totalSessions: 16, completedSessions: 3, missedSessions: 0,
    averageScore: 6.5, attendanceRate: 100, goalCompletion: 20,
    startDate: "2026-02-01", lastSessionDate: "2026-02-24",
    homeworkCompletion: 85, notes: "Mới bắt đầu, cần thêm thời gian đánh giá.",
    skills: [
      { name: "Cơ học", score: 7.0, prevScore: 5.5 },
      { name: "Nhiệt học", score: 6.0, prevScore: 6.0 },
      { name: "Điện học", score: 5.5, prevScore: 5.5 },
      { name: "Quang học", score: 6.5, prevScore: 6.5 },
    ],
    weeklyReports: [
      { week: "T2/2026 - Tuần 2", sessions: 1, avgScore: 6.0, notes: "Bắt đầu với cơ học Newton" },
      { week: "T2/2026 - Tuần 3", sessions: 1, avgScore: 6.5, notes: "Tiến bộ, hiểu động lượng" },
      { week: "T2/2026 - Tuần 4", sessions: 1, avgScore: 7.0, notes: "Nắm khá tốt phần năng lượng" },
    ],
    scoreHistory: [
      { date: "2026-02-10", score: 6.0 }, { date: "2026-02-17", score: 6.5 }, { date: "2026-02-24", score: 7.0 },
    ],
  },
  {
    studentId: "u11", studentName: "Trương Văn Kiên", studentAvatar: avatarMale3,
    studentPhone: "0903333333", studentEmail: "kien.truong@email.com", studentGrade: "Lớp 12",
    parentName: "Trương Thị Hạnh", parentPhone: "0956789012",
    classId: "c3", className: "IELTS Writing", subject: "Anh",
    totalSessions: 12, completedSessions: 0, missedSessions: 0,
    averageScore: 0, attendanceRate: 0, goalCompletion: 0,
    startDate: "2026-02-15", lastSessionDate: "",
    homeworkCompletion: 0, notes: "Chưa bắt đầu học.",
    skills: [
      { name: "Task 1", score: 5.0, prevScore: 5.0 },
      { name: "Task 2", score: 5.5, prevScore: 5.5 },
      { name: "Grammar", score: 6.0, prevScore: 6.0 },
      { name: "Vocabulary", score: 5.5, prevScore: 5.5 },
    ],
    weeklyReports: [],
    scoreHistory: [],
  },
  {
    studentId: "u3b", studentName: "Lê Minh Châu", studentAvatar: avatarMale2,
    studentPhone: "0901111111", studentEmail: "chau.le@email.com", studentGrade: "Lớp 10",
    parentName: "Phạm Hồng Đào", parentPhone: "0934567890",
    classId: "c4", className: "Lý 10 - Cơ bản", subject: "Lý",
    totalSessions: 20, completedSessions: 20, missedSessions: 1,
    averageScore: 8.2, attendanceRate: 95, goalCompletion: 100,
    startDate: "2025-11-01", lastSessionDate: "2026-01-10",
    homeworkCompletion: 95, notes: "Hoàn thành xuất sắc. Đã đạt mục tiêu.",
    skills: [
      { name: "Cơ học", score: 8.5, prevScore: 5.0 },
      { name: "Nhiệt học", score: 8.0, prevScore: 5.5 },
      { name: "Điện học", score: 8.0, prevScore: 6.0 },
      { name: "Quang học", score: 8.5, prevScore: 5.5 },
    ],
    weeklyReports: [
      { week: "T11/2025", sessions: 8, avgScore: 6.5, notes: "Bắt đầu từ cơ bản" },
      { week: "T12/2025", sessions: 8, avgScore: 7.5, notes: "Tiến bộ rõ rệt" },
      { week: "T1/2026", sessions: 4, avgScore: 8.5, notes: "Hoàn thành chương trình" },
    ],
    scoreHistory: [
      { date: "2025-11-10", score: 5.5 }, { date: "2025-11-24", score: 6.5 },
      { date: "2025-12-08", score: 7.0 }, { date: "2025-12-22", score: 7.5 },
      { date: "2026-01-05", score: 8.0 }, { date: "2026-01-10", score: 8.5 },
    ],
  },
];

const seedReviews: TutorReview[] = [
  { id: "r1", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Thầy rất tận tâm, con tiến bộ rõ rệt sau 2 tháng. Phương pháp giảng dạy rõ ràng, dễ hiểu.", date: "2026-02-28", avatar: avatarFemale2, subject: "Toán", tags: ["Tận tâm", "Dễ hiểu", "Kiên nhẫn"] },
  { id: "r2", classId: "c4", className: "Lý 10 - Cơ bản", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Hoàn thành xuất sắc chương trình. Con đã tự tin hơn rất nhiều với môn Lý.", date: "2026-01-15", avatar: avatarFemale2, subject: "Lý", tags: ["Chuyên nghiệp", "Hiệu quả"] },
  { id: "r3", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 4, comment: "Buổi này hơi nhanh, con chưa kịp hiểu hết phần hình học không gian.", date: "2026-02-14", avatar: avatarFemale2, subject: "Toán", tags: ["Hơi nhanh"] },
  { id: "r4", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Đề thi thử 8.0 điểm! Rất hài lòng!", date: "2026-02-28", avatar: avatarFemale2, subject: "Toán", tags: ["Hiệu quả", "Hài lòng"] },
  { id: "r5", classId: "c2", className: "Lý 11 - Nâng cao", studentName: "Trần Thị Hương", parentName: "Trần Văn Minh", rating: 4, comment: "Thầy giảng cơ học rất hay, con bắt đầu thích môn Lý rồi.", date: "2026-02-20", avatar: avatarMale5, subject: "Lý", tags: ["Dễ hiểu", "Vui vẻ"] },
  { id: "r6", classId: "c4", className: "Lý 10 - Cơ bản", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Từ 5 điểm lên 8.5 điểm trong 2 tháng, không thể tin được!", date: "2025-12-20", avatar: avatarFemale2, subject: "Lý", tags: ["Tiến bộ nhanh", "Tuyệt vời"] },
  { id: "r7", classId: "c1", className: "Toán 12 - Ôn thi ĐH", studentName: "Lê Minh Châu", parentName: "Phạm Hồng Đào", rating: 5, comment: "Thầy luôn chuẩn bị bài rất kỹ, có tài liệu đầy đủ.", date: "2026-01-20", avatar: avatarFemale2, subject: "Toán", tags: ["Chuẩn bị kỹ", "Tận tâm"] },
];

// Test questions by subject
const seedTestQuestions: TestQuestion[] = [
  // Toán
  { id: "tq1", subject: "Toán", question: "Đạo hàm của hàm số y = x³ + 2x² - 5x + 1 là:", options: ["3x² + 4x - 5", "3x² + 2x - 5", "x² + 4x - 5", "3x² + 4x + 5"], correctAnswer: 0, explanation: "y' = 3x² + 4x - 5 (áp dụng công thức đạo hàm)" },
  { id: "tq2", subject: "Toán", question: "Tích phân ∫₀¹ 2x dx bằng:", options: ["1", "2", "0", "1/2"], correctAnswer: 0, explanation: "∫₀¹ 2x dx = [x²]₀¹ = 1" },
  { id: "tq3", subject: "Toán", question: "Giới hạn lim(x→0) sin(x)/x bằng:", options: ["0", "1", "∞", "Không tồn tại"], correctAnswer: 1, explanation: "Đây là giới hạn cơ bản: lim(x→0) sin(x)/x = 1" },
  { id: "tq4", subject: "Toán", question: "Phương trình x² - 5x + 6 = 0 có nghiệm là:", options: ["x=1, x=6", "x=2, x=3", "x=-2, x=-3", "x=1, x=5"], correctAnswer: 1, explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, nên x=2 hoặc x=3" },
  { id: "tq5", subject: "Toán", question: "Trong tam giác vuông, sin²α + cos²α bằng:", options: ["0", "1", "2", "sinα"], correctAnswer: 1, explanation: "Đây là hằng đẳng thức lượng giác cơ bản" },
  { id: "tq6", subject: "Toán", question: "log₂(8) bằng:", options: ["2", "3", "4", "8"], correctAnswer: 1, explanation: "2³ = 8, nên log₂(8) = 3" },
  { id: "tq7", subject: "Toán", question: "Số tổ hợp C(5,2) bằng:", options: ["10", "20", "5", "25"], correctAnswer: 0, explanation: "C(5,2) = 5!/(2!×3!) = 10" },
  { id: "tq8", subject: "Toán", question: "Véc tơ ā = (2,3) và b̄ = (1,-1). Tích vô hướng ā·b̄ bằng:", options: ["-1", "5", "1", "-5"], correctAnswer: 0, explanation: "ā·b̄ = 2×1 + 3×(-1) = 2 - 3 = -1" },
  { id: "tq9", subject: "Toán", question: "Hàm số y = x³ - 3x có bao nhiêu cực trị?", options: ["0", "1", "2", "3"], correctAnswer: 2, explanation: "y' = 3x² - 3 = 0 → x = ±1, y'' = 6x. x=1: cực tiểu, x=-1: cực đại → 2 cực trị" },
  { id: "tq10", subject: "Toán", question: "Ma trận A = [[1,2],[3,4]], det(A) bằng:", options: ["-2", "2", "10", "-10"], correctAnswer: 0, explanation: "det(A) = 1×4 - 2×3 = 4 - 6 = -2" },
  // Lý
  { id: "tq11", subject: "Lý", question: "Định luật II Newton phát biểu:", options: ["F = ma", "F = mv", "F = m/a", "F = m²a"], correctAnswer: 0, explanation: "Định luật II Newton: F = ma" },
  { id: "tq12", subject: "Lý", question: "Đơn vị của công suất trong hệ SI là:", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswer: 1, explanation: "Công suất đo bằng Watt (W) = J/s" },
  { id: "tq13", subject: "Lý", question: "Vận tốc ánh sáng trong chân không xấp xỉ:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correctAnswer: 1, explanation: "c ≈ 3×10⁸ m/s" },
  { id: "tq14", subject: "Lý", question: "Định luật bảo toàn năng lượng phát biểu:", options: ["Năng lượng tự sinh ra", "Năng lượng không tự sinh ra và không tự mất đi", "Năng lượng luôn tăng", "Năng lượng luôn giảm"], correctAnswer: 1, explanation: "Năng lượng không tự sinh ra và không tự mất đi, chỉ chuyển từ dạng này sang dạng khác" },
  { id: "tq15", subject: "Lý", question: "Điện trở R = U/I theo định luật:", options: ["Faraday", "Ohm", "Kirchhoff", "Coulomb"], correctAnswer: 1, explanation: "Định luật Ohm: U = IR, suy ra R = U/I" },
  { id: "tq16", subject: "Lý", question: "Gia tốc trọng trường trên Trái Đất xấp xỉ:", options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "7.8 m/s²"], correctAnswer: 1, explanation: "g ≈ 9.8 m/s²" },
  { id: "tq17", subject: "Lý", question: "Động lượng được tính bằng:", options: ["p = mv", "p = ma", "p = Ft", "p = mv và p = Ft"], correctAnswer: 3, explanation: "Động lượng p = mv, và xung lượng Ft = Δp" },
  { id: "tq18", subject: "Lý", question: "Sóng âm truyền nhanh nhất trong môi trường:", options: ["Chân không", "Không khí", "Nước", "Chất rắn"], correctAnswer: 3, explanation: "Sóng âm truyền nhanh nhất trong chất rắn do mật độ phân tử cao" },
  { id: "tq19", subject: "Lý", question: "Công thức tính động năng:", options: ["Wđ = mgh", "Wđ = ½mv²", "Wđ = Fs", "Wđ = ½kx²"], correctAnswer: 1, explanation: "Động năng Wđ = ½mv²" },
  { id: "tq20", subject: "Lý", question: "Hiện tượng khúc xạ ánh sáng xảy ra khi:", options: ["Ánh sáng gặp gương phẳng", "Ánh sáng truyền qua 2 môi trường trong suốt khác nhau", "Ánh sáng bị chặn", "Ánh sáng phản xạ toàn phần"], correctAnswer: 1, explanation: "Khúc xạ xảy ra khi ánh sáng truyền qua 2 môi trường trong suốt có chiết suất khác nhau" },
  // Anh
  { id: "tq21", subject: "Anh", question: "Choose the correct form: 'If I ___ rich, I would travel the world.'", options: ["am", "was", "were", "be"], correctAnswer: 2, explanation: "Conditional Type 2 uses 'were' for all subjects" },
  { id: "tq22", subject: "Anh", question: "'She has been studying for 3 hours.' What tense is this?", options: ["Present Perfect", "Present Perfect Continuous", "Past Perfect", "Past Continuous"], correctAnswer: 1, explanation: "Present Perfect Continuous: has/have + been + V-ing" },
  { id: "tq23", subject: "Anh", question: "Choose the synonym of 'abundant':", options: ["scarce", "plentiful", "tiny", "rare"], correctAnswer: 1, explanation: "Abundant = plentiful (dồi dào)" },
  { id: "tq24", subject: "Anh", question: "'The book ___ by Mark Twain.' Choose the correct passive form:", options: ["wrote", "was written", "has wrote", "is writing"], correctAnswer: 1, explanation: "Passive voice: was/were + past participle" },
  { id: "tq25", subject: "Anh", question: "Which sentence is grammatically correct?", options: ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not like coffee."], correctAnswer: 2, explanation: "Third person singular negative: doesn't + base form" },
  { id: "tq26", subject: "Anh", question: "'Despite ___ tired, she continued working.'", options: ["be", "being", "to be", "been"], correctAnswer: 1, explanation: "Despite + V-ing" },
  { id: "tq27", subject: "Anh", question: "The word 'phenomenon' is plural as:", options: ["phenomenons", "phenomena", "phenomenas", "phenomeni"], correctAnswer: 1, explanation: "Phenomenon → Phenomena (Greek origin)" },
  { id: "tq28", subject: "Anh", question: "'I wish I ___ speak French fluently.'", options: ["can", "could", "will", "may"], correctAnswer: 1, explanation: "Wish + past simple (could) for present unreal situations" },
  { id: "tq29", subject: "Anh", question: "Choose the correct preposition: 'She is interested ___ music.'", options: ["on", "at", "in", "for"], correctAnswer: 2, explanation: "Interested IN something" },
  { id: "tq30", subject: "Anh", question: "'Had I known, I ___ differently.'", options: ["would act", "would have acted", "will act", "acted"], correctAnswer: 1, explanation: "Conditional Type 3: would have + past participle" },
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
  testQuestions: TestQuestion[];
  walletBalance: number;
  escrowBalance: number;
  updateProfile: (data: Partial<TutorProfile>) => void;
  confirmTrial: (id: string) => void;
  rejectTrial: (id: string) => void;
  startSession: (sessionId: string, classId: string) => void;
  endSession: (sessionId: string, classId: string, content: string, notes: string, homework: string) => void;
  sendMessage: (classId: string, message: string) => void;
  markMessagesRead: (classId: string) => void;
  requestRefund: (classId: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  requestDeposit: (amount: number, method: string) => void;
  updateAvailability: (availability: TutorProfile["availability"]) => void;
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

  const requestWithdrawal = useCallback((amount: number, method: string) => {
    setWallet(prev => [...prev, {
      id: genId("w"),
      type: "withdrawal",
      amount: -amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Rút ${amount.toLocaleString("vi-VN")}đ qua ${method}`,
      status: "pending",
      paymentMethod: method,
    }]);
  }, []);

  const requestDeposit = useCallback((amount: number, method: string) => {
    setWallet(prev => [...prev, {
      id: genId("w"),
      type: "deposit",
      amount: amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Nạp ${amount.toLocaleString("vi-VN")}đ từ ${method}`,
      status: "completed",
      paymentMethod: method,
    }]);
  }, []);

  const updateAvailability = useCallback((availability: TutorProfile["availability"]) => {
    setProfile(prev => ({ ...prev, availability }));
  }, []);

  return (
    <TutorContext.Provider value={{
      profile, classes, trials, wallet, chatMessages, studentProgress, reviews,
      testQuestions: seedTestQuestions,
      walletBalance, escrowBalance,
      updateProfile, confirmTrial, rejectTrial,
      startSession, endSession, sendMessage, markMessagesRead,
      requestRefund, requestWithdrawal, requestDeposit, updateAvailability,
    }}>
      {children}
    </TutorContext.Provider>
  );
};
