import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Avatar imports
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
import avatarMale6 from "@/assets/avatar-male-6.jpg";
import avatarFemale6 from "@/assets/avatar-female-6.jpg";

// Types
export type UserRole = "tutor" | "teacher" | "student" | "parent" | "accountant" | "office" | "exam-manager" | "admin";
export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type ClassStatus = "searching" | "active" | "completed";
export type ClassFormat = "online" | "offline" | "hybrid";
export type TestType = "multiple-choice" | "essay";
export type TestStatus = "active" | "draft" | "archived";
export type TransactionType = "tuition" | "salary" | "exam-fee";
export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  createdAt: string;
  subject?: string;
  bio?: string;
  school?: string;
  studentId?: string;
}

export interface AdminClass {
  id: string;
  name: string;
  studentId: string;
  tutorId: string;
  format: ClassFormat;
  fee: number;
  status: ClassStatus;
  subject: string;
  createdAt: string;
  schedule?: string;
  totalSessions?: number;
  completedSessions?: number;
  notes?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AdminTest {
  id: string;
  code: string;
  name: string;
  subject: string;
  level: string;
  type: TestType;
  attempts: number;
  status: TestStatus;
  createdAt: string;
  questions: TestQuestion[];
}

export interface AdminTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  description: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

export interface SystemSettings {
  platformName: string;
  escrowPercent: number;
  escrowHoldDays: number;
  enableExams: boolean;
  enableChat: boolean;
  enablePayments: boolean;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

// Question bank for auto-generation
const questionBanks: Record<string, { q: string; opts: string[]; ans: number }[]> = {
  "Toán": [
    { q: "Giải phương trình: 2x + 5 = 15", opts: ["x = 3", "x = 5", "x = 10", "x = 7"], ans: 1 },
    { q: "Tính đạo hàm của f(x) = 3x² + 2x - 1", opts: ["6x + 2", "3x + 2", "6x - 1", "6x² + 2"], ans: 0 },
    { q: "Tính tích phân ∫(2x+1)dx", opts: ["x² + x + C", "2x² + x + C", "x² + C", "2x + C"], ans: 0 },
    { q: "Giá trị của sin(π/6) là?", opts: ["1/2", "√3/2", "√2/2", "1"], ans: 0 },
    { q: "Số nghiệm của phương trình x² - 4x + 4 = 0?", opts: ["0", "1", "2", "3"], ans: 1 },
    { q: "log₂(8) = ?", opts: ["2", "3", "4", "8"], ans: 1 },
    { q: "Diện tích hình tròn bán kính R?", opts: ["2πR", "πR²", "2πR²", "πR"], ans: 1 },
    { q: "Giới hạn lim(x→0) sin(x)/x = ?", opts: ["0", "1", "∞", "Không tồn tại"], ans: 1 },
    { q: "Ma trận đơn vị cấp 2 có dạng?", opts: ["[[1,0],[0,1]]", "[[1,1],[1,1]]", "[[0,0],[0,0]]", "[[2,0],[0,2]]"], ans: 0 },
    { q: "Tổ hợp C(5,2) = ?", opts: ["5", "10", "20", "25"], ans: 1 },
    { q: "Số phức z = 3 + 4i có module bằng?", opts: ["3", "4", "5", "7"], ans: 2 },
    { q: "Cấp số cộng: 2, 5, 8, 11. Số hạng thứ 10?", opts: ["26", "29", "32", "35"], ans: 1 },
  ],
  "Văn": [
    { q: "Tác giả 'Truyện Kiều' là ai?", opts: ["Nguyễn Du", "Nguyễn Trãi", "Hồ Xuân Hương", "Xuân Diệu"], ans: 0 },
    { q: "Bài thơ 'Tây Tiến' của tác giả nào?", opts: ["Quang Dũng", "Tố Hữu", "Huy Cận", "Chế Lan Viên"], ans: 0 },
    { q: "'Vội vàng' thuộc phong trào văn học nào?", opts: ["Thơ Mới", "Thơ cũ", "Văn học hiện thực", "Thơ cách mạng"], ans: 0 },
    { q: "Nhân vật Chí Phèo do ai sáng tác?", opts: ["Nam Cao", "Ngô Tất Tố", "Vũ Trọng Phụng", "Nguyễn Công Hoan"], ans: 0 },
    { q: "Phép tu từ 'mặt trời trong lăng rất đỏ'?", opts: ["So sánh", "Ẩn dụ", "Hoán dụ", "Nhân hóa"], ans: 1 },
    { q: "Tác phẩm 'Số đỏ' thuộc thể loại?", opts: ["Truyện ngắn", "Tiểu thuyết", "Kịch", "Thơ"], ans: 1 },
    { q: "'Đây thôn Vĩ Dạ' do ai viết?", opts: ["Hàn Mặc Tử", "Xuân Diệu", "Huy Cận", "Nguyễn Bính"], ans: 0 },
    { q: "Thể loại của 'Bình Ngô đại cáo'?", opts: ["Cáo", "Hịch", "Chiếu", "Biểu"], ans: 0 },
    { q: "Nhà văn nào viết 'Tắt đèn'?", opts: ["Ngô Tất Tố", "Nam Cao", "Nguyễn Công Hoan", "Vũ Trọng Phụng"], ans: 0 },
    { q: "Bài thơ 'Sóng' của Xuân Quỳnh viết năm?", opts: ["1967", "1975", "1960", "1972"], ans: 0 },
  ],
  "Anh": [
    { q: "Choose the correct form: She ___ to school every day.", opts: ["go", "goes", "going", "gone"], ans: 1 },
    { q: "The past tense of 'buy' is:", opts: ["buyed", "bought", "buied", "buying"], ans: 1 },
    { q: "Which is correct? 'I have been ___ for 2 hours.'", opts: ["wait", "waited", "waiting", "waits"], ans: 2 },
    { q: "Synonym of 'beautiful':", opts: ["ugly", "gorgeous", "bad", "terrible"], ans: 1 },
    { q: "'If I ___ rich, I would travel.'", opts: ["am", "were", "was", "be"], ans: 1 },
    { q: "The capital of the UK is:", opts: ["Paris", "London", "Berlin", "Madrid"], ans: 1 },
    { q: "Choose correct preposition: interested ___", opts: ["in", "on", "at", "to"], ans: 0 },
    { q: "'He suggested ___ the movie.'", opts: ["watch", "to watch", "watching", "watched"], ans: 2 },
    { q: "Antonym of 'ancient':", opts: ["old", "modern", "traditional", "classic"], ans: 1 },
    { q: "Which word is a noun?", opts: ["quickly", "beautiful", "happiness", "run"], ans: 2 },
  ],
  "Lý": [
    { q: "Đơn vị của lực là?", opts: ["Joule", "Newton", "Watt", "Pascal"], ans: 1 },
    { q: "Công thức F = ma là định luật?", opts: ["Định luật I", "Định luật II", "Định luật III", "Định luật Hooke"], ans: 1 },
    { q: "Vận tốc ánh sáng trong chân không?", opts: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1 },
    { q: "Đơn vị đo điện trở là?", opts: ["Volt", "Ampere", "Ohm", "Watt"], ans: 2 },
    { q: "Năng lượng E = mc² do ai đề xuất?", opts: ["Newton", "Einstein", "Bohr", "Faraday"], ans: 1 },
    { q: "Sóng âm không truyền được trong?", opts: ["Nước", "Không khí", "Chân không", "Kim loại"], ans: 2 },
    { q: "Đơn vị công suất là?", opts: ["Joule", "Newton", "Watt", "Hertz"], ans: 2 },
    { q: "Hiện tượng khúc xạ xảy ra khi?", opts: ["Ánh sáng đi thẳng", "Ánh sáng qua 2 môi trường", "Ánh sáng phản xạ", "Ánh sáng tắt"], ans: 1 },
    { q: "Gia tốc trọng trường g ≈ ?", opts: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "7.8 m/s²"], ans: 1 },
    { q: "Điện tích electron có giá trị?", opts: ["1.6×10⁻¹⁹ C", "-1.6×10⁻¹⁹ C", "1.6×10⁻¹⁸ C", "-1.6×10⁻²⁰ C"], ans: 1 },
  ],
  "Hóa": [
    { q: "Công thức hóa học của nước?", opts: ["H₂O", "CO₂", "NaCl", "H₂SO₄"], ans: 0 },
    { q: "Kim loại nào nhẹ nhất?", opts: ["Nhôm", "Sắt", "Lithium", "Natri"], ans: 2 },
    { q: "pH = 7 là môi trường?", opts: ["Axit", "Bazơ", "Trung tính", "Muối"], ans: 2 },
    { q: "Nguyên tố nào nhiều nhất trong vỏ Trái Đất?", opts: ["Sắt", "Oxy", "Silicon", "Nhôm"], ans: 1 },
    { q: "Liên kết ion hình thành giữa?", opts: ["Kim loại - Kim loại", "Phi kim - Phi kim", "Kim loại - Phi kim", "Khí hiếm - Kim loại"], ans: 2 },
    { q: "Số Avogadro có giá trị?", opts: ["6.022×10²³", "6.022×10²²", "6.022×10²⁴", "3.14×10²³"], ans: 0 },
    { q: "Axit clohidric có công thức?", opts: ["HCl", "H₂SO₄", "HNO₃", "H₃PO₄"], ans: 0 },
    { q: "Phản ứng tỏa nhiệt là?", opts: ["ΔH > 0", "ΔH < 0", "ΔH = 0", "Không xác định"], ans: 1 },
    { q: "Nhóm chức -OH thuộc loại?", opts: ["Andehit", "Xeton", "Ancol", "Axit"], ans: 2 },
    { q: "Khí CO₂ gây hiệu ứng gì?", opts: ["Tầng ozone", "Nhà kính", "Mưa axit", "Sương mù"], ans: 1 },
  ],
  "Sinh": [
    { q: "DNA là viết tắt của?", opts: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Dioxin Acid", "Dextrose Acid"], ans: 0 },
    { q: "Quá trình quang hợp xảy ra ở?", opts: ["Ti thể", "Lục lạp", "Ribosome", "Nhân"], ans: 1 },
    { q: "Bộ NST của người là?", opts: ["23", "46", "44", "48"], ans: 1 },
    { q: "Enzym là chất xúc tác có bản chất?", opts: ["Lipid", "Protein", "Carbohydrate", "Nucleic acid"], ans: 1 },
    { q: "Đơn vị cấu tạo của protein?", opts: ["Nucleotide", "Amino acid", "Glucose", "Fatty acid"], ans: 1 },
  ],
};

function generateQuestions(subject: string, count: number = 10): TestQuestion[] {
  const bank = questionBanks[subject] || questionBanks["Toán"];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((item, i) => ({
    id: `q${Date.now()}_${i}`,
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
  }));
}

// Seed data with local avatar imports
const seedUsers: AdminUser[] = [
  { id: "u1", name: "Nguyễn Văn An", email: "an.nguyen@edu.vn", phone: "0901234567", role: "tutor", status: "approved", avatar: avatarMale1, createdAt: "2025-12-01", subject: "Toán", bio: "Gia sư Toán 5 năm kinh nghiệm, tốt nghiệp ĐH Sư Phạm", school: "ĐH Sư Phạm TP.HCM", studentId: "SP2019001" },
  { id: "u2", name: "Trần Thị Bích", email: "bich.tran@edu.vn", phone: "0912345678", role: "teacher", status: "approved", avatar: avatarFemale1, createdAt: "2025-11-15", subject: "Văn", bio: "Giáo viên Ngữ Văn trường THPT chuyên", school: "THPT Chuyên Lê Hồng Phong" },
  { id: "u3", name: "Lê Minh Châu", email: "chau.le@edu.vn", phone: "0923456789", role: "student", status: "approved", avatar: avatarMale2, createdAt: "2026-01-10", school: "THPT Nguyễn Thị Minh Khai", studentId: "HS2024001" },
  { id: "u4", name: "Phạm Hồng Đào", email: "dao.pham@edu.vn", phone: "0934567890", role: "parent", status: "approved", avatar: avatarFemale2, createdAt: "2026-01-05" },
  { id: "u5", name: "Hoàng Đức Em", email: "em.hoang@edu.vn", phone: "0945678901", role: "tutor", status: "pending", avatar: avatarMale3, createdAt: "2026-02-20", subject: "Lý", bio: "Thạc sĩ Vật Lý, dạy ôn thi đại học", school: "ĐH Bách Khoa Hà Nội", studentId: "BK2018042" },
  { id: "u6", name: "Vũ Thị Phương", email: "phuong.vu@edu.vn", phone: "0956789012", role: "teacher", status: "pending", avatar: avatarFemale3, createdAt: "2026-02-22", subject: "Hóa", bio: "GV Hóa 10 năm kinh nghiệm, THPT Lê Quý Đôn", school: "THPT Lê Quý Đôn" },
  { id: "u7", name: "Đỗ Quang Minh", email: "minh.do@edu.vn", phone: "0967890123", role: "tutor", status: "pending", avatar: avatarMale4, createdAt: "2026-02-25", subject: "Anh", bio: "IELTS 8.5, dạy IELTS/TOEIC 3 năm", school: "ĐH Ngoại Thương", studentId: "FTU2017088" },
  { id: "u8", name: "Ngô Thị Lan", email: "lan.ngo@edu.vn", phone: "0978901234", role: "student", status: "approved", avatar: avatarFemale4, createdAt: "2026-01-20", school: "THPT Trần Đại Nghĩa" },
  { id: "u9", name: "Bùi Văn Hùng", email: "hung.bui@edu.vn", phone: "0989012345", role: "tutor", status: "rejected", avatar: avatarMale5, createdAt: "2026-01-30", subject: "Sinh", bio: "Sinh viên năm 3 ĐH Y", school: "ĐH Y Dược TP.HCM", studentId: "YD2022015" },
  { id: "u10", name: "Lý Thị Mai", email: "mai.ly@edu.vn", phone: "0990123456", role: "parent", status: "approved", avatar: avatarFemale5, createdAt: "2026-02-01" },
  { id: "u11", name: "Trương Văn Kiên", email: "kien.truong@edu.vn", phone: "0901112233", role: "student", status: "approved", avatar: avatarMale6, createdAt: "2026-02-10", school: "THPT Nguyễn Huệ" },
  { id: "u12", name: "Đinh Thị Hoa", email: "hoa.dinh@edu.vn", phone: "0912223344", role: "teacher", status: "approved", avatar: avatarFemale6, createdAt: "2025-10-05", subject: "Sử", bio: "Giáo viên Lịch Sử THPT chuyên Hà Nội", school: "THPT Chuyên Hà Nội - Amsterdam" },
];

const seedClasses: AdminClass[] = [
  { id: "c1", name: "Toán 12 - Ôn thi ĐH", studentId: "u3", tutorId: "u1", format: "online", fee: 2000000, status: "active", subject: "Toán", createdAt: "2026-01-15", schedule: "T2, T4, T6 - 19:00-21:00", totalSessions: 24, completedSessions: 12, notes: "Ôn tập trọng tâm đại số và giải tích" },
  { id: "c2", name: "Văn 11 - Nâng cao", studentId: "u8", tutorId: "u2", format: "offline", fee: 1500000, status: "active", subject: "Văn", createdAt: "2026-01-20", schedule: "T3, T5 - 18:00-20:00", totalSessions: 16, completedSessions: 8, notes: "Tập trung phân tích tác phẩm văn học" },
  { id: "c3", name: "IELTS Writing", studentId: "u11", tutorId: "u1", format: "hybrid", fee: 3000000, status: "searching", subject: "Anh", createdAt: "2026-02-15", schedule: "T7 - 9:00-12:00", totalSessions: 12, completedSessions: 0, notes: "Mục tiêu IELTS Writing 7.0+" },
  { id: "c4", name: "Lý 10 - Cơ bản", studentId: "u3", tutorId: "u1", format: "online", fee: 1800000, status: "completed", subject: "Lý", createdAt: "2025-11-01", schedule: "T2, T6 - 17:00-19:00", totalSessions: 20, completedSessions: 20, notes: "Hoàn thành chương trình Lý 10" },
];

const seedTests: AdminTest[] = [
  { id: "t1", code: "T001", name: "Đề thi thử Toán 12", subject: "Toán", level: "Lớp 12", type: "multiple-choice", attempts: 234, status: "active", createdAt: "2026-01-01", questions: generateQuestions("Toán", 10) },
  { id: "t2", code: "T002", name: "Đề thi thử Văn 11", subject: "Văn", level: "Lớp 11", type: "essay", attempts: 156, status: "active", createdAt: "2026-01-15", questions: generateQuestions("Văn", 10) },
  { id: "t3", code: "T003", name: "IELTS Mock Test 1", subject: "Anh", level: "IELTS", type: "multiple-choice", attempts: 89, status: "active", createdAt: "2026-02-01", questions: generateQuestions("Anh", 10) },
  { id: "t4", code: "T004", name: "Hóa 12 - Hữu cơ", subject: "Hóa", level: "Lớp 12", type: "multiple-choice", attempts: 45, status: "draft", createdAt: "2026-02-20", questions: generateQuestions("Hóa", 10) },
  { id: "t5", code: "T005", name: "Lý 10 - Động lực học", subject: "Lý", level: "Lớp 10", type: "multiple-choice", attempts: 312, status: "archived", createdAt: "2025-09-01", questions: generateQuestions("Lý", 10) },
];

const seedTransactions: AdminTransaction[] = [
  { id: "tx1", userId: "u3", type: "tuition", amount: 2000000, date: "2026-02-01", status: "completed", description: "Học phí Toán 12 - T2/2026" },
  { id: "tx2", userId: "u1", type: "salary", amount: 1600000, date: "2026-02-05", status: "completed", description: "Lương gia sư Toán 12 - T1/2026" },
  { id: "tx3", userId: "u8", type: "tuition", amount: 1500000, date: "2026-02-10", status: "completed", description: "Học phí Văn 11 - T2/2026" },
  { id: "tx4", userId: "u2", type: "salary", amount: 1200000, date: "2026-02-12", status: "pending", description: "Lương GV Văn 11 - T1/2026" },
  { id: "tx5", userId: "u11", type: "exam-fee", amount: 50000, date: "2026-02-15", status: "completed", description: "Phí thi thử IELTS" },
  { id: "tx6", userId: "u3", type: "exam-fee", amount: 30000, date: "2026-02-18", status: "completed", description: "Phí thi thử Toán 12" },
  { id: "tx7", userId: "u3", type: "tuition", amount: 2000000, date: "2026-03-01", status: "completed", description: "Học phí Toán 12 - T3/2026" },
  { id: "tx8", userId: "u8", type: "tuition", amount: 1500000, date: "2026-03-01", status: "pending", description: "Học phí Văn 11 - T3/2026" },
];

const seedAuditLog: AuditLogEntry[] = [
  { id: "al1", actor: "Admin", action: "Duyệt tài khoản", target: "Nguyễn Văn An (Gia sư)", timestamp: "2025-12-01 09:00" },
  { id: "al2", actor: "Admin", action: "Tạo lớp học", target: "Toán 12 - Ôn thi ĐH", timestamp: "2026-01-15 10:30" },
  { id: "al3", actor: "Admin", action: "Từ chối tài khoản", target: "Bùi Văn Hùng (Gia sư)", timestamp: "2026-02-01 14:00" },
  { id: "al4", actor: "Admin", action: "Cập nhật cài đặt", target: "Phí escrow: 20%", timestamp: "2026-02-10 08:15" },
];

const seedNotifications: Notification[] = [
  { id: "n1", title: "Tài khoản mới chờ duyệt", message: "Hoàng Đức Em đã đăng ký làm gia sư môn Lý", type: "warning", read: false, timestamp: "2026-02-20 10:00" },
  { id: "n2", title: "Tài khoản mới chờ duyệt", message: "Vũ Thị Phương đã đăng ký làm giáo viên môn Hóa", type: "warning", read: false, timestamp: "2026-02-22 14:30" },
  { id: "n3", title: "Tài khoản mới chờ duyệt", message: "Đỗ Quang Minh đã đăng ký làm gia sư môn Anh", type: "warning", read: false, timestamp: "2026-02-25 09:15" },
  { id: "n4", title: "Giao dịch thành công", message: "Học phí Toán 12 - T3/2026 đã hoàn thành", type: "success", read: false, timestamp: "2026-03-01 08:00" },
  { id: "n5", title: "Lớp học mới tạo", message: "IELTS Writing đang tìm gia sư phù hợp", type: "info", read: true, timestamp: "2026-02-15 16:00" },
  { id: "n6", title: "Giao dịch đang chờ", message: "Lương GV Văn 11 chưa được xử lý", type: "warning", read: true, timestamp: "2026-02-12 11:00" },
];

const defaultSettings: SystemSettings = {
  platformName: "EduConnect",
  escrowPercent: 20,
  escrowHoldDays: 7,
  enableExams: true,
  enableChat: true,
  enablePayments: true,
  maintenanceMode: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
};

interface AdminContextType {
  users: AdminUser[];
  classes: AdminClass[];
  tests: AdminTest[];
  transactions: AdminTransaction[];
  auditLog: AuditLogEntry[];
  notifications: Notification[];
  settings: SystemSettings;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
  addClass: (cls: Omit<AdminClass, "id" | "createdAt">) => void;
  updateClass: (id: string, data: Partial<AdminClass>) => void;
  deleteClass: (id: string) => void;
  addTest: (test: Omit<AdminTest, "id" | "createdAt" | "attempts" | "questions">) => void;
  updateTest: (id: string, data: Partial<AdminTest>) => void;
  deleteTest: (id: string) => void;
  addTransaction: (tx: Omit<AdminTransaction, "id">) => void;
  updateSettings: (s: Partial<SystemSettings>) => void;
  getUserById: (id: string) => AdminUser | undefined;
  addAuditLog: (action: string, target: string) => void;
  generateQuestionsForTest: (subject: string, count?: number) => TestQuestion[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

let nextId = 100;
const genId = (prefix: string) => `${prefix}${++nextId}`;

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [classes, setClasses] = useState<AdminClass[]>(seedClasses);
  const [tests, setTests] = useState<AdminTest[]>(seedTests);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(seedTransactions);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(seedAuditLog);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  const addAuditLog = useCallback((action: string, target: string) => {
    setAuditLog(prev => [{
      id: genId("al"),
      actor: "Admin",
      action,
      target,
      timestamp: new Date().toLocaleString("vi-VN"),
    }, ...prev]);
  }, []);

  const approveUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "approved" as UserStatus } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditLog("Duyệt tài khoản", `${user.name} (${user.role})`);
  }, [users, addAuditLog]);

  const rejectUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "rejected" as UserStatus } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditLog("Từ chối tài khoản", `${user.name} (${user.role})`);
  }, [users, addAuditLog]);

  const updateUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user) addAuditLog("Xóa người dùng", `${user.name}`);
  }, [users, addAuditLog]);

  const addClass = useCallback((cls: Omit<AdminClass, "id" | "createdAt">) => {
    const newClass: AdminClass = { ...cls, id: genId("c"), createdAt: new Date().toISOString().slice(0, 10) };
    setClasses(prev => [newClass, ...prev]);
    addAuditLog("Tạo lớp học", cls.name);
  }, [addAuditLog]);

  const updateClass = useCallback((id: string, data: Partial<AdminClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    addAuditLog("Cập nhật lớp học", data.name || id);
  }, [addAuditLog]);

  const deleteClass = useCallback((id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    if (cls) addAuditLog("Xóa lớp học", cls.name);
  }, [classes, addAuditLog]);

  const addTest = useCallback((test: Omit<AdminTest, "id" | "createdAt" | "attempts" | "questions">) => {
    const questions = generateQuestions(test.subject, 10);
    const newTest: AdminTest = { ...test, id: genId("t"), createdAt: new Date().toISOString().slice(0, 10), attempts: 0, questions };
    setTests(prev => [newTest, ...prev]);
    addAuditLog("Tạo bài test", test.name);
  }, [addAuditLog]);

  const updateTest = useCallback((id: string, data: Partial<AdminTest>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    addAuditLog("Cập nhật bài test", data.name || id);
  }, [addAuditLog]);

  const deleteTest = useCallback((id: string) => {
    const test = tests.find(t => t.id === id);
    setTests(prev => prev.filter(t => t.id !== id));
    if (test) addAuditLog("Xóa bài test", `${test.code} - ${test.name}`);
  }, [tests, addAuditLog]);

  const addTransaction = useCallback((tx: Omit<AdminTransaction, "id">) => {
    setTransactions(prev => [{ ...tx, id: genId("tx") }, ...prev]);
    addAuditLog("Thêm giao dịch", tx.description);
  }, [addAuditLog]);

  const updateSettings = useCallback((s: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    addAuditLog("Cập nhật cài đặt", Object.keys(s).join(", "));
  }, [addAuditLog]);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  const generateQuestionsForTest = useCallback((subject: string, count: number = 10) => {
    return generateQuestions(subject, count);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AdminContext.Provider value={{
      users, classes, tests, transactions, auditLog, notifications, settings,
      approveUser, rejectUser, updateUserStatus, deleteUser,
      addClass, updateClass, deleteClass,
      addTest, updateTest, deleteTest,
      addTransaction, updateSettings, getUserById, addAuditLog,
      generateQuestionsForTest, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
