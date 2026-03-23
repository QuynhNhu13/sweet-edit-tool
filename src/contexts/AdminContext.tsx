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
  { id: "u13", name: "Mai Anh Tuấn", email: "tuan.mai@edu.vn", phone: "0902223344", role: "tutor", status: "approved", avatar: avatarMale1, createdAt: "2026-03-01", subject: "Toán", bio: "Gia sư Toán chuyên ôn thi", school: "ĐH Khoa Học Tự Nhiên", studentId: "KH2019055" },
  { id: "u14", name: "Nguyễn Thị Linh", email: "linh.nguyen@edu.vn", phone: "0913334455", role: "student", status: "approved", avatar: avatarFemale1, createdAt: "2026-03-05", school: "THPT Marie Curie" },
  { id: "u15", name: "Phan Văn Đức", email: "duc.phan@edu.vn", phone: "0924445566", role: "tutor", status: "approved", avatar: avatarMale2, createdAt: "2026-03-10", subject: "Anh", bio: "Gia sư tiếng Anh chuyên ngữ pháp", school: "ĐH Ngoại Ngữ", studentId: "NN2018033" },
  { id: "u16", name: "Trần Minh Tuấn", email: "tuan.tran@edu.vn", phone: "0935556677", role: "teacher", status: "approved", avatar: avatarMale3, createdAt: "2026-03-12", subject: "Lý", bio: "Giáo viên Vật Lý THPT", school: "THPT Nguyễn Thượng Hiền" },
  { id: "u17", name: "Lê Thị Hương", email: "huong.le@edu.vn", phone: "0946667788", role: "student", status: "pending", avatar: avatarFemale2, createdAt: "2026-03-15", school: "THPT Võ Thị Sáu" },
  { id: "u18", name: "Hoàng Văn Nam", email: "nam.hoang@edu.vn", phone: "0957778899", role: "tutor", status: "approved", avatar: avatarMale4, createdAt: "2026-03-18", subject: "Hóa", bio: "Chuyên gia Hóa học", school: "ĐH Bách Khoa", studentId: "BK2017077" },
  { id: "u19", name: "Vũ Minh Anh", email: "anh.vu@edu.vn", phone: "0968889900", role: "parent", status: "approved", avatar: avatarFemale3, createdAt: "2026-03-20" },
  { id: "u20", name: "Đỗ Thị Lan", email: "lan.do@edu.vn", phone: "0979990011", role: "student", status: "approved", avatar: avatarFemale4, createdAt: "2026-03-22", school: "THPT Gia Định" },
];

const seedClasses: AdminClass[] = [
  { id: "c1", name: "Toán 12 - Ôn thi ĐH", studentId: "u3", tutorId: "u1", format: "online", fee: 2000000, status: "active", subject: "Toán", createdAt: "2026-01-15", schedule: "T2, T4, T6 - 19:00-21:00", totalSessions: 24, completedSessions: 12, notes: "Ôn tập trọng tâm đại số và giải tích" },
  { id: "c2", name: "Văn 11 - Nâng cao", studentId: "u8", tutorId: "u2", format: "offline", fee: 1500000, status: "active", subject: "Văn", createdAt: "2026-01-20", schedule: "T3, T5 - 18:00-20:00", totalSessions: 16, completedSessions: 8, notes: "Tập trung phân tích tác phẩm văn học" },
  { id: "c3", name: "IELTS Writing", studentId: "u11", tutorId: "u1", format: "hybrid", fee: 3000000, status: "searching", subject: "Anh", createdAt: "2026-02-15", schedule: "T7 - 9:00-12:00", totalSessions: 12, completedSessions: 0, notes: "Mục tiêu IELTS Writing 7.0+" },
  { id: "c4", name: "Lý 10 - Cơ bản", studentId: "u3", tutorId: "u1", format: "online", fee: 1800000, status: "completed", subject: "Lý", createdAt: "2025-11-01", schedule: "T2, T6 - 17:00-19:00", totalSessions: 20, completedSessions: 20, notes: "Hoàn thành chương trình Lý 10" },
  { id: "c5", name: "Hóa 12 - Ôn thi", studentId: "u14", tutorId: "u6", format: "online", fee: 2200000, status: "active", subject: "Hóa", createdAt: "2026-03-01", schedule: "T3, T5, T7 - 20:00-22:00", totalSessions: 20, completedSessions: 5, notes: "Ôn tập Hóa hữu cơ và vô cơ" },
  { id: "c6", name: "Tiếng Anh Giao Tiếp", studentId: "u17", tutorId: "u7", format: "offline", fee: 2500000, status: "searching", subject: "Anh", createdAt: "2026-03-10", schedule: "T2, T4 - 18:30-20:30", totalSessions: 16, completedSessions: 0, notes: "Cải thiện kỹ năng speaking" },
  { id: "c7", name: "Toán 11 - Đại số", studentId: "u20", tutorId: "u13", format: "online", fee: 1900000, status: "active", subject: "Toán", createdAt: "2026-03-15", schedule: "T3, T6 - 19:00-21:00", totalSessions: 18, completedSessions: 3, notes: "Ôn tập đại số tuyến tính" },
  { id: "c8", name: "Văn 10 - Phân tích", studentId: "u14", tutorId: "u2", format: "hybrid", fee: 1600000, status: "completed", subject: "Văn", createdAt: "2026-02-01", schedule: "T4, T7 - 17:00-19:00", totalSessions: 15, completedSessions: 15, notes: "Hoàn thành phân tích văn học" },
  { id: "c9", name: "Lý 12 - Điện từ", studentId: "u11", tutorId: "u5", format: "online", fee: 2100000, status: "active", subject: "Lý", createdAt: "2026-03-05", schedule: "T2, T5 - 20:00-22:00", totalSessions: 22, completedSessions: 8, notes: "Ôn tập điện từ học" },
  { id: "c10", name: "Sinh học 11", studentId: "u8", tutorId: "u9", format: "offline", fee: 1800000, status: "searching", subject: "Sinh", createdAt: "2026-03-20", schedule: "T3, T6 - 18:00-20:00", totalSessions: 14, completedSessions: 0, notes: "Ôn tập di truyền và tiến hóa" },
];

const seedTests: AdminTest[] = [
  { id: "t1", code: "T001", name: "Đề thi thử Toán 12", subject: "Toán", level: "Lớp 12", type: "multiple-choice", attempts: 234, status: "active", createdAt: "2026-01-01", questions: generateQuestions("Toán", 10) },
  { id: "t2", code: "T002", name: "Đề thi thử Văn 11", subject: "Văn", level: "Lớp 11", type: "essay", attempts: 156, status: "active", createdAt: "2026-01-15", questions: generateQuestions("Văn", 10) },
  { id: "t3", code: "T003", name: "IELTS Mock Test 1", subject: "Anh", level: "IELTS", type: "multiple-choice", attempts: 89, status: "active", createdAt: "2026-02-01", questions: generateQuestions("Anh", 10) },
  { id: "t4", code: "T004", name: "Hóa 12 - Hữu cơ", subject: "Hóa", level: "Lớp 12", type: "multiple-choice", attempts: 45, status: "draft", createdAt: "2026-02-20", questions: generateQuestions("Hóa", 10) },
  { id: "t5", code: "T005", name: "Lý 10 - Động lực học", subject: "Lý", level: "Lớp 10", type: "multiple-choice", attempts: 312, status: "archived", createdAt: "2025-09-01", questions: generateQuestions("Lý", 10) },
  { id: "t6", code: "T006", name: "Sinh học 11 - Di truyền", subject: "Sinh", level: "Lớp 11", type: "multiple-choice", attempts: 78, status: "active", createdAt: "2026-03-01", questions: generateQuestions("Sinh", 10) },
  { id: "t7", code: "T007", name: "Toán 11 - Hình học", subject: "Toán", level: "Lớp 11", type: "multiple-choice", attempts: 145, status: "active", createdAt: "2026-03-10", questions: generateQuestions("Toán", 10) },
  { id: "t8", code: "T008", name: "Văn 10 - Tác phẩm", subject: "Văn", level: "Lớp 10", type: "essay", attempts: 67, status: "draft", createdAt: "2026-03-15", questions: generateQuestions("Văn", 10) },
  { id: "t9", code: "T009", name: "TOEIC Listening", subject: "Anh", level: "TOEIC", type: "multiple-choice", attempts: 203, status: "active", createdAt: "2026-03-20", questions: generateQuestions("Anh", 10) },
  { id: "t10", code: "T010", name: "Lý 12 - Quang học", subject: "Lý", level: "Lớp 12", type: "multiple-choice", attempts: 98, status: "active", createdAt: "2026-03-25", questions: generateQuestions("Lý", 10) },
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
  { id: "tx9", userId: "u6", type: "salary", amount: 1760000, date: "2026-03-05", status: "completed", description: "Lương GV Hóa 12 - T2/2026" },
  { id: "tx10", userId: "u14", type: "tuition", amount: 2200000, date: "2026-03-10", status: "completed", description: "Học phí Hóa 12 - T3/2026" },
  { id: "tx11", userId: "u13", type: "salary", amount: 1520000, date: "2026-03-12", status: "completed", description: "Lương gia sư Toán 11 - T2/2026" },
  { id: "tx12", userId: "u20", type: "tuition", amount: 1900000, date: "2026-03-15", status: "pending", description: "Học phí Toán 11 - T3/2026" },
  { id: "tx13", userId: "u15", type: "salary", amount: 2000000, date: "2026-03-18", status: "completed", description: "Lương gia sư Anh - T3/2026" },
  { id: "tx14", userId: "u17", type: "exam-fee", amount: 40000, date: "2026-03-20", status: "completed", description: "Phí thi thử TOEIC" },
  { id: "tx15", userId: "u11", type: "tuition", amount: 2100000, date: "2026-03-22", status: "completed", description: "Học phí Lý 12 - T3/2026" },
  { id: "tx16", userId: "u5", type: "salary", amount: 1680000, date: "2026-03-25", status: "pending", description: "Lương gia sư Lý 12 - T2/2026" },
  { id: "tx17", userId: "u14", type: "exam-fee", amount: 35000, date: "2026-03-28", status: "failed", description: "Phí thi thử Hóa 12 - Thất bại" },
  { id: "tx18", userId: "u2", type: "salary", amount: 1200000, date: "2026-03-30", status: "completed", description: "Lương GV Văn 11 - T3/2026" },
  { id: "tx19", userId: "u8", type: "tuition", amount: 1500000, date: "2026-04-01", status: "refunded", description: "Hoàn tiền học phí Văn 11" },
  { id: "tx20", userId: "u1", type: "salary", amount: 1600000, date: "2026-04-05", status: "completed", description: "Lương gia sư Toán 12 - T3/2026" },
];

const seedAuditLog: AuditLogEntry[] = [
  { id: "al1", actor: "Admin", action: "Duyệt tài khoản", target: "Nguyễn Văn An (Gia sư)", timestamp: "2026-03-20 09:00" },
  { id: "al2", actor: "Admin", action: "Tạo lớp học", target: "Toán 12 - Ôn thi ĐH", timestamp: "2026-03-19 10:30" },
  { id: "al3", actor: "Admin", action: "Từ chối tài khoản", target: "Bùi Văn Hùng (Gia sư)", timestamp: "2026-03-18 14:00" },
  { id: "al4", actor: "Admin", action: "Cập nhật cài đặt", target: "Phí escrow: 20%", timestamp: "2026-03-17 08:15" },
  { id: "al5", actor: "Admin", action: "Xóa người dùng", target: "Đinh Thị Hoa", timestamp: "2026-03-16 11:45" },
  { id: "al6", actor: "Admin", action: "Thêm giao dịch", target: "Học phí Văn 11", timestamp: "2026-03-15 13:30" },
  { id: "al7", actor: "Admin", action: "Cập nhật lớp học", target: "IELTS Writing", timestamp: "2026-03-14 10:25" },
  { id: "al8", actor: "Admin", action: "Duyệt tài khoản", target: "Hoàng Đức Em (Gia sư)", timestamp: "2026-03-13 09:40" },
  { id: "al9", actor: "Admin", action: "Tạo bài test", target: "Đề thi thử Toán 12", timestamp: "2026-03-12 15:20" },
  { id: "al10", actor: "Admin", action: "Cập nhật bài test", target: "IELTS Mock Test 1", timestamp: "2026-03-11 14:10" },
  { id: "al11", actor: "Admin", action: "Xóa bài test", target: "Đề thi thử cũ", timestamp: "2026-03-10 12:05" },
  { id: "al12", actor: "Admin", action: "Duyệt tài khoản", target: "Vũ Thị Phương (Giáo viên)", timestamp: "2026-03-09 08:50" },
  { id: "al13", actor: "Admin", action: "Thêm giao dịch", target: "Lương gia sư Toán 12", timestamp: "2026-03-08 16:15" },
  { id: "al14", actor: "Admin", action: "Cập nhật cài đặt", target: "Bật chế độ bảo trì", timestamp: "2026-03-07 11:30" },
  { id: "al15", actor: "Admin", action: "Tạo lớp học", target: "Hóa 12 - Hữu cơ", timestamp: "2026-03-06 09:45" },
  { id: "al16", actor: "Admin", action: "Từ chối tài khoản", target: "Đỗ Quang Minh (Gia sư)", timestamp: "2026-03-05 13:20" },
  { id: "al17", actor: "Admin", action: "Xóa người dùng", target: "Lý Thị Mai", timestamp: "2026-03-04 10:10" },
  { id: "al18", actor: "Admin", action: "Cập nhật lớp học", target: "Sinh học 12", timestamp: "2026-03-03 14:55" },
  { id: "al19", actor: "Admin", action: "Duyệt tài khoản", target: "Trương Văn Kiên (Học sinh)", timestamp: "2026-03-02 08:30" },
  { id: "al20", actor: "Admin", action: "Thêm giao dịch", target: "Phí thi thử Toán", timestamp: "2026-03-01 15:40" },
];

const seedNotifications: Notification[] = [
  { id: "n1", title: "Tài khoản mới chờ duyệt", message: "Hoàng Đức Em đã đăng ký làm gia sư môn Lý", type: "warning", read: false, timestamp: "2026-02-20 10:00" },
  { id: "n2", title: "Tài khoản mới chờ duyệt", message: "Vũ Thị Phương đã đăng ký làm giáo viên môn Hóa", type: "warning", read: false, timestamp: "2026-02-22 14:30" },
  { id: "n3", title: "Tài khoản mới chờ duyệt", message: "Đỗ Quang Minh đã đăng ký làm gia sư môn Anh", type: "warning", read: false, timestamp: "2026-02-25 09:15" },
  { id: "n4", title: "Giao dịch thành công", message: "Học phí Toán 12 - T3/2026 đã hoàn thành", type: "success", read: false, timestamp: "2026-03-01 08:00" },
  { id: "n5", title: "Lớp học mới tạo", message: "IELTS Writing đang tìm gia sư phù hợp", type: "info", read: true, timestamp: "2026-02-15 16:00" },
  { id: "n6", title: "Giao dịch đang chờ", message: "Lương GV Văn 11 chưa được xử lý", type: "warning", read: true, timestamp: "2026-02-12 11:00" },
  { id: "n7", title: "Bài test mới được tạo", message: "Đề thi thử Hóa 12 đã sẵn sàng", type: "info", read: false, timestamp: "2026-03-05 13:45" },
  { id: "n8", title: "Lớp học hoàn thành", message: "Lý 10 - Cơ bản đã kết thúc", type: "success", read: false, timestamp: "2026-03-10 17:20" },
  { id: "n9", title: "Tài khoản bị từ chối", message: "Bùi Văn Hùng không đủ điều kiện", type: "error", read: true, timestamp: "2026-03-12 09:30" },
  { id: "n10", title: "Giao dịch thất bại", message: "Thanh toán học phí Hóa 12 không thành công", type: "error", read: false, timestamp: "2026-03-15 14:10" },
  { id: "n11", title: "Bài test được cập nhật", message: "IELTS Mock Test 1 đã được chỉnh sửa", type: "info", read: true, timestamp: "2026-03-18 11:25" },
  { id: "n12", title: "Lớp học đang tìm gia sư", message: "Tiếng Anh Giao Tiếp cần gia sư khẩn cấp", type: "warning", read: false, timestamp: "2026-03-20 16:40" },
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
  rejectUser: (id: string, reason?: string) => void;
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

  const rejectUser = useCallback((id: string, reason: string = "Lý do không rõ") => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "rejected" as UserStatus } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditLog("Từ chối tài khoản", `${user.name} (${user.role}) - ${reason}`);
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
