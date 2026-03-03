import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import studentAvatar1 from "@/assets/student-avatar-1.jpg";
import studentAvatar2 from "@/assets/student-avatar-2.jpg";
import studentAvatar3 from "@/assets/student-avatar-3.jpg";
import studentAvatar4 from "@/assets/student-avatar-4.jpg";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";
import avatarFemale4 from "@/assets/avatar-female-4.jpg";
import avatarFemale5 from "@/assets/avatar-female-5.jpg";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import tutor6 from "@/assets/tutor-6.jpg";

// ========== TYPES ==========

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  grade: string;
  school: string;
  parentName: string;
  parentPhone: string;
  gpa: number;
  goalGpa: number;
  joinDate: string;
}

export interface StudentClass {
  id: string;
  name: string;
  subject: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorType: "tutor" | "teacher";
  format: "online" | "offline";
  schedule: string;
  totalSessions: number;
  completedSessions: number;
  status: "active" | "completed" | "paused";
  fee: number;
  sessions: StudentSession[];
}

export interface StudentSession {
  id: string;
  classId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "missed" | "cancelled" | "in_progress";
  content?: string;
  notes?: string;
  homework?: string;
  rating?: number;
  ratingComment?: string;
  format: "online" | "offline";
  meetingLink?: string;
}

export interface TutorListing {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  totalSessions: number;
  yearsExperience: number;
  hourlyRate: number;
  location: string;
  verified: boolean;
  bio: string;
  school: string;
  degree: string;
  type: "tutor" | "teacher";
  availableSlots?: { day: string; time: string }[];
  certificates?: string[];
  introVideoUrl?: string;
  teachingStyle?: string;
  achievements?: string[];
}

export interface AvailabilitySlot {
  day: string;
  enabled: boolean;
  slots: { from: string; to: string }[];
}

export interface StudentTest {
  id: string;
  subject: string;
  title: string;
  totalQuestions: number;
  duration: number;
  status: "available" | "completed";
  score?: number;
  completedAt?: string;
  questions: TestQuestion[];
  answers?: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  subject: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  duration: number;
  totalQuestions: number;
  communityAvgScore: number;
  attempts: number;
  price: number;
  purchased: boolean;
  status: "available" | "completed";
  score?: number;
  completedAt?: string;
  questions: TestQuestion[];
  answers?: Record<string, number>;
  attemptHistory?: { score: number; date: string; answers: Record<string, number> }[];
}

export interface ExamResult {
  id: string;
  examId: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  completedAt: string;
  duration: number;
}

export interface MonthlyProgress {
  month: string;
  gpa: number;
  studyHours: number;
  sessionsCompleted: number;
  testsCompleted: number;
}

export interface StudentNotification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface StudentChatMessage {
  id: string;
  classId: string;
  sender: "student" | "tutor" | "parent";
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WalletTransaction {
  id: string;
  type: "deposit" | "tuition_payment" | "mock_exam_purchase" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
  paymentMethod?: string;
  relatedId?: string;
}

// ========== SEED DATA ==========

const studentProfile: StudentProfile = {
  id: "st1",
  name: "Lê Minh Châu",
  avatar: studentAvatar1,
  email: "chau.le@student.edu.vn",
  phone: "0912345678",
  grade: "Lớp 12",
  school: "THPT Nguyễn Thị Minh Khai",
  parentName: "Phạm Hồng Đào",
  parentPhone: "0934567890",
  gpa: 7.8,
  goalGpa: 8.5,
  joinDate: "2025-09-01",
};

const tutorListings: TutorListing[] = [
  { id: "t1", name: "Nguyễn Văn An", avatar: tutor1, subjects: ["Toán", "Lý"], rating: 4.8, totalReviews: 47, totalSessions: 312, yearsExperience: 5, hourlyRate: 250000, location: "Quận 3, TP.HCM", verified: true, bio: "Gia sư Toán - Lý với 5 năm kinh nghiệm dạy ôn thi đại học. Phương pháp giảng dạy hiện đại, tập trung vào tư duy logic.", school: "ĐH Sư Phạm TP.HCM", degree: "Cử nhân Sư phạm Toán", type: "tutor", certificates: ["Chứng chỉ Sư phạm", "TESOL (Cambridge)"], introVideoUrl: "https://example.com/intro-an.mp4", teachingStyle: "Tập trung tư duy logic, giải bài từ cơ bản đến nâng cao. Sử dụng bảng trắng online và bài tập tương tác.", achievements: ["Top 10 gia sư Toán TP.HCM 2025", "100% học sinh đạt 7+ THPTQG"], availableSlots: [{ day: "Thứ 2", time: "19:00-21:00" }, { day: "Thứ 4", time: "19:00-21:00" }, { day: "Thứ 6", time: "19:00-21:00" }] },
  { id: "t2", name: "Trần Thị Bích Ngọc", avatar: tutor2, subjects: ["Hóa", "Sinh"], rating: 4.9, totalReviews: 62, totalSessions: 450, yearsExperience: 12, hourlyRate: 300000, location: "Quận 1, TP.HCM", verified: true, bio: "Giáo viên trường Lê Hồng Phong, thạc sĩ Hóa hữu cơ. 12 năm kinh nghiệm giảng dạy chuyên.", school: "THPT Lê Hồng Phong", degree: "Thạc sĩ Hóa học", type: "teacher", certificates: ["Thạc sĩ Hóa Hữu cơ - ĐH KHTN", "Giáo viên Giỏi cấp Thành phố 2024", "Chứng chỉ Nghiệp vụ Sư phạm"], introVideoUrl: "https://example.com/intro-ngoc.mp4", teachingStyle: "Giảng dạy có hệ thống, kết hợp thí nghiệm minh họa qua video. Kiểm tra đầu giờ mỗi buổi.", achievements: ["Giáo viên Giỏi cấp TP 3 năm liên tiếp", "15 học sinh đạt giải HSG Quốc gia"], availableSlots: [{ day: "Thứ 3", time: "17:00-18:30" }, { day: "Thứ 5", time: "19:00-20:30" }] },
  { id: "t3", name: "Phạm Đức Huy", avatar: tutor3, subjects: ["Anh văn", "IELTS"], rating: 4.7, totalReviews: 35, totalSessions: 198, yearsExperience: 4, hourlyRate: 350000, location: "Quận 7, TP.HCM", verified: true, bio: "IELTS 8.5, chuyên luyện thi IELTS cho học sinh cấp 3. Phương pháp immersion hiệu quả.", school: "ĐH Ngoại Thương", degree: "Cử nhân Anh văn", type: "tutor", certificates: ["IELTS 8.5 (British Council)", "CELTA (Cambridge)", "TKT Module 1-3"], introVideoUrl: "https://example.com/intro-huy.mp4", teachingStyle: "100% tiếng Anh trong giờ học, tập trung kỹ năng Writing & Speaking. Chấm bài và feedback chi tiết trong 24h.", achievements: ["95% học sinh đạt IELTS 6.5+", "Mentor chương trình English Camp 2025"], availableSlots: [{ day: "Thứ 7", time: "9:00-10:30" }, { day: "Chủ nhật", time: "9:00-10:30" }] },
  { id: "t4", name: "Lê Thị Hồng Nhung", avatar: tutor4, subjects: ["Văn", "Sử"], rating: 4.6, totalReviews: 28, totalSessions: 156, yearsExperience: 6, hourlyRate: 200000, location: "Quận Bình Thạnh, TP.HCM", verified: false, bio: "Giáo viên Văn - Sử, đam mê truyền cảm hứng cho học sinh yêu thích văn chương.", school: "ĐH KHXH&NV", degree: "Cử nhân Ngữ Văn", type: "teacher", certificates: ["Cử nhân Ngữ Văn - ĐH KHXH&NV", "Chứng chỉ Tâm lý Giáo dục"], teachingStyle: "Kết hợp phân tích tác phẩm với bối cảnh lịch sử. Luyện viết essay mỗi buổi.", achievements: ["5 học sinh đạt 9+ môn Văn THPTQG"], availableSlots: [{ day: "Thứ 2", time: "17:00-18:30" }, { day: "Thứ 4", time: "17:00-18:30" }] },
  { id: "t5", name: "Võ Minh Tuấn", avatar: tutor5, subjects: ["Toán", "Tin học"], rating: 4.9, totalReviews: 55, totalSessions: 380, yearsExperience: 8, hourlyRate: 280000, location: "Quận Tân Bình, TP.HCM", verified: true, bio: "Chuyên gia lập trình và toán ứng dụng, 8 năm kinh nghiệm giảng dạy.", school: "ĐH Bách Khoa", degree: "Kỹ sư CNTT", type: "tutor", certificates: ["Kỹ sư CNTT - ĐH Bách Khoa", "AWS Cloud Practitioner", "Google Data Analytics"], introVideoUrl: "https://example.com/intro-tuan.mp4", teachingStyle: "Giảng dạy qua dự án thực tế, kết hợp coding và toán ứng dụng. Sử dụng Jupyter Notebook.", achievements: ["3 học sinh đạt giải Tin học Quốc gia", "Top 5 gia sư Tin học 2025"], availableSlots: [{ day: "Thứ 3", time: "17:00-18:30" }, { day: "Thứ 5", time: "17:00-18:30" }] },
  { id: "t6", name: "Nguyễn Thị Mai Anh", avatar: tutor6, subjects: ["Toán", "Hóa"], rating: 4.5, totalReviews: 19, totalSessions: 95, yearsExperience: 3, hourlyRate: 180000, location: "Quận 9, TP.HCM", verified: false, bio: "Sinh viên năm cuối ĐH Sư Phạm, nhiệt tình và kiên nhẫn với từng học sinh.", school: "ĐH Sư Phạm TP.HCM", degree: "SV Sư phạm Toán", type: "tutor", certificates: ["SV năm 4 Sư phạm Toán", "Giải 3 Olympic Toán SV 2024"], teachingStyle: "Giảng dạy nhẹ nhàng, kiên nhẫn. Chia nhỏ bài tập, luyện từng dạng.", achievements: ["Giải 3 Olympic Toán SV 2024"], availableSlots: [{ day: "Thứ 2", time: "18:00-20:00" }, { day: "Thứ 6", time: "18:00-20:00" }] },
];

const seedSessions: StudentSession[] = [
  { id: "ss1", classId: "sc1", date: "2026-02-03", time: "19:00-21:00", status: "completed", content: "Giới hạn hàm số", notes: "Nắm tốt lý thuyết", homework: "Bài 1-5 trang 45 SGK", rating: 5, ratingComment: "Thầy giảng rất dễ hiểu", format: "online" },
  { id: "ss2", classId: "sc1", date: "2026-02-05", time: "19:00-21:00", status: "completed", content: "Đạo hàm cơ bản", notes: "Cần ôn lại công thức", homework: "Làm đề số 3", format: "online" },
  { id: "ss3", classId: "sc1", date: "2026-02-07", time: "19:00-21:00", status: "completed", content: "Đạo hàm nâng cao", homework: "Bài tập trắc nghiệm chương 3", format: "online" },
  { id: "ss4", classId: "sc1", date: "2026-02-10", time: "19:00-21:00", status: "completed", content: "Tích phân", homework: "10 bài tích phân cơ bản", rating: 4, format: "online" },
  { id: "ss5", classId: "sc1", date: "2026-02-12", time: "19:00-21:00", status: "completed", content: "Ôn tập tích phân", homework: "Đề thi thử số 1", format: "online" },
  { id: "ss6", classId: "sc1", date: "2026-02-14", time: "19:00-21:00", status: "completed", content: "Hình học không gian", format: "online" },
  { id: "ss7", classId: "sc1", date: "2026-02-17", time: "19:00-21:00", status: "completed", content: "Hình học giải tích", format: "online" },
  { id: "ss8", classId: "sc1", date: "2026-02-19", time: "19:00-21:00", status: "completed", content: "Xác suất thống kê", rating: 5, format: "online" },
  { id: "ss9", classId: "sc1", date: "2026-02-21", time: "19:00-21:00", status: "missed", content: "Tổ hợp chỉnh hợp", format: "online" },
  { id: "ss10", classId: "sc1", date: "2026-02-24", time: "19:00-21:00", status: "completed", content: "Ôn tập tổng hợp", format: "online" },
  { id: "ss11", classId: "sc1", date: "2026-02-26", time: "19:00-21:00", status: "completed", content: "Chữa đề thi thử 1", format: "online" },
  { id: "ss12", classId: "sc1", date: "2026-02-28", time: "19:00-21:00", status: "completed", content: "Chữa đề thi thử 2", rating: 5, format: "online" },
  { id: "ss13", classId: "sc1", date: "2026-03-03", time: "19:00-21:00", status: "scheduled", format: "online", meetingLink: "/student/meeting/ss13" },
  { id: "ss14", classId: "sc1", date: "2026-03-05", time: "19:00-21:00", status: "scheduled", format: "online", meetingLink: "/student/meeting/ss14" },
  { id: "ss15", classId: "sc1", date: "2026-03-07", time: "19:00-21:00", status: "scheduled", format: "online", meetingLink: "/student/meeting/ss15" },
  { id: "ss16", classId: "sc2", date: "2026-02-04", time: "17:00-18:30", status: "completed", content: "Cơ học Newton - Định luật 1", format: "offline" },
  { id: "ss17", classId: "sc2", date: "2026-02-11", time: "17:00-18:30", status: "completed", content: "Cơ học Newton - Định luật 2,3", rating: 4, format: "offline" },
  { id: "ss18", classId: "sc2", date: "2026-02-18", time: "17:00-18:30", status: "completed", content: "Động lượng", format: "offline" },
  { id: "ss19", classId: "sc2", date: "2026-02-25", time: "17:00-18:30", status: "missed", format: "offline" },
  { id: "ss20", classId: "sc2", date: "2026-03-04", time: "17:00-18:30", status: "scheduled", format: "offline" },
  { id: "ss21", classId: "sc2", date: "2026-03-11", time: "17:00-18:30", status: "scheduled", format: "offline" },
  { id: "ss22", classId: "sc3", date: "2026-03-01", time: "9:00-10:30", status: "completed", content: "Writing Task 1 - Line Graph", format: "online", rating: 5, meetingLink: "/student/meeting/ss22" },
  { id: "ss23", classId: "sc3", date: "2026-03-08", time: "9:00-10:30", status: "scheduled", format: "online", meetingLink: "/student/meeting/ss23" },
];

const studentClasses: StudentClass[] = [
  {
    id: "sc1", name: "Toán 12 - Ôn thi ĐH", subject: "Toán",
    tutorId: "t1", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, tutorType: "tutor",
    format: "online", schedule: "T2, T4, T6 - 19:00-21:00",
    totalSessions: 24, completedSessions: 12, status: "active", fee: 2000000,
    sessions: seedSessions.filter(s => s.classId === "sc1"),
  },
  {
    id: "sc2", name: "Lý 12 - Nâng cao", subject: "Lý",
    tutorId: "t5", tutorName: "Võ Minh Tuấn", tutorAvatar: tutor5, tutorType: "tutor",
    format: "offline", schedule: "T3 - 17:00-18:30",
    totalSessions: 16, completedSessions: 3, status: "active", fee: 1500000,
    sessions: seedSessions.filter(s => s.classId === "sc2"),
  },
  {
    id: "sc3", name: "IELTS Writing", subject: "Anh văn",
    tutorId: "t3", tutorName: "Phạm Đức Huy", tutorAvatar: tutor3, tutorType: "tutor",
    format: "online", schedule: "T7 - 9:00-10:30",
    totalSessions: 12, completedSessions: 1, status: "active", fee: 3000000,
    sessions: seedSessions.filter(s => s.classId === "sc3"),
  },
  {
    id: "sc4", name: "Hóa 11 - Cơ bản", subject: "Hóa",
    tutorId: "t2", tutorName: "Trần Thị Bích Ngọc", tutorAvatar: tutor2, tutorType: "teacher",
    format: "online", schedule: "T5 - 19:00-20:30",
    totalSessions: 20, completedSessions: 20, status: "completed", fee: 1800000,
    sessions: [],
  },
];

const defaultAvailability: AvailabilitySlot[] = [
  { day: "Thứ 2", enabled: true, slots: [{ from: "17:00", to: "21:00" }] },
  { day: "Thứ 3", enabled: true, slots: [{ from: "17:00", to: "19:00" }] },
  { day: "Thứ 4", enabled: true, slots: [{ from: "17:00", to: "21:00" }] },
  { day: "Thứ 5", enabled: true, slots: [{ from: "19:00", to: "21:00" }] },
  { day: "Thứ 6", enabled: true, slots: [{ from: "17:00", to: "21:00" }] },
  { day: "Thứ 7", enabled: true, slots: [{ from: "9:00", to: "12:00" }, { from: "14:00", to: "17:00" }] },
  { day: "Chủ nhật", enabled: false, slots: [] },
];

const mathQuestions: TestQuestion[] = [
  { id: "q1", question: "Đạo hàm của hàm số y = x³ + 2x² - 5x + 1 là?", options: ["3x² + 4x - 5", "3x² + 2x - 5", "x³ + 4x - 5", "3x² + 4x + 5"], correctAnswer: 0, explanation: "y' = 3x² + 4x - 5 theo công thức đạo hàm cơ bản." },
  { id: "q2", question: "Tích phân ∫(2x + 1)dx từ 0 đến 1 bằng?", options: ["1", "2", "3", "4"], correctAnswer: 1, explanation: "∫₀¹(2x+1)dx = [x² + x]₀¹ = 1 + 1 = 2" },
  { id: "q3", question: "Giới hạn lim(x→0) sin(x)/x bằng?", options: ["0", "1", "∞", "Không tồn tại"], correctAnswer: 1, explanation: "Đây là giới hạn cơ bản, lim(x→0) sin(x)/x = 1" },
  { id: "q4", question: "Phương trình x² - 5x + 6 = 0 có nghiệm?", options: ["x = 2, x = 3", "x = -2, x = -3", "x = 1, x = 6", "x = -1, x = -6"], correctAnswer: 0, explanation: "x² - 5x + 6 = (x-2)(x-3) = 0 → x = 2 hoặc x = 3" },
  { id: "q5", question: "Số tổ hợp C(5,2) bằng?", options: ["5", "10", "20", "25"], correctAnswer: 1, explanation: "C(5,2) = 5!/(2!·3!) = 10" },
  { id: "q6", question: "Giá trị sin(π/6) bằng?", options: ["1/2", "√2/2", "√3/2", "1"], correctAnswer: 0, explanation: "sin(30°) = sin(π/6) = 1/2" },
  { id: "q7", question: "Vectơ a = (1,2) và b = (3,4). Tích vô hướng a·b bằng?", options: ["5", "7", "11", "14"], correctAnswer: 2, explanation: "a·b = 1×3 + 2×4 = 3 + 8 = 11" },
  { id: "q8", question: "Hàm số y = x³ - 3x có bao nhiêu cực trị?", options: ["0", "1", "2", "3"], correctAnswer: 2, explanation: "y' = 3x² - 3 = 0 → x = ±1, y'' = 6x. x=1 cực tiểu, x=-1 cực đại → 2 cực trị" },
  { id: "q9", question: "log₂(8) bằng?", options: ["2", "3", "4", "8"], correctAnswer: 1, explanation: "2³ = 8 → log₂(8) = 3" },
  { id: "q10", question: "Diện tích hình tròn bán kính R = 3 là?", options: ["6π", "9π", "12π", "3π"], correctAnswer: 1, explanation: "S = πR² = π×9 = 9π" },
];

const physicsQuestions: TestQuestion[] = [
  { id: "pq1", question: "Định luật II Newton được biểu diễn bằng công thức?", options: ["F = ma", "F = mv", "F = m/a", "F = a/m"], correctAnswer: 0, explanation: "F = ma là biểu thức của Định luật II Newton." },
  { id: "pq2", question: "Đơn vị của công là?", options: ["Newton", "Joule", "Watt", "Pascal"], correctAnswer: 1, explanation: "Công có đơn vị là Joule (J)." },
  { id: "pq3", question: "Vận tốc ánh sáng trong chân không xấp xỉ?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correctAnswer: 1, explanation: "c ≈ 3×10⁸ m/s" },
  { id: "pq4", question: "Gia tốc trọng trường trên mặt đất xấp xỉ?", options: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "11 m/s²"], correctAnswer: 0, explanation: "g ≈ 9.8 m/s²" },
  { id: "pq5", question: "Công thức tính động năng?", options: ["Eₖ = mgh", "Eₖ = ½mv²", "Eₖ = Fd", "Eₖ = mv"], correctAnswer: 1, explanation: "Động năng Eₖ = ½mv²" },
  { id: "pq6", question: "Định luật bảo toàn năng lượng phát biểu?", options: ["Năng lượng không tự sinh ra và không tự mất đi", "Năng lượng luôn tăng", "Năng lượng luôn giảm", "Năng lượng có thể tạo ra từ hư không"], correctAnswer: 0, explanation: "Năng lượng không tự sinh ra và không tự mất đi, chỉ chuyển từ dạng này sang dạng khác." },
  { id: "pq7", question: "Sóng âm truyền nhanh nhất trong môi trường?", options: ["Chân không", "Không khí", "Nước", "Chất rắn"], correctAnswer: 3, explanation: "Sóng âm truyền nhanh nhất trong chất rắn." },
  { id: "pq8", question: "Đơn vị đo cường độ dòng điện là?", options: ["Volt", "Ohm", "Ampere", "Watt"], correctAnswer: 2, explanation: "Cường độ dòng điện đo bằng Ampere (A)." },
  { id: "pq9", question: "Chu kì T và tần số f liên hệ bởi công thức?", options: ["T = f", "T = 1/f", "T = 2f", "T = f²"], correctAnswer: 1, explanation: "T = 1/f" },
  { id: "pq10", question: "Lực hướng tâm trong chuyển động tròn đều?", options: ["F = mv²/r", "F = mr²/v", "F = v/mr", "F = mvr"], correctAnswer: 0, explanation: "Fht = mv²/r" },
];

const studentTests: StudentTest[] = [
  { id: "test1", subject: "Toán", title: "Kiểm tra Đạo hàm - Tích phân", totalQuestions: 10, duration: 30, status: "completed", score: 80, completedAt: "2026-02-15", questions: mathQuestions, answers: { q1: 0, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0, q7: 2, q8: 2, q9: 0, q10: 1 } },
  { id: "test2", subject: "Lý", title: "Kiểm tra Cơ học Newton", totalQuestions: 10, duration: 25, status: "completed", score: 70, completedAt: "2026-02-20", questions: physicsQuestions, answers: { pq1: 0, pq2: 1, pq3: 1, pq4: 0, pq5: 1, pq6: 0, pq7: 3, pq8: 2, pq9: 0, pq10: 0 } },
  { id: "test3", subject: "Toán", title: "Kiểm tra Hình học không gian", totalQuestions: 10, duration: 30, status: "available", questions: mathQuestions },
  { id: "test4", subject: "Lý", title: "Kiểm tra Năng lượng & Động lượng", totalQuestions: 10, duration: 25, status: "available", questions: physicsQuestions },
];

const mockExams: MockExam[] = [
  { id: "me1", title: "Đề thi thử THPTQG Toán - Đề 1", subject: "Toán", difficulty: "Trung bình", duration: 90, totalQuestions: 10, communityAvgScore: 65, attempts: 234, price: 10000, purchased: true, status: "completed", score: 80, completedAt: "2026-02-22", questions: mathQuestions, answers: { q1: 0, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0, q7: 2, q8: 2, q9: 1, q10: 1 }, attemptHistory: [{ score: 80, date: "2026-02-22", answers: { q1: 0, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0, q7: 2, q8: 2, q9: 1, q10: 1 } }] },
  { id: "me2", title: "Đề thi thử THPTQG Toán - Đề 2", subject: "Toán", difficulty: "Khó", duration: 90, totalQuestions: 10, communityAvgScore: 55, attempts: 189, price: 10000, purchased: false, status: "available", questions: mathQuestions },
  { id: "me3", title: "Đề thi thử Vật lý - Đề 1", subject: "Lý", difficulty: "Dễ", duration: 60, totalQuestions: 10, communityAvgScore: 72, attempts: 156, price: 10000, purchased: true, status: "completed", score: 70, completedAt: "2026-02-25", questions: physicsQuestions, answers: { pq1: 0, pq2: 1, pq3: 1, pq4: 0, pq5: 1, pq6: 0, pq7: 3, pq8: 2, pq9: 1, pq10: 0 }, attemptHistory: [{ score: 70, date: "2026-02-25", answers: { pq1: 0, pq2: 1, pq3: 1, pq4: 0, pq5: 1, pq6: 0, pq7: 3, pq8: 2, pq9: 1, pq10: 0 } }] },
  { id: "me4", title: "Đề thi thử Vật lý - Đề 2", subject: "Lý", difficulty: "Trung bình", duration: 60, totalQuestions: 10, communityAvgScore: 60, attempts: 201, price: 10000, purchased: false, status: "available", questions: physicsQuestions },
  { id: "me5", title: "Đề thi thử THPTQG Toán - Đề 3", subject: "Toán", difficulty: "Dễ", duration: 90, totalQuestions: 10, communityAvgScore: 75, attempts: 312, price: 10000, purchased: false, status: "available", questions: mathQuestions },
  { id: "me6", title: "Đề thi thử Hóa học - Đề 1", subject: "Hóa", difficulty: "Trung bình", duration: 60, totalQuestions: 10, communityAvgScore: 58, attempts: 145, price: 10000, purchased: false, status: "available", questions: mathQuestions },
];

const examResults: ExamResult[] = [
  { id: "er1", examId: "me1", title: "Đề thi thử THPTQG Toán - Đề 1", subject: "Toán", score: 80, totalQuestions: 10, correctAnswers: 8, passed: true, completedAt: "2026-02-22", duration: 72 },
  { id: "er2", examId: "me3", title: "Đề thi thử Vật lý - Đề 1", subject: "Lý", score: 70, totalQuestions: 10, correctAnswers: 7, passed: true, completedAt: "2026-02-25", duration: 45 },
  { id: "er3", examId: "test1", title: "Kiểm tra Đạo hàm - Tích phân", subject: "Toán", score: 80, totalQuestions: 10, correctAnswers: 8, passed: true, completedAt: "2026-02-15", duration: 22 },
  { id: "er4", examId: "test2", title: "Kiểm tra Cơ học Newton", subject: "Lý", score: 70, totalQuestions: 10, correctAnswers: 7, passed: true, completedAt: "2026-02-20", duration: 18 },
];

const monthlyProgress: MonthlyProgress[] = [
  { month: "T9/2025", gpa: 7.0, studyHours: 40, sessionsCompleted: 8, testsCompleted: 1 },
  { month: "T10/2025", gpa: 7.2, studyHours: 48, sessionsCompleted: 12, testsCompleted: 2 },
  { month: "T11/2025", gpa: 7.5, studyHours: 52, sessionsCompleted: 14, testsCompleted: 2 },
  { month: "T12/2025", gpa: 7.4, studyHours: 44, sessionsCompleted: 10, testsCompleted: 1 },
  { month: "T1/2026", gpa: 7.6, studyHours: 56, sessionsCompleted: 16, testsCompleted: 3 },
  { month: "T2/2026", gpa: 7.8, studyHours: 60, sessionsCompleted: 18, testsCompleted: 4 },
];

const seedNotifications: StudentNotification[] = [
  { id: "sn1", type: "success", title: "Buổi học đã hoàn thành", message: "Buổi Toán 12 ngày 28/02 đã được xác nhận hoàn thành.", timestamp: "28/02/2026 21:05", read: false },
  { id: "sn2", type: "info", title: "Buổi học sắp tới", message: "Bạn có buổi Toán 12 vào 19:00 hôm nay.", timestamp: "03/03/2026 08:00", read: false },
  { id: "sn3", type: "warning", title: "Bài tập chưa nộp", message: "Bài tập Đạo hàm nâng cao chưa được nộp. Hạn nộp: 05/03.", timestamp: "02/03/2026 10:00", read: false },
  { id: "sn4", type: "info", title: "Đề thi thử mới", message: "Đề thi thử THPTQG Toán - Đề 3 vừa được thêm.", timestamp: "01/03/2026 14:00", read: true },
  { id: "sn5", type: "success", title: "Kết quả thi thử", message: "Bạn đạt 80% đề thi thử Toán - Đề 1. Chúc mừng!", timestamp: "22/02/2026 15:30", read: true },
];

const seedChatMessages: StudentChatMessage[] = [
  { id: "scm1", classId: "sc1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Châu ơi, buổi tối nay thầy sẽ chữa đề thi thử số 3 nhé.", timestamp: "03/03 14:00", read: false },
  { id: "scm2", classId: "sc1", sender: "student", senderName: "Lê Minh Châu", message: "Dạ vâng thầy, em đã làm xong đề rồi ạ.", timestamp: "03/03 14:15", read: true },
  { id: "scm3", classId: "sc1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Tốt lắm! Có câu nào khó thì note lại để thầy giải thích kỹ hơn.", timestamp: "03/03 14:20", read: false },
  { id: "scm4", classId: "sc2", sender: "tutor", senderName: "Võ Minh Tuấn", message: "Tuần này mình sẽ học phần điện từ, em chuẩn bị trước chương 4 nhé.", timestamp: "02/03 09:00", read: true },
  { id: "scm5", classId: "sc3", sender: "tutor", senderName: "Phạm Đức Huy", message: "Writing bài thứ 7 em gửi qua email cho thầy chấm trước nha.", timestamp: "01/03 18:00", read: true },
  { id: "scm6", classId: "sc1", sender: "parent", senderName: "Phạm Hồng Đào", message: "Thầy ơi, em Châu tiến bộ tốt không ạ?", timestamp: "28/02 20:00", read: true },
  { id: "scm7", classId: "sc1", sender: "tutor", senderName: "Nguyễn Văn An", message: "Chị yên tâm, em Châu tiến bộ rất nhanh, phần đạo hàm đã vững rồi ạ.", timestamp: "28/02 20:15", read: true },
];

const seedWalletTransactions: WalletTransaction[] = [
  { id: "wt1", type: "deposit", amount: 5000000, description: "Nạp tiền vào ví", date: "2026-01-15", status: "completed", paymentMethod: "MoMo" },
  { id: "wt2", type: "tuition_payment", amount: -2000000, description: "Thanh toán học phí - Toán 12 Ôn thi ĐH", date: "2026-01-16", status: "completed", relatedId: "sc1" },
  { id: "wt3", type: "tuition_payment", amount: -1500000, description: "Thanh toán học phí - Lý 12 Nâng cao", date: "2026-01-20", status: "completed", relatedId: "sc2" },
  { id: "wt4", type: "deposit", amount: 3000000, description: "Nạp tiền vào ví", date: "2026-02-01", status: "completed", paymentMethod: "VNPay" },
  { id: "wt5", type: "tuition_payment", amount: -3000000, description: "Thanh toán học phí - IELTS Writing", date: "2026-02-05", status: "completed", relatedId: "sc3" },
  { id: "wt6", type: "mock_exam_purchase", amount: -10000, description: "Mua đề thi thử THPTQG Toán - Đề 1", date: "2026-02-20", status: "completed", relatedId: "me1" },
  { id: "wt7", type: "mock_exam_purchase", amount: -10000, description: "Mua đề thi thử Vật lý - Đề 1", date: "2026-02-24", status: "completed", relatedId: "me3" },
  { id: "wt8", type: "deposit", amount: 2000000, description: "Nạp tiền vào ví", date: "2026-02-28", status: "completed", paymentMethod: "Vietcombank" },
  { id: "wt9", type: "refund", amount: 500000, description: "Hoàn tiền 5 buổi chưa học - Hóa 11", date: "2026-02-10", status: "completed", relatedId: "sc4" },
];

// ========== CONTEXT ==========

interface StudentContextType {
  profile: StudentProfile;
  classes: StudentClass[];
  tutorListings: TutorListing[];
  availability: AvailabilitySlot[];
  tests: StudentTest[];
  mockExams: MockExam[];
  examResults: ExamResult[];
  monthlyProgress: MonthlyProgress[];
  weeklyGoal: { target: number; current: number };
  notifications: StudentNotification[];
  chatMessages: StudentChatMessage[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  // Actions
  bookTutor: (tutorId: string, subject: string, startDate: string, totalSessions: number, schedule: string) => void;
  requestTrial: (tutorId: string, selectedSlot: { day: string; time: string }) => void;
  updateAvailability: (newAvail: AvailabilitySlot[]) => void;
  submitTest: (testId: string, answers: Record<string, number>) => void;
  submitMockExam: (examId: string, answers: Record<string, number>) => void;
  rateSession: (sessionId: string, rating: number, comment: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendChatMessage: (classId: string, message: string) => void;
  markChatRead: (classId: string) => void;
  purchaseMockExam: (examId: string) => void;
  depositToWallet: (amount: number, method: string) => void;
  payTuition: (classId: string, amount: number, description: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [profile] = useState(studentProfile);
  const [classes, setClasses] = useState(studentClasses);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [tests, setTests] = useState(studentTests);
  const [mockExamsState, setMockExams] = useState(mockExams);
  const [results, setResults] = useState(examResults);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [chatMsgs, setChatMsgs] = useState(seedChatMessages);
  const [walletTxns, setWalletTxns] = useState(seedWalletTransactions);

  const walletBalance = walletTxns.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const bookTutor = useCallback((tutorId: string, subject: string, startDate: string, totalSessions: number, schedule: string) => {
    const tutor = tutorListings.find(t => t.id === tutorId);
    if (!tutor) return;
    const newClass: StudentClass = {
      id: `sc${Date.now()}`,
      name: `${subject} - Lớp mới`,
      subject,
      tutorId,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      tutorType: tutor.type,
      format: "online",
      schedule: schedule || "Chưa xếp lịch",
      totalSessions,
      completedSessions: 0,
      status: "active",
      fee: tutor.hourlyRate * totalSessions,
      sessions: [],
    };
    setClasses(prev => [...prev, newClass]);
    setNotifications(prev => [{ id: `sn${Date.now()}`, type: "success", title: "Đăng ký lớp thành công", message: `Đã đăng ký lớp ${subject} với ${tutor.name}.`, timestamp: new Date().toLocaleString("vi-VN"), read: false }, ...prev]);
  }, []);

  const requestTrial = useCallback((tutorId: string, selectedSlot: { day: string; time: string }) => {
    const tutor = tutorListings.find(t => t.id === tutorId);
    if (!tutor) return;
    setNotifications(prev => [{ id: `sn${Date.now()}`, type: "info", title: "Yêu cầu học thử đã gửi", message: `Đã gửi yêu cầu học thử ${selectedSlot.day} - ${selectedSlot.time} với ${tutor.name}.`, timestamp: new Date().toLocaleString("vi-VN"), read: false }, ...prev]);
  }, []);

  const updateAvailability = useCallback((newAvail: AvailabilitySlot[]) => {
    setAvailability(newAvail);
  }, []);

  const submitTest = useCallback((testId: string, answers: Record<string, number>) => {
    setTests(prev => prev.map(t => {
      if (t.id !== testId) return t;
      const correct = t.questions.filter(q => answers[q.id] === q.correctAnswer).length;
      const score = Math.round((correct / t.totalQuestions) * 100);
      const newResult: ExamResult = {
        id: `er${Date.now()}`, examId: testId, title: t.title, subject: t.subject,
        score, totalQuestions: t.totalQuestions, correctAnswers: correct,
        passed: score >= 50, completedAt: new Date().toISOString().split("T")[0], duration: t.duration,
      };
      setResults(prev => [...prev, newResult]);
      return { ...t, status: "completed" as const, score, completedAt: new Date().toISOString().split("T")[0], answers };
    }));
  }, []);

  const submitMockExam = useCallback((examId: string, answers: Record<string, number>) => {
    setMockExams(prev => prev.map(e => {
      if (e.id !== examId) return e;
      const correct = e.questions.filter(q => answers[q.id] === q.correctAnswer).length;
      const score = Math.round((correct / e.totalQuestions) * 100);
      const newResult: ExamResult = {
        id: `er${Date.now()}`, examId, title: e.title, subject: e.subject,
        score, totalQuestions: e.totalQuestions, correctAnswers: correct,
        passed: score >= 50, completedAt: new Date().toISOString().split("T")[0], duration: e.duration,
      };
      setResults(prev => [...prev, newResult]);
      const newAttempt = { score, date: new Date().toISOString().split("T")[0], answers };
      return { ...e, status: "completed" as const, score, completedAt: new Date().toISOString().split("T")[0], answers, attemptHistory: [...(e.attemptHistory || []), newAttempt] };
    }));
  }, []);

  const rateSession = useCallback((sessionId: string, rating: number, comment: string) => {
    setClasses(prev => prev.map(c => ({
      ...c,
      sessions: c.sessions.map(s => s.id === sessionId ? { ...s, rating, ratingComment: comment } : s),
    })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const sendChatMessage = useCallback((classId: string, message: string) => {
    const newMsg: StudentChatMessage = {
      id: `scm${Date.now()}`, classId, sender: "student", senderName: profile.name,
      message, timestamp: new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }), read: true,
    };
    setChatMsgs(prev => [...prev, newMsg]);
  }, [profile.name]);

  const markChatRead = useCallback((classId: string) => {
    setChatMsgs(prev => prev.map(m => m.classId === classId ? { ...m, read: true } : m));
  }, []);

  const purchaseMockExam = useCallback((examId: string) => {
    const exam = mockExamsState.find(e => e.id === examId);
    if (!exam) return;
    setMockExams(prev => prev.map(e => e.id === examId ? { ...e, purchased: true } : e));
    setWalletTxns(prev => [...prev, { id: `wt${Date.now()}`, type: "mock_exam_purchase", amount: -exam.price, description: `Mua đề thi thử - ${exam.title}`, date: new Date().toISOString().split("T")[0], status: "completed", relatedId: examId }]);
    setNotifications(prev => [{ id: `sn${Date.now()}`, type: "success", title: "Mua đề thành công", message: "Bạn đã mua đề thi thử thành công. Bắt đầu làm bài ngay!", timestamp: new Date().toLocaleString("vi-VN"), read: false }, ...prev]);
  }, [mockExamsState]);

  const depositToWallet = useCallback((amount: number, method: string) => {
    setWalletTxns(prev => [...prev, { id: `wt${Date.now()}`, type: "deposit", amount, description: `Nạp tiền vào ví`, date: new Date().toISOString().split("T")[0], status: "completed", paymentMethod: method }]);
    setNotifications(prev => [{ id: `sn${Date.now()}`, type: "success", title: "Nạp tiền thành công", message: `Đã nạp ${amount.toLocaleString("vi-VN")}đ vào ví qua ${method}.`, timestamp: new Date().toLocaleString("vi-VN"), read: false }, ...prev]);
  }, []);

  const payTuition = useCallback((classId: string, amount: number, description: string) => {
    setWalletTxns(prev => [...prev, { id: `wt${Date.now()}`, type: "tuition_payment", amount: -amount, description, date: new Date().toISOString().split("T")[0], status: "completed", relatedId: classId }]);
  }, []);

  return (
    <StudentContext.Provider value={{
      profile, classes, tutorListings, availability, tests, mockExams: mockExamsState,
      examResults: results, monthlyProgress, weeklyGoal: { target: 15, current: 11 },
      notifications, chatMessages: chatMsgs, walletBalance, walletTransactions: walletTxns,
      bookTutor, requestTrial, updateAvailability, submitTest, submitMockExam, rateSession,
      markNotificationRead, markAllNotificationsRead, sendChatMessage, markChatRead, purchaseMockExam,
      depositToWallet, payTuition,
    }}>
      {children}
    </StudentContext.Provider>
  );
};
