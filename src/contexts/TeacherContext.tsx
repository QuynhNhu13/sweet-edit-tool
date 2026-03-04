import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarFemale2 from "@/assets/avatar-female-2.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";
import avatarFemale4 from "@/assets/avatar-female-4.jpg";
import avatarFemale5 from "@/assets/avatar-female-5.jpg";
import avatarFemale6 from "@/assets/avatar-female-6.jpg";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarMale2 from "@/assets/avatar-male-2.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarMale4 from "@/assets/avatar-male-4.jpg";
import avatarMale5 from "@/assets/avatar-male-5.jpg";
import avatarMale6 from "@/assets/avatar-male-6.jpg";
import tutor3 from "@/assets/tutor-3.jpg";

import type {
  TutorProfile, TutorClass, TutorSession, TrialBooking, WalletTransaction,
  ChatMessage, StudentProgress, TutorReview, TestQuestion, TestResult,
  ClassMaterial, EscrowStatus, SessionStatus, TrialStatus, WalletTxType,
  RefundRequest,
} from "./TutorContext";

// ========== TEACHER SEED DATA ==========

const teacherProfile: TutorProfile = {
  id: "t1",
  name: "Trần Thị Bích Ngọc",
  avatar: tutor3,
  email: "ngoc.tran@school.edu.vn",
  phone: "0978654321",
  subjects: ["Hóa", "Sinh"],
  bio: "Giáo viên Hóa - Sinh tại trường THPT chuyên Lê Hồng Phong với 12 năm kinh nghiệm giảng dạy. Thạc sĩ Hóa học Hữu cơ, ĐH Khoa học Tự nhiên TP.HCM. Từng đào tạo nhiều học sinh đạt giải HSG cấp tỉnh/thành và đỗ các trường Y Dược hàng đầu. Phương pháp giảng dạy kết hợp thí nghiệm thực hành và ứng dụng thực tế.",
  school: "ĐH Khoa học Tự nhiên TP.HCM",
  degree: "Thạc sĩ Hóa học Hữu cơ",
  degreeVerified: true,
  transcriptVerified: true,
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  rating: 4.9,
  totalReviews: 86,
  totalSessions: 580,
  testPassRate: 96,
  hourlyRate: 350000,
  joinDate: "2023-09-01",
  location: "Quận 1, TP.HCM",
  teachingStyle: "Kết hợp lý thuyết với thí nghiệm thực hành. Sử dụng sơ đồ tư duy và bài tập tình huống để học sinh hiểu sâu bản chất vấn đề. Đặc biệt chú trọng rèn kỹ năng tự học và tư duy phản biện.",
  achievements: [
    "Giáo viên Giỏi cấp TP 2024",
    "12 năm kinh nghiệm",
    "HSG Hóa học cấp Quốc gia",
    "500+ buổi dạy hoàn thành",
    "Top 3 Giáo viên được yêu thích",
    "Verified Teacher",
  ],
  availability: [
    { day: "Thứ 2", slots: ["15:30-17:30", "19:00-21:00"] },
    { day: "Thứ 3", slots: ["15:30-17:30"] },
    { day: "Thứ 4", slots: ["15:30-17:30", "19:00-21:00"] },
    { day: "Thứ 5", slots: ["19:00-21:00"] },
    { day: "Thứ 6", slots: ["15:30-17:30"] },
    { day: "Thứ 7", slots: ["8:00-10:00", "10:00-12:00", "14:00-16:00"] },
  ],
  role: "teacher",
  yearsExperience: 12,
  currentSchool: "THPT chuyên Lê Hồng Phong",
  platformFeeRate: 15, // lower than tutor's 20%
};

// Teacher materials
const teacherMaterials: ClassMaterial[] = [
  { id: "tmat1", name: "Giáo trình Hóa 12 - Chương Este & Lipid", type: "pdf", url: "#", uploadedAt: "2026-01-10", size: "3.2 MB" },
  { id: "tmat2", name: "Bộ đề trắc nghiệm Polyme", type: "doc", url: "#", uploadedAt: "2026-01-25", size: "1.5 MB" },
  { id: "tmat3", name: "Video thí nghiệm phản ứng xà phòng hóa", type: "video", url: "#", uploadedAt: "2026-02-01", size: "120 MB" },
  { id: "tmat4", name: "Sơ đồ tư duy Hóa Hữu cơ", type: "image", url: "#", uploadedAt: "2026-02-05", size: "1.8 MB" },
  { id: "tmat5", name: "Bảng tuần hoàn tương tác", type: "link", url: "https://ptable.com", uploadedAt: "2026-02-10" },
  { id: "tmat6", name: "Đề thi thử THPTQG - Hóa 2026", type: "pdf", url: "#", uploadedAt: "2026-02-18", size: "2.1 MB" },
];

const teacherSessions: TutorSession[] = [
  // Class tc1 sessions (Hóa 12)
  { id: "ts1", classId: "tc1", date: "2026-01-13", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:00", content: "Este - Khái niệm và danh pháp", notes: "HS nắm tốt cấu tạo, cần thêm bài tập viết CTCT", homework: "Bài 1-8 trang 6 SGK", parentConfirmed: true, format: "online" },
  { id: "ts2", classId: "tc1", date: "2026-01-15", time: "19:00-21:00", status: "completed", startedAt: "19:02", endedAt: "20:58", content: "Phản ứng thủy phân este", notes: "Hiểu tốt phản ứng xà phòng hóa", homework: "Làm 20 câu trắc nghiệm", rating: 5, ratingComment: "Cô giảng rất sinh động", parentConfirmed: true, format: "online" },
  { id: "ts3", classId: "tc1", date: "2026-01-20", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:05", content: "Lipid - Chất béo", notes: "Liên hệ thực tế tốt", homework: "Bài tập tổng hợp chương 1", parentConfirmed: true, format: "online" },
  { id: "ts4", classId: "tc1", date: "2026-01-22", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:55", content: "Cacbohidrat - Glucozơ", notes: "Cần ôn lại phản ứng tráng bạc", homework: "Bài tập glucozơ", parentConfirmed: true, format: "online" },
  { id: "ts5", classId: "tc1", date: "2026-01-27", time: "19:00-21:00", status: "completed", startedAt: "19:01", endedAt: "21:00", content: "Saccarozơ - Tinh bột - Xenlulozơ", notes: "Nắm khá tốt sự khác biệt", homework: "Sơ đồ tư duy cacbohidrat", rating: 5, ratingComment: "Bài tập rất hay", parentConfirmed: true, format: "online" },
  { id: "ts6", classId: "tc1", date: "2026-01-29", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:50", content: "Amin - Khái niệm cơ bản", notes: "Cần phân biệt rõ bậc amin", homework: "20 câu TN phân loại amin", parentConfirmed: true, format: "online" },
  { id: "ts7", classId: "tc1", date: "2026-02-03", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:00", content: "Amino axit", notes: "Hiểu tính lưỡng tính", homework: "Bài tập amino axit", parentConfirmed: true, format: "online" },
  { id: "ts8", classId: "tc1", date: "2026-02-05", time: "19:00-21:00", status: "completed", startedAt: "19:05", endedAt: "21:00", content: "Peptit và Protein", notes: "Nắm tốt liên kết peptit", homework: "Đề thi thử số 1", rating: 4, ratingComment: "Nội dung hơi nặng", parentConfirmed: true, format: "online" },
  { id: "ts9", classId: "tc1", date: "2026-02-10", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:55", content: "Polyme", notes: "Hiểu phân loại và ứng dụng", homework: "Bảng tổng hợp polyme", parentConfirmed: true, format: "online" },
  { id: "ts10", classId: "tc1", date: "2026-02-12", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:02", content: "Đại cương kim loại", notes: "Chuyển sang Hóa Vô cơ", homework: "Bài tập dãy điện hóa", parentConfirmed: true, format: "online" },
  { id: "ts11", classId: "tc1", date: "2026-02-17", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "20:58", content: "Kim loại kiềm - Kiềm thổ", notes: "Nắm tốt tính chất hóa học", homework: "25 câu TN kim loại", rating: 5, ratingComment: "Rất rõ ràng!", parentConfirmed: true, format: "online" },
  { id: "ts12", classId: "tc1", date: "2026-02-19", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:00", content: "Nhôm và hợp chất", notes: "Phản ứng lưỡng tính - trọng tâm", homework: "Đề thi thử số 2", parentConfirmed: true, format: "online" },
  { id: "ts13", classId: "tc1", date: "2026-02-24", time: "19:00-21:00", status: "completed", startedAt: "19:01", endedAt: "20:55", content: "Sắt và hợp chất", notes: "Cần luyện nhiều bài Fe²⁺/Fe³⁺", homework: "30 câu TN sắt", parentConfirmed: true, format: "online" },
  { id: "ts14", classId: "tc1", date: "2026-02-26", time: "19:00-21:00", status: "completed", startedAt: "19:00", endedAt: "21:00", content: "Chữa đề thi thử 1 & 2", notes: "Đề 1: 7.8đ, Đề 2: 8.2đ - Tiến bộ tốt", rating: 5, ratingComment: "Con đạt 8.2 điểm!", parentConfirmed: true, format: "online" },
  { id: "ts15", classId: "tc1", date: "2026-03-03", time: "19:00-21:00", status: "scheduled", format: "online", meetingLink: "/teacher/meeting/ts15" },
  { id: "ts16", classId: "tc1", date: "2026-03-05", time: "19:00-21:00", status: "scheduled", format: "online", meetingLink: "/teacher/meeting/ts16" },
  // Class tc2 sessions (Sinh 11)
  { id: "ts17", classId: "tc2", date: "2026-02-04", time: "15:30-17:30", status: "completed", startedAt: "15:30", endedAt: "17:30", content: "Quang hợp ở thực vật", notes: "Hiểu 2 pha sáng/tối", homework: "Sơ đồ quang hợp", parentConfirmed: true, format: "offline" },
  { id: "ts18", classId: "tc2", date: "2026-02-11", time: "15:30-17:30", status: "completed", startedAt: "15:35", endedAt: "17:28", content: "Hô hấp tế bào", notes: "So sánh quang hợp vs hô hấp tốt", homework: "Bảng so sánh + 15 câu TN", rating: 5, ratingComment: "Cô dạy dễ hiểu lắm", parentConfirmed: true, format: "offline" },
  { id: "ts19", classId: "tc2", date: "2026-02-18", time: "15:30-17:30", status: "completed", startedAt: "15:30", endedAt: "17:30", content: "Tiêu hóa ở động vật", notes: "Thích phần so sánh hệ tiêu hóa", homework: "Bài tập tiêu hóa", parentConfirmed: true, format: "offline" },
  { id: "ts20", classId: "tc2", date: "2026-02-25", time: "15:30-17:30", status: "completed", startedAt: "15:30", endedAt: "17:25", content: "Hô hấp ở động vật", notes: "Nắm tốt", homework: "Đề kiểm tra chương", rating: 4, ratingComment: "Bài kiểm tra hơi khó", parentConfirmed: true, format: "offline" },
  { id: "ts21", classId: "tc2", date: "2026-03-04", time: "15:30-17:30", status: "scheduled", format: "offline" },
  { id: "ts22", classId: "tc2", date: "2026-03-11", time: "15:30-17:30", status: "scheduled", format: "online", meetingLink: "/teacher/meeting/ts22" },
  // Class tc3 sessions (Hóa 10)
  { id: "ts23", classId: "tc3", date: "2026-02-08", time: "8:00-10:00", status: "completed", startedAt: "8:00", endedAt: "10:00", content: "Bảng tuần hoàn - Quy luật biến đổi", notes: "Cần nhớ xu hướng biến đổi", homework: "Học thuộc 20 nguyên tố đầu", parentConfirmed: true, format: "online" },
  { id: "ts24", classId: "tc3", date: "2026-02-15", time: "8:00-10:00", status: "completed", startedAt: "8:05", endedAt: "9:58", content: "Liên kết hóa học", notes: "Phân biệt liên kết ion/cộng hóa trị", homework: "Bài tập liên kết", rating: 5, ratingComment: "Hiểu bài ngay", parentConfirmed: true, format: "online" },
  { id: "ts25", classId: "tc3", date: "2026-02-22", time: "8:00-10:00", status: "completed", startedAt: "8:00", endedAt: "10:02", content: "Phản ứng oxi hóa khử", notes: "Trọng tâm - cần luyện nhiều", homework: "30 bài cân bằng OXH-K", parentConfirmed: true, format: "online" },
  { id: "ts26", classId: "tc3", date: "2026-03-01", time: "8:00-10:00", status: "completed", startedAt: "8:00", endedAt: "10:00", content: "Nhóm Halogen", notes: "Nắm tốt tính chất F₂, Cl₂, Br₂, I₂", homework: "Đề thi thử HK2", rating: 5, ratingComment: "Con rất thích Hóa", parentConfirmed: true, format: "online" },
  { id: "ts27", classId: "tc3", date: "2026-03-08", time: "8:00-10:00", status: "scheduled", format: "online", meetingLink: "/teacher/meeting/ts27" },
  // Class tc4 sessions (Hóa luyện thi - completed)
  { id: "ts28", classId: "tc4", date: "2025-10-05", time: "10:00-12:00", status: "completed", startedAt: "10:00", endedAt: "12:00", content: "Tổng ôn Hóa Hữu cơ", parentConfirmed: true, format: "offline" },
  // Class tc5 sessions (Sinh 12 nhóm)
  { id: "ts29", classId: "tc5", date: "2026-02-15", time: "14:00-16:00", status: "completed", startedAt: "14:00", endedAt: "16:00", content: "Gen - Mã di truyền", notes: "Nhóm 3 HS, tương tác tốt", homework: "Bài tập mã di truyền", parentConfirmed: true, format: "online" },
  { id: "ts30", classId: "tc5", date: "2026-02-22", time: "14:00-16:00", status: "completed", startedAt: "14:05", endedAt: "16:00", content: "Nhân đôi ADN", notes: "Sử dụng mô hình 3D minh họa", homework: "Sơ đồ nhân đôi + 20 câu TN", rating: 5, ratingComment: "Mô hình rất trực quan!", parentConfirmed: true, format: "online" },
  { id: "ts31", classId: "tc5", date: "2026-03-01", time: "14:00-16:00", status: "completed", startedAt: "14:00", endedAt: "15:55", content: "Phiên mã và dịch mã", notes: "Phân biệt rõ 2 quá trình", homework: "Bài tập tổng hợp protein", parentConfirmed: true, format: "online" },
  { id: "ts32", classId: "tc5", date: "2026-03-08", time: "14:00-16:00", status: "scheduled", format: "online", meetingLink: "/teacher/meeting/ts32" },
];

const teacherClasses: TutorClass[] = [
  {
    id: "tc1", name: "Hóa 12 - Ôn thi THPTQG", subject: "Hóa",
    studentId: "tu3", studentName: "Phan Thanh Tùng", studentAvatar: avatarMale3,
    parentName: "Phan Thị Hoa", format: "online", fee: 2800000,
    totalSessions: 30, completedSessions: 14,
    escrowStatus: "in_progress", escrowAmount: 2800000, escrowReleased: 1120000, releaseMilestone: 4,
    schedule: "T2, T4 - 19:00-21:00", createdAt: "2026-01-05",
    sessions: teacherSessions.filter(s => s.classId === "tc1"),
    materials: teacherMaterials,
    monthlyFee: 2800000,
  },
  {
    id: "tc2", name: "Sinh 11 - Nâng cao", subject: "Sinh",
    studentId: "tu5", studentName: "Lê Thị Phương Anh", studentAvatar: avatarFemale3,
    parentName: "Lê Văn Dũng", format: "offline", fee: 2000000,
    totalSessions: 20, completedSessions: 4,
    escrowStatus: "in_progress", escrowAmount: 2000000, escrowReleased: 0, releaseMilestone: 5,
    schedule: "T3 - 15:30-17:30", createdAt: "2026-01-28",
    sessions: teacherSessions.filter(s => s.classId === "tc2"),
    materials: [teacherMaterials[0], teacherMaterials[3]],
    monthlyFee: 2000000,
  },
  {
    id: "tc3", name: "Hóa 10 - Cơ bản", subject: "Hóa",
    studentId: "tu7", studentName: "Nguyễn Hoàng Nam", studentAvatar: avatarMale5,
    parentName: "Nguyễn Thị Yến", format: "online", fee: 1600000,
    totalSessions: 16, completedSessions: 4,
    escrowStatus: "in_progress", escrowAmount: 1600000, escrowReleased: 0, releaseMilestone: 4,
    schedule: "T7 - 8:00-10:00", createdAt: "2026-02-01",
    sessions: teacherSessions.filter(s => s.classId === "tc3"),
    materials: [teacherMaterials[4]],
    monthlyFee: 1600000,
  },
  {
    id: "tc4", name: "Hóa - Luyện thi chuyên", subject: "Hóa",
    studentId: "tu8", studentName: "Đỗ Quang Huy", studentAvatar: avatarMale6,
    parentName: "Đỗ Thị Lan", format: "offline", fee: 3500000,
    totalSessions: 24, completedSessions: 24,
    escrowStatus: "completed", escrowAmount: 3500000, escrowReleased: 3500000, releaseMilestone: 4,
    schedule: "T7 - 10:00-12:00", createdAt: "2025-09-15",
    sessions: teacherSessions.filter(s => s.classId === "tc4"),
    materials: [],
    monthlyFee: 3500000,
  },
  {
    id: "tc5", name: "Sinh 12 - Nhóm 3 HS", subject: "Sinh",
    studentId: "tu9", studentName: "Võ Minh Thư", studentAvatar: avatarFemale6,
    parentName: "Võ Văn Tâm", format: "online", fee: 1800000,
    totalSessions: 16, completedSessions: 3,
    escrowStatus: "in_progress", escrowAmount: 1800000, escrowReleased: 0, releaseMilestone: 4,
    schedule: "T7 - 14:00-16:00", createdAt: "2026-02-10",
    sessions: teacherSessions.filter(s => s.classId === "tc5"),
    materials: [teacherMaterials[3], teacherMaterials[5]],
    monthlyFee: 1800000,
  },
];

const teacherTrials: TrialBooking[] = [
  { id: "ttr1", parentName: "Hoàng Thị Thanh", parentAvatar: avatarFemale1, parentPhone: "0911222333", parentEmail: "thanh.hoang@email.com", studentName: "Hoàng Minh Đức", studentGrade: "Lớp 12", subject: "Hóa", requestedDate: "2026-03-06", requestedTime: "19:00-20:00", status: "pending", note: "Con yếu Hóa Hữu cơ, cần ôn thi gấp", goals: "Đạt 8+ THPTQG", currentLevel: "Trung bình khá (6 điểm)" },
  { id: "ttr2", parentName: "Bùi Văn Quang", parentAvatar: avatarMale4, parentPhone: "0922333444", parentEmail: "quang.bui@email.com", studentName: "Bùi Thị Hạ", studentGrade: "Lớp 11", subject: "Sinh", requestedDate: "2026-03-07", requestedTime: "15:30-16:30", status: "confirmed", note: "Con muốn thi HSG Sinh cấp TP", goals: "Đạt giải HSG cấp TP", currentLevel: "Khá giỏi (8 điểm)" },
  { id: "ttr3", parentName: "Phan Thị Hoa", parentAvatar: avatarFemale2, parentPhone: "0933444555", parentEmail: "hoa.phan@email.com", studentName: "Phan Thanh Tùng", studentGrade: "Lớp 12", subject: "Hóa", requestedDate: "2026-01-02", requestedTime: "19:00-20:00", status: "completed", feedback: "Cô giảng rất hay, con hiểu ngay từ buổi đầu", rating: 5, note: "Ôn thi đại học", goals: "Đỗ ĐH Y Dược", currentLevel: "Khá (7 điểm)" },
  { id: "ttr4", parentName: "Lâm Thị Hương", parentAvatar: avatarFemale5, parentPhone: "0944555666", parentEmail: "huong.lam@email.com", studentName: "Lâm Gia Bảo", studentGrade: "Lớp 10", subject: "Hóa", requestedDate: "2026-03-10", requestedTime: "8:00-9:00", status: "pending", note: "Mới vào lớp 10, cần xây nền tảng Hóa", goals: "Hiểu bản chất, đạt 7+", currentLevel: "Trung bình (5.5 điểm)" },
  { id: "ttr5", parentName: "Trịnh Văn Nam", parentAvatar: avatarMale1, parentPhone: "0955666777", parentEmail: "nam.trinh@email.com", studentName: "Trịnh Thúy Kiều", studentGrade: "Lớp 12", subject: "Sinh", requestedDate: "2026-02-18", requestedTime: "14:00-15:00", status: "rejected", note: "Cần gia sư dạy Sinh tại nhà", goals: "Ôn thi ĐH", currentLevel: "Khá", rejectionReason: "Xin lỗi phụ huynh, hiện lịch dạy offline của tôi vào khung giờ này đã kín. Phụ huynh có thể cân nhắc hình thức online không ạ?" },
  { id: "ttr6", parentName: "Đinh Thị Mai", parentAvatar: avatarFemale4, parentPhone: "0966777888", parentEmail: "mai.dinh@email.com", studentName: "Đinh Hoàng Sơn", studentGrade: "Lớp 11", subject: "Hóa", requestedDate: "2026-03-12", requestedTime: "19:00-20:00", status: "pending", note: "Con muốn học thêm Hóa để chuẩn bị cho năm 12", goals: "Nắm vững kiến thức lớp 11", currentLevel: "Trung bình (5-6 điểm)" },
];

const teacherWallet: WalletTransaction[] = [
  { id: "tw1", type: "escrow_in", amount: 2800000, date: "2026-01-05", description: "Escrow nhận lớp Hóa 12 - Ôn thi THPTQG", classId: "tc1", status: "completed" },
  { id: "tw2", type: "escrow_release", amount: 560000, date: "2026-01-29", description: "Giải ngân đợt 1 - Hóa 12 (4 buổi)", classId: "tc1", status: "completed" },
  { id: "tw3", type: "escrow_release", amount: 560000, date: "2026-02-12", description: "Giải ngân đợt 2 - Hóa 12 (8 buổi)", classId: "tc1", status: "completed" },
  { id: "tw4", type: "platform_fee", amount: -168000, date: "2026-02-12", description: "Phí nền tảng 15% đợt giải ngân 1+2", status: "completed" },
  { id: "tw5", type: "escrow_in", amount: 2000000, date: "2026-01-28", description: "Escrow nhận lớp Sinh 11", classId: "tc2", status: "completed" },
  { id: "tw6", type: "escrow_in", amount: 1600000, date: "2026-02-01", description: "Escrow nhận lớp Hóa 10", classId: "tc3", status: "completed" },
  { id: "tw7", type: "escrow_in", amount: 3500000, date: "2025-09-15", description: "Escrow nhận lớp Hóa Luyện thi chuyên", classId: "tc4", status: "completed" },
  { id: "tw8", type: "escrow_release", amount: 3500000, date: "2025-12-20", description: "Giải ngân toàn bộ - Hóa Luyện thi chuyên (hoàn thành)", classId: "tc4", status: "completed" },
  { id: "tw9", type: "platform_fee", amount: -525000, date: "2025-12-20", description: "Phí nền tảng 15% - Hóa Luyện thi chuyên", status: "completed" },
  { id: "tw10", type: "withdrawal", amount: -2000000, date: "2026-01-05", description: "Rút tiền về Techcombank ****5678", status: "completed", paymentMethod: "Techcombank" },
  { id: "tw11", type: "deposit", amount: 300000, date: "2026-02-20", description: "Nạp tiền từ VNPay", status: "completed", paymentMethod: "VNPay" },
  { id: "tw12", type: "escrow_release", amount: 560000, date: "2026-02-26", description: "Giải ngân đợt 3 - Hóa 12 (12 buổi)", classId: "tc1", status: "completed" },
  { id: "tw13", type: "platform_fee", amount: -84000, date: "2026-02-26", description: "Phí nền tảng 15% đợt giải ngân 3", status: "completed" },
  { id: "tw14", type: "escrow_in", amount: 1800000, date: "2026-02-10", description: "Escrow nhận lớp Sinh 12 - Nhóm", classId: "tc5", status: "completed" },
  { id: "tw15", type: "withdrawal", amount: -1000000, date: "2026-02-28", description: "Rút tiền về MoMo ****9012", status: "completed", paymentMethod: "MoMo" },
];

const teacherChat: ChatMessage[] = [
  { id: "tm1", classId: "tc1", sender: "parent", senderName: "Phan Thị Hoa", message: "Cô ơi, tuần này con thi thử được mấy điểm ạ?", timestamp: "2026-02-26 20:30", read: true },
  { id: "tm2", classId: "tc1", sender: "tutor", senderName: "Trần Thị Bích Ngọc", message: "Dạ chào chị, đề 1 cháu được 7.8đ, đề 2 được 8.2đ - tiến bộ rõ rệt ạ!", timestamp: "2026-02-26 20:35", read: true },
  { id: "tm3", classId: "tc1", sender: "parent", senderName: "Phan Thị Hoa", message: "Vậy là tốt rồi cô! Cảm ơn cô nhiều ạ 🎉", timestamp: "2026-02-26 20:38", read: true },
  { id: "tm4", classId: "tc1", sender: "student", senderName: "Phan Thanh Tùng", message: "Cô ơi em chưa hiểu bài Fe²⁺/Fe³⁺ lắm ạ", timestamp: "2026-02-27 16:20", read: false },
  { id: "tm5", classId: "tc2", sender: "student", senderName: "Lê Thị Phương Anh", message: "Cô ơi tuần sau mình học chủ đề gì ạ?", timestamp: "2026-02-28 09:00", read: false },
  { id: "tm6", classId: "tc2", sender: "parent", senderName: "Lê Văn Dũng", message: "Cô cho con thêm bài tập về nhà được không ạ?", timestamp: "2026-02-28 19:15", read: false },
  { id: "tm7", classId: "tc3", sender: "parent", senderName: "Nguyễn Thị Yến", message: "Cô ơi con nói con rất thích học Hóa với cô!", timestamp: "2026-03-01 10:00", read: false },
  { id: "tm8", classId: "tc3", sender: "student", senderName: "Nguyễn Hoàng Nam", message: "Cô ơi em làm xong bài tập rồi ạ, nộp qua đâu ạ?", timestamp: "2026-03-01 14:30", read: false },
  { id: "tm9", classId: "tc5", sender: "student", senderName: "Võ Minh Thư", message: "Cô ơi bài phiên mã khó quá ạ 😭", timestamp: "2026-03-01 20:00", read: false },
  { id: "tm10", classId: "tc5", sender: "parent", senderName: "Võ Văn Tâm", message: "Cô ơi 3 bạn nhóm có hợp nhau không ạ?", timestamp: "2026-03-02 08:30", read: false },
];

const teacherStudentProgress: StudentProgress[] = [
  {
    studentId: "tu3", studentName: "Phan Thanh Tùng", studentAvatar: avatarMale3,
    studentPhone: "0971111222", studentEmail: "tung.phan@email.com", studentGrade: "Lớp 12",
    parentName: "Phan Thị Hoa", parentPhone: "0933444555",
    classId: "tc1", className: "Hóa 12 - Ôn thi THPTQG", subject: "Hóa",
    totalSessions: 30, completedSessions: 14, missedSessions: 0,
    averageScore: 7.8, attendanceRate: 100, goalCompletion: 72,
    startDate: "2026-01-05", lastSessionDate: "2026-02-26",
    homeworkCompletion: 95, notes: "Học sinh rất chăm chỉ và ham học. Mạnh Hóa Hữu cơ, cần cải thiện Hóa Vô cơ phần sắt. Mục tiêu đỗ ĐH Y Dược.",
    skills: [
      { name: "Hữu cơ", score: 8.5, prevScore: 6.0 },
      { name: "Vô cơ", score: 7.0, prevScore: 5.0 },
      { name: "Điện hóa", score: 7.5, prevScore: 5.5 },
      { name: "Hóa phân tích", score: 8.0, prevScore: 6.5 },
      { name: "Tính toán", score: 7.8, prevScore: 5.8 },
    ],
    weeklyReports: [
      { week: "T1/2026 - Tuần 1-2", sessions: 4, avgScore: 6.5, notes: "Ôn Este, Lipid - nắm cơ bản" },
      { week: "T1/2026 - Tuần 3-4", sessions: 4, avgScore: 7.2, notes: "Cacbohidrat, Amin - tiến bộ" },
      { week: "T2/2026 - Tuần 1-2", sessions: 4, avgScore: 7.5, notes: "Amino axit, Protein - hiểu sâu" },
      { week: "T2/2026 - Tuần 3-4", sessions: 4, avgScore: 8.0, notes: "Kim loại - đang cải thiện" },
    ],
    scoreHistory: [
      { date: "2026-01-15", score: 6.0 }, { date: "2026-01-22", score: 6.5 },
      { date: "2026-01-29", score: 7.0 }, { date: "2026-02-05", score: 7.2 },
      { date: "2026-02-12", score: 7.5 }, { date: "2026-02-19", score: 7.8 },
      { date: "2026-02-26", score: 8.2 },
    ],
  },
  {
    studentId: "tu5", studentName: "Lê Thị Phương Anh", studentAvatar: avatarFemale3,
    studentPhone: "0972222333", studentEmail: "phuonganh.le@email.com", studentGrade: "Lớp 11",
    parentName: "Lê Văn Dũng", parentPhone: "0944555666",
    classId: "tc2", className: "Sinh 11 - Nâng cao", subject: "Sinh",
    totalSessions: 20, completedSessions: 4, missedSessions: 0,
    averageScore: 7.5, attendanceRate: 100, goalCompletion: 25,
    startDate: "2026-01-28", lastSessionDate: "2026-02-25",
    homeworkCompletion: 90, notes: "Học sinh có tố chất tốt, đam mê Sinh học. Hướng thi HSG cấp TP.",
    skills: [
      { name: "Trao đổi chất", score: 8.0, prevScore: 6.5 },
      { name: "Sinh lý TV", score: 7.5, prevScore: 6.0 },
      { name: "Sinh lý ĐV", score: 7.0, prevScore: 6.0 },
      { name: "Di truyền", score: 7.5, prevScore: 7.0 },
    ],
    weeklyReports: [
      { week: "T2/2026 - Tuần 1", sessions: 1, avgScore: 7.0, notes: "Quang hợp - nắm tốt" },
      { week: "T2/2026 - Tuần 2", sessions: 1, avgScore: 7.5, notes: "Hô hấp - so sánh tốt" },
      { week: "T2/2026 - Tuần 3", sessions: 1, avgScore: 7.5, notes: "Tiêu hóa - thích thú" },
      { week: "T2/2026 - Tuần 4", sessions: 1, avgScore: 8.0, notes: "Hô hấp ĐV - tiến bộ" },
    ],
    scoreHistory: [
      { date: "2026-02-04", score: 7.0 }, { date: "2026-02-11", score: 7.5 },
      { date: "2026-02-18", score: 7.5 }, { date: "2026-02-25", score: 8.0 },
    ],
  },
  {
    studentId: "tu7", studentName: "Nguyễn Hoàng Nam", studentAvatar: avatarMale5,
    studentPhone: "0973333444", studentEmail: "nam.nguyen@email.com", studentGrade: "Lớp 10",
    parentName: "Nguyễn Thị Yến", parentPhone: "0955666777",
    classId: "tc3", className: "Hóa 10 - Cơ bản", subject: "Hóa",
    totalSessions: 16, completedSessions: 4, missedSessions: 0,
    averageScore: 7.2, attendanceRate: 100, goalCompletion: 30,
    startDate: "2026-02-01", lastSessionDate: "2026-03-01",
    homeworkCompletion: 88, notes: "Học sinh năng động, thích thí nghiệm. Cần rèn thêm tính cẩn thận khi tính toán.",
    skills: [
      { name: "Bảng tuần hoàn", score: 7.5, prevScore: 5.0 },
      { name: "Liên kết HH", score: 7.0, prevScore: 5.5 },
      { name: "OXH-K", score: 7.0, prevScore: 4.5 },
      { name: "Halogen", score: 7.5, prevScore: 5.0 },
    ],
    weeklyReports: [
      { week: "T2/2026 - Tuần 2", sessions: 1, avgScore: 6.5, notes: "Bảng tuần hoàn" },
      { week: "T2/2026 - Tuần 3", sessions: 1, avgScore: 7.0, notes: "Liên kết hóa học" },
      { week: "T2/2026 - Tuần 4", sessions: 1, avgScore: 7.0, notes: "OXH-K" },
      { week: "T3/2026 - Tuần 1", sessions: 1, avgScore: 7.5, notes: "Halogen - rất hào hứng" },
    ],
    scoreHistory: [
      { date: "2026-02-08", score: 6.5 }, { date: "2026-02-15", score: 7.0 },
      { date: "2026-02-22", score: 7.0 }, { date: "2026-03-01", score: 7.5 },
    ],
  },
  {
    studentId: "tu8", studentName: "Đỗ Quang Huy", studentAvatar: avatarMale6,
    studentPhone: "0974444555", studentEmail: "huy.do@email.com", studentGrade: "Lớp 9 → 10",
    parentName: "Đỗ Thị Lan", parentPhone: "0966777888",
    classId: "tc4", className: "Hóa - Luyện thi chuyên", subject: "Hóa",
    totalSessions: 24, completedSessions: 24, missedSessions: 1,
    averageScore: 9.0, attendanceRate: 96, goalCompletion: 100,
    startDate: "2025-09-15", lastSessionDate: "2025-12-20",
    homeworkCompletion: 98, notes: "Hoàn thành xuất sắc. Đỗ vào lớp Hóa chuyên Lê Hồng Phong. Học sinh giỏi, tự giác.",
    skills: [
      { name: "Vô cơ", score: 9.5, prevScore: 7.0 },
      { name: "Hữu cơ", score: 8.5, prevScore: 6.0 },
      { name: "Tính toán HH", score: 9.0, prevScore: 6.5 },
      { name: "Thí nghiệm", score: 9.0, prevScore: 7.5 },
    ],
    weeklyReports: [
      { week: "T9-10/2025", sessions: 8, avgScore: 7.5, notes: "Ôn nền tảng" },
      { week: "T11/2025", sessions: 8, avgScore: 8.5, notes: "Nâng cao - giải đề chuyên" },
      { week: "T12/2025", sessions: 8, avgScore: 9.0, notes: "Thi đỗ chuyên!" },
    ],
    scoreHistory: [
      { date: "2025-09-30", score: 7.0 }, { date: "2025-10-15", score: 7.5 },
      { date: "2025-10-31", score: 8.0 }, { date: "2025-11-15", score: 8.5 },
      { date: "2025-11-30", score: 8.8 }, { date: "2025-12-15", score: 9.0 },
      { date: "2025-12-20", score: 9.2 },
    ],
  },
  {
    studentId: "tu9", studentName: "Võ Minh Thư", studentAvatar: avatarFemale6,
    studentPhone: "0975555666", studentEmail: "thu.vo@email.com", studentGrade: "Lớp 12",
    parentName: "Võ Văn Tâm", parentPhone: "0977888999",
    classId: "tc5", className: "Sinh 12 - Nhóm 3 HS", subject: "Sinh",
    totalSessions: 16, completedSessions: 3, missedSessions: 0,
    averageScore: 7.0, attendanceRate: 100, goalCompletion: 20,
    startDate: "2026-02-10", lastSessionDate: "2026-03-01",
    homeworkCompletion: 80, notes: "Nhóm 3 học sinh, tương tác tốt. Minh Thư là đại diện liên lạc. Cần luyện thêm phần di truyền phân tử.",
    skills: [
      { name: "Di truyền PT", score: 6.5, prevScore: 5.0 },
      { name: "Di truyền QL", score: 7.0, prevScore: 6.0 },
      { name: "Tiến hóa", score: 7.0, prevScore: 7.0 },
      { name: "Sinh thái", score: 7.5, prevScore: 7.5 },
    ],
    weeklyReports: [
      { week: "T2/2026 - Tuần 3", sessions: 1, avgScore: 6.5, notes: "Gen, mã di truyền" },
      { week: "T2/2026 - Tuần 4", sessions: 1, avgScore: 7.0, notes: "Nhân đôi ADN" },
      { week: "T3/2026 - Tuần 1", sessions: 1, avgScore: 7.5, notes: "Phiên mã, dịch mã" },
    ],
    scoreHistory: [
      { date: "2026-02-15", score: 6.5 }, { date: "2026-02-22", score: 7.0 }, { date: "2026-03-01", score: 7.5 },
    ],
  },
];

const teacherReviews: TutorReview[] = [
  { id: "tr1", classId: "tc1", className: "Hóa 12 - Ôn thi THPTQG", studentName: "Phan Thanh Tùng", parentName: "Phan Thị Hoa", rating: 5, comment: "Cô Ngọc giảng rất sâu và dễ hiểu. Con tiến bộ từ 6 lên 8.2 điểm chỉ sau 2 tháng!", date: "2026-02-26", avatar: avatarFemale2, subject: "Hóa", tags: ["Tận tâm", "Dễ hiểu", "Kinh nghiệm"] },
  { id: "tr2", classId: "tc4", className: "Hóa - Luyện thi chuyên", studentName: "Đỗ Quang Huy", parentName: "Đỗ Thị Lan", rating: 5, comment: "Nhờ cô mà con đỗ chuyên Hóa Lê Hồng Phong! Gia đình rất biết ơn.", date: "2025-12-25", avatar: avatarFemale4, subject: "Hóa", tags: ["Xuất sắc", "Chuyên nghiệp", "Đỗ chuyên"] },
  { id: "tr3", classId: "tc1", className: "Hóa 12 - Ôn thi THPTQG", studentName: "Phan Thanh Tùng", parentName: "Phan Thị Hoa", rating: 5, comment: "Đề thi thử con được 8.2 điểm, vượt kỳ vọng!", date: "2026-02-28", avatar: avatarFemale2, subject: "Hóa", tags: ["Hiệu quả", "Hài lòng"] },
  { id: "tr4", classId: "tc2", className: "Sinh 11 - Nâng cao", studentName: "Lê Thị Phương Anh", parentName: "Lê Văn Dũng", rating: 5, comment: "Cô dạy Sinh rất sinh động, con rất thích. Mong cô tiếp tục đồng hành.", date: "2026-02-20", avatar: avatarMale5, subject: "Sinh", tags: ["Sinh động", "Hấp dẫn", "Tận tâm"] },
  { id: "tr5", classId: "tc2", className: "Sinh 11 - Nâng cao", studentName: "Lê Thị Phương Anh", parentName: "Lê Văn Dũng", rating: 4, comment: "Bài kiểm tra hơi khó so với trình độ con, nhưng cô có giải thích lại kỹ.", date: "2026-02-25", avatar: avatarMale5, subject: "Sinh", tags: ["Bài khó", "Giải thích kỹ"] },
  { id: "tr6", classId: "tc3", className: "Hóa 10 - Cơ bản", studentName: "Nguyễn Hoàng Nam", parentName: "Nguyễn Thị Yến", rating: 5, comment: "Con nói rất thích học Hóa với cô! Từ sợ Hóa giờ thành thích Hóa.", date: "2026-03-01", avatar: avatarFemale1, subject: "Hóa", tags: ["Truyền cảm hứng", "Vui vẻ", "Yêu thích"] },
  { id: "tr7", classId: "tc4", className: "Hóa - Luyện thi chuyên", studentName: "Đỗ Quang Huy", parentName: "Đỗ Thị Lan", rating: 5, comment: "Phương pháp giảng dạy cô rất bài bản và chuyên nghiệp. Xứng đáng giáo viên giỏi!", date: "2025-11-15", avatar: avatarFemale4, subject: "Hóa", tags: ["Bài bản", "Chuyên nghiệp"] },
  { id: "tr8", classId: "tc5", className: "Sinh 12 - Nhóm 3 HS", studentName: "Võ Minh Thư", parentName: "Võ Văn Tâm", rating: 5, comment: "Dạy nhóm mà cô vẫn quan tâm từng bạn, rất tốt!", date: "2026-02-22", avatar: avatarFemale6, subject: "Sinh", tags: ["Quan tâm", "Nhóm nhỏ"] },
  { id: "tr9", classId: "tc1", className: "Hóa 12 - Ôn thi THPTQG", studentName: "Phan Thanh Tùng", parentName: "Phan Thị Hoa", rating: 4, comment: "Buổi này nội dung hơi nặng, con cần thêm thời gian tiêu hóa.", date: "2026-02-05", avatar: avatarFemale2, subject: "Hóa", tags: ["Nội dung nặng"] },
  { id: "tr10", classId: "tc3", className: "Hóa 10 - Cơ bản", studentName: "Nguyễn Hoàng Nam", parentName: "Nguyễn Thị Yến", rating: 5, comment: "Bài OXH-K cô giải thích bằng thí nghiệm ảo rất hay!", date: "2026-02-22", avatar: avatarFemale1, subject: "Hóa", tags: ["Thí nghiệm", "Sáng tạo"] },
];

const teacherTestQuestions: TestQuestion[] = [
  // Hóa questions
  { id: "ttq1", subject: "Hóa", question: "Este CH₃COOC₂H₅ có tên gọi là:", options: ["Metyl axetat", "Etyl axetat", "Etyl fomat", "Metyl propionat"], correctAnswer: 1, explanation: "CH₃COO- (axetat) + C₂H₅- (etyl) → Etyl axetat" },
  { id: "ttq2", subject: "Hóa", question: "Phản ứng xà phòng hóa tạo ra:", options: ["Este + Nước", "Axit + Ancol", "Muối + Glixerol", "Andehit + CO₂"], correctAnswer: 2, explanation: "Xà phòng hóa chất béo → Muối axit béo (xà phòng) + Glixerol" },
  { id: "ttq3", subject: "Hóa", question: "Glucozơ có CTPT là:", options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "C₆H₁₀O₅", "(C₆H₁₀O₅)n"], correctAnswer: 0, explanation: "Glucozơ là C₆H₁₂O₆" },
  { id: "ttq4", subject: "Hóa", question: "Amin nào sau đây là amin bậc 2?", options: ["CH₃NH₂", "(CH₃)₂NH", "(CH₃)₃N", "C₂H₅NH₂"], correctAnswer: 1, explanation: "(CH₃)₂NH có 2 gốc hidrocacbon → bậc 2" },
  { id: "ttq5", subject: "Hóa", question: "Amino axit có tính chất gì đặc biệt?", options: ["Chỉ tính axit", "Chỉ tính bazơ", "Tính lưỡng tính", "Trung tính"], correctAnswer: 2, explanation: "Amino axit có cả nhóm -NH₂ (bazơ) và -COOH (axit)" },
  { id: "ttq6", subject: "Hóa", question: "Polime nào sau đây thuộc loại polime thiên nhiên?", options: ["PE", "PVC", "Xenlulozơ", "PS"], correctAnswer: 2, explanation: "Xenlulozơ có trong thực vật" },
  { id: "ttq7", subject: "Hóa", question: "Kim loại nào phản ứng với nước ở nhiệt độ thường?", options: ["Fe", "Cu", "Na", "Al"], correctAnswer: 2, explanation: "Na (kim loại kiềm) phản ứng mạnh với nước" },
  { id: "ttq8", subject: "Hóa", question: "Al₂O₃ thuộc loại oxit gì?", options: ["Oxit axit", "Oxit bazơ", "Oxit lưỡng tính", "Oxit trung tính"], correctAnswer: 2, explanation: "Al₂O₃ phản ứng được cả axit và bazơ → lưỡng tính" },
  { id: "ttq9", subject: "Hóa", question: "Số oxi hóa của Fe trong Fe₂O₃ là:", options: ["+1", "+2", "+3", "0"], correctAnswer: 2, explanation: "Fe₂O₃: 2x + 3(-2) = 0 → x = +3" },
  { id: "ttq10", subject: "Hóa", question: "Chất nào sau đây là chất điện li mạnh?", options: ["CH₃COOH", "H₂O", "NaCl", "C₂H₅OH"], correctAnswer: 2, explanation: "NaCl là muối → điện li hoàn toàn" },
  // Sinh questions
  { id: "ttq11", subject: "Sinh", question: "Quang hợp xảy ra chủ yếu ở đâu?", options: ["Ti thể", "Lục lạp", "Ribosome", "Nhân tế bào"], correctAnswer: 1, explanation: "Quang hợp xảy ra ở lục lạp" },
  { id: "ttq12", subject: "Sinh", question: "Pha sáng trong quang hợp tạo ra:", options: ["CO₂ và O₂", "ATP và NADPH", "Glucozơ", "Protein"], correctAnswer: 1, explanation: "Pha sáng → ATP + NADPH + O₂" },
  { id: "ttq13", subject: "Sinh", question: "Hô hấp tế bào xảy ra ở đâu?", options: ["Lục lạp", "Nhân", "Ti thể", "Lưới nội chất"], correctAnswer: 2, explanation: "Hô hấp hiếu khí chủ yếu ở ti thể" },
  { id: "ttq14", subject: "Sinh", question: "ADN được nhân đôi theo nguyên tắc:", options: ["Bổ sung", "Bán bảo toàn", "Bổ sung và bán bảo toàn", "Ngẫu nhiên"], correctAnswer: 2, explanation: "ADN nhân đôi theo nguyên tắc bổ sung (A-T, G-X) và bán bảo toàn" },
  { id: "ttq15", subject: "Sinh", question: "Mã di truyền có tính chất:", options: ["Thoái hóa", "Phổ biến", "Đặc hiệu", "Tất cả đáp án trên"], correctAnswer: 3, explanation: "Mã di truyền có tính thoái hóa, phổ biến và đặc hiệu" },
  { id: "ttq16", subject: "Sinh", question: "Phiên mã là quá trình tổng hợp:", options: ["ADN", "mARN", "Protein", "Ribosome"], correctAnswer: 1, explanation: "Phiên mã: ADN → mARN" },
  { id: "ttq17", subject: "Sinh", question: "Dịch mã xảy ra ở đâu?", options: ["Nhân", "Ti thể", "Ribosome", "Lục lạp"], correctAnswer: 2, explanation: "Dịch mã (tổng hợp protein) xảy ra ở ribosome" },
  { id: "ttq18", subject: "Sinh", question: "Đột biến gen là:", options: ["Thay đổi NST", "Thay đổi trình tự nucleotit", "Thay đổi kiểu hình", "Thay đổi môi trường"], correctAnswer: 1, explanation: "Đột biến gen là biến đổi trình tự các nucleotit trong gen" },
  { id: "ttq19", subject: "Sinh", question: "Quy luật phân li của Mendel áp dụng cho:", options: ["1 cặp tính trạng", "2 cặp tính trạng", "3 cặp", "Nhiều cặp"], correctAnswer: 0, explanation: "Quy luật phân li nghiên cứu 1 cặp tính trạng" },
  { id: "ttq20", subject: "Sinh", question: "Sinh vật nào sau đây là sinh vật tự dưỡng?", options: ["Nấm", "Thực vật", "Động vật", "Vi khuẩn E.coli"], correctAnswer: 1, explanation: "Thực vật quang hợp → tự dưỡng" },
];

const teacherTestResults: TestResult[] = [
  {
    id: "ttr_r1", seekingId: "tseek_old1", subject: "Hóa", score: 100, passed: true,
    answers: { ttq1: 1, ttq2: 2, ttq3: 0, ttq4: 1, ttq5: 2, ttq6: 2, ttq7: 2, ttq8: 2, ttq9: 2, ttq10: 2 },
    date: "2023-09-01",
    questions: teacherTestQuestions.filter(q => q.subject === "Hóa").slice(0, 10),
  },
  {
    id: "ttr_r2", seekingId: "tseek_old2", subject: "Sinh", score: 90, passed: true,
    answers: { ttq11: 1, ttq12: 1, ttq13: 2, ttq14: 2, ttq15: 3, ttq16: 1, ttq17: 2, ttq18: 1, ttq19: 0, ttq20: 1 },
    date: "2023-09-05",
    questions: teacherTestQuestions.filter(q => q.subject === "Sinh").slice(0, 10),
  },
];

// ========== CONTEXT ==========

interface TeacherContextType {
  profile: TutorProfile;
  classes: TutorClass[];
  trials: TrialBooking[];
  wallet: WalletTransaction[];
  chatMessages: ChatMessage[];
  studentProgress: StudentProgress[];
  reviews: TutorReview[];
  refundRequests: RefundRequest[];
  testQuestions: TestQuestion[];
  testResults: TestResult[];
  walletBalance: number;
  escrowBalance: number;
  updateProfile: (data: Partial<TutorProfile>) => void;
  confirmTrial: (id: string) => void;
  rejectTrial: (id: string, reason?: string) => void;
  startSession: (sessionId: string, classId: string) => void;
  endSession: (sessionId: string, classId: string, content: string, notes: string, homework: string, files?: string[]) => void;
  confirmSessionByParent: (sessionId: string, classId: string) => void;
  requestAbsence: (sessionId: string, classId: string, reason: string, requestedBy: "tutor" | "student") => void;
  sendMessage: (classId: string, message: string) => void;
  markMessagesRead: (classId: string) => void;
  requestRefund: (classId: string, reason: string, amount: number) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  requestDeposit: (amount: number, method: string) => void;
  updateAvailability: (availability: TutorProfile["availability"]) => void;
  addTestResult: (result: TestResult) => void;
  addMaterial: (classId: string, material: ClassMaterial) => void;
  removeMaterial: (classId: string, materialId: string) => void;
}

const TeacherContext = createContext<TeacherContextType | null>(null);

export const useTeacher = () => {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error("useTeacher must be used within TeacherProvider");
  return ctx;
};

let nextTeacherId = 8000;
const genTeacherId = (prefix: string) => `${prefix}${++nextTeacherId}`;

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<TutorProfile>(teacherProfile);
  const [classes, setClasses] = useState<TutorClass[]>(teacherClasses);
  const [trials, setTrials] = useState<TrialBooking[]>(teacherTrials);
  const [wallet, setWallet] = useState<WalletTransaction[]>(teacherWallet);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(teacherChat);
  const [studentProgress] = useState<StudentProgress[]>(teacherStudentProgress);
  const [reviews] = useState<TutorReview[]>(teacherReviews);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>(teacherTestResults);

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

  const rejectTrial = useCallback((id: string, reason?: string) => {
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" as TrialStatus, rejectionReason: reason || "Không có lý do cụ thể" } : t));
  }, []);

  const startSession = useCallback((sessionId: string, classId: string) => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, sessions: c.sessions.map(s => s.id === sessionId ? { ...s, status: "in_progress" as SessionStatus, startedAt: now } : s) };
    }));
  }, []);

  const endSession = useCallback((sessionId: string, classId: string, content: string, notes: string, homework: string, files?: string[]) => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, sessions: c.sessions.map(s => s.id === sessionId ? { ...s, status: "pending_confirm" as SessionStatus, endedAt: now, content, notes, homework, homeworkFiles: files } : s) };
    }));
  }, []);

  const confirmSessionByParent = useCallback((sessionId: string, classId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      const updatedSessions = c.sessions.map(s => s.id === sessionId ? { ...s, status: "completed" as SessionStatus, parentConfirmed: true } : s);
      const completedCount = updatedSessions.filter(s => s.status === "completed").length;
      let newEscrowReleased = c.escrowReleased;
      let newEscrowStatus = c.escrowStatus;
      if (completedCount > 0 && completedCount % c.releaseMilestone === 0) {
        const releaseAmount = (c.escrowAmount / c.totalSessions) * c.releaseMilestone;
        newEscrowReleased = Math.min(c.escrowAmount, c.escrowReleased + releaseAmount);
      }
      if (completedCount >= c.totalSessions) { newEscrowStatus = "completed"; newEscrowReleased = c.escrowAmount; }
      else if (completedCount > 0) { newEscrowStatus = "in_progress"; }
      return { ...c, sessions: updatedSessions, completedSessions: completedCount, escrowReleased: newEscrowReleased, escrowStatus: newEscrowStatus as EscrowStatus };
    }));
  }, []);

  const requestAbsence = useCallback((sessionId: string, classId: string, reason: string, requestedBy: "tutor" | "student") => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, sessions: c.sessions.map(s => s.id === sessionId ? { ...s, absenceReason: reason, absenceRequestedBy: requestedBy, absenceApproved: false } : s) };
    }));
  }, []);

  const sendMessage = useCallback((classId: string, message: string) => {
    setChatMessages(prev => [...prev, {
      id: genTeacherId("tm"), classId, sender: "tutor", senderName: profile.name,
      message, timestamp: new Date().toLocaleString("vi-VN"), read: true,
    }]);
  }, [profile.name]);

  const markMessagesRead = useCallback((classId: string) => {
    setChatMessages(prev => prev.map(m => m.classId === classId ? { ...m, read: true } : m));
  }, []);

  const requestRefund = useCallback((classId: string) => {
    setClasses(prev => prev.map(c =>
      c.id === classId && (c.escrowStatus === "pending" || c.escrowStatus === "in_progress")
        ? { ...c, escrowStatus: "refunded" as EscrowStatus } : c
    ));
    setWallet(prev => [...prev, {
      id: genTeacherId("tw"), type: "refund", amount: 0,
      date: new Date().toISOString().slice(0, 10),
      description: `Yêu cầu hoàn tiền lớp ${classId} - đang chờ Admin xử lý`,
      classId, status: "pending",
    }]);
  }, []);

  const requestWithdrawal = useCallback((amount: number, method: string) => {
    setWallet(prev => [...prev, {
      id: genTeacherId("tw"), type: "withdrawal", amount: -amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Rút ${amount.toLocaleString("vi-VN")}đ qua ${method}`,
      status: "completed", paymentMethod: method,
    }]);
  }, []);

  const requestDeposit = useCallback((amount: number, method: string) => {
    setWallet(prev => [...prev, {
      id: genTeacherId("tw"), type: "deposit", amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Nạp ${amount.toLocaleString("vi-VN")}đ từ ${method}`,
      status: "completed", paymentMethod: method,
    }]);
  }, []);

  const updateAvailability = useCallback((availability: TutorProfile["availability"]) => {
    setProfile(prev => ({ ...prev, availability }));
  }, []);

  const addTestResult = useCallback((result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  }, []);

  const addMaterial = useCallback((classId: string, material: ClassMaterial) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, materials: [...c.materials, material] } : c));
  }, []);

  const removeMaterial = useCallback((classId: string, materialId: string) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, materials: c.materials.filter(m => m.id !== materialId) } : c));
  }, []);

  return (
    <TeacherContext.Provider value={{
      profile, classes, trials, wallet, chatMessages, studentProgress, reviews,
      testQuestions: teacherTestQuestions, testResults, walletBalance, escrowBalance,
      updateProfile, confirmTrial, rejectTrial,
      startSession, endSession, confirmSessionByParent, requestAbsence,
      sendMessage, markMessagesRead,
      requestRefund, requestWithdrawal, requestDeposit, updateAvailability,
      addTestResult, addMaterial, removeMaterial,
    }}>
      {children}
    </TeacherContext.Provider>
  );
};
