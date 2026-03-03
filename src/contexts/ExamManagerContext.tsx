import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale2 from "@/assets/avatar-male-2.jpg";

export type ExamStatus = "draft" | "open" | "closed" | "hidden";
export type Difficulty = "easy" | "medium" | "hard";
export type AIMode = "auto_generate" | "fixed_set";

export interface ExamVersion {
  version: number;
  editedAt: string;
  editedBy: string;
  changes: string;
}

export interface ProctoringLog {
  id: string;
  examId: string;
  userId: string;
  userName: string;
  type: "tab_switch" | "copy_paste" | "screen_split" | "suspicious_time";
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  duration: number;
  questionCount: number;
  fee: number;
  year: number;
  status: ExamStatus;
  visible: boolean;
  aiMode: AIMode;
  difficulty: Difficulty;
  aiProctoring: boolean;
  attempts: number;
  revenue: number;
  completionRate: number;
  aboveAverageRate: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  maxAttemptsPerUser: number;
  maxTotalAttempts: number;
  scorePerQuestion: number;
  penaltyForWrong: boolean;
  scoreScale: 10 | 100;
  versions: ExamVersion[];
}

export interface ExamQuestion {
  id: string;
  examId?: string;
  content: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: Difficulty;
  standard: string;
  subject: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  duration: number;
}

export interface ExamNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

const makeExam = (id: string, name: string, subject: string, duration: number, qCount: number, status: ExamStatus, visible: boolean, aiMode: AIMode, diff: Difficulty, proctoring: boolean, attempts: number, rev: number, compRate: number, aboveAvg: number, created: string): Exam => ({
  id, name, subject, duration, questionCount: qCount, fee: 10000, year: 2025, status, visible, aiMode, difficulty: diff, aiProctoring: proctoring,
  attempts, revenue: rev, completionRate: compRate, aboveAverageRate: aboveAvg, createdAt: created,
  startDate: "01/01/2026", endDate: "30/06/2026", maxAttemptsPerUser: 3, maxTotalAttempts: 5000,
  scorePerQuestion: +(10 / qCount).toFixed(2), penaltyForWrong: false, scoreScale: 10,
  versions: [{ version: 1, editedAt: created, editedBy: "Võ Thanh Hùng", changes: "Tạo đề thi mới" }],
});

const seedExams: Exam[] = [
  makeExam("ex1", "Đề thi thử Toán THPT QG 2025", "Toán", 90, 50, "open", true, "auto_generate", "medium", true, 1234, 12340000, 87, 62, "01/01/2026"),
  makeExam("ex2", "Đề thi thử Vật lý THPT QG 2025", "Vật lý", 50, 40, "open", true, "auto_generate", "medium", true, 876, 8760000, 82, 55, "05/01/2026"),
  makeExam("ex3", "Đề thi thử Hóa học THPT QG 2025", "Hóa học", 50, 40, "open", true, "fixed_set", "hard", true, 654, 6540000, 78, 48, "10/01/2026"),
  makeExam("ex4", "Đề thi thử Sinh học THPT QG 2025", "Sinh học", 50, 40, "open", true, "auto_generate", "easy", false, 543, 5430000, 91, 72, "15/01/2026"),
  makeExam("ex5", "Đề thi thử Tiếng Anh THPT QG 2025", "Tiếng Anh", 60, 50, "open", true, "auto_generate", "medium", true, 1567, 15670000, 85, 58, "20/01/2026"),
  makeExam("ex6", "Đề thi thử Ngữ văn THPT QG 2025", "Ngữ văn", 120, 2, "open", true, "fixed_set", "medium", false, 432, 4320000, 75, 45, "25/01/2026"),
  makeExam("ex7", "Đề thi thử Lịch sử THPT QG 2025", "Lịch sử", 50, 40, "draft", false, "auto_generate", "medium", false, 0, 0, 0, 0, "01/02/2026"),
  makeExam("ex8", "Đề thi thử Địa lý THPT QG 2025", "Địa lý", 50, 40, "closed", false, "fixed_set", "easy", false, 298, 2980000, 88, 65, "05/02/2026"),
  { ...makeExam("ex9", "Đề ôn tập Toán 11 HK2", "Toán", 60, 30, "hidden", false, "auto_generate", "easy", false, 120, 1200000, 92, 78, "10/02/2026"), year: 2025 },
];

const seedQuestions: ExamQuestion[] = [
  { id: "q1", examId: "ex1", content: "Tìm giá trị lớn nhất của hàm số y = x³ - 3x + 2 trên đoạn [-2, 2]", options: ["4", "6", "8", "2"], correctAnswer: 0, topic: "Hàm số", difficulty: "medium", standard: "Chuẩn BGDDT 2025", subject: "Toán" },
  { id: "q2", examId: "ex1", content: "Tính tích phân ∫₀¹ x²dx", options: ["1/3", "1/2", "1", "2/3"], correctAnswer: 0, topic: "Tích phân", difficulty: "easy", standard: "Chuẩn BGDDT 2025", subject: "Toán" },
  { id: "q3", examId: "ex1", content: "Phương trình 2ˣ = 8 có nghiệm x bằng", options: ["2", "3", "4", "8"], correctAnswer: 1, topic: "Mũ & Logarit", difficulty: "easy", standard: "Chuẩn BGDDT 2025", subject: "Toán" },
  { id: "q4", examId: "ex2", content: "Đơn vị của gia tốc trong hệ SI là", options: ["m/s", "m/s²", "kg·m/s", "N"], correctAnswer: 1, topic: "Động học", difficulty: "easy", standard: "Chuẩn BGDDT 2025", subject: "Vật lý" },
  { id: "q5", examId: "ex2", content: "Một vật rơi tự do từ độ cao 20m. Tính thời gian rơi (g=10m/s²)", options: ["1s", "2s", "3s", "4s"], correctAnswer: 1, topic: "Rơi tự do", difficulty: "medium", standard: "Chuẩn BGDDT 2025", subject: "Vật lý" },
  { id: "q6", examId: "ex3", content: "Công thức hóa học của muối ăn là", options: ["NaCl", "KCl", "CaCl₂", "MgCl₂"], correctAnswer: 0, topic: "Hóa vô cơ", difficulty: "easy", standard: "Chuẩn BGDDT 2025", subject: "Hóa học" },
  { id: "q7", subject: "Toán", content: "Cho hàm số y = x⁴ - 2x² + 1. Số điểm cực trị là", options: ["1", "2", "3", "0"], correctAnswer: 2, topic: "Hàm số", difficulty: "hard", standard: "Chuẩn BGDDT 2025" },
  { id: "q8", subject: "Vật lý", content: "Định luật III Newton phát biểu về", options: ["Quán tính", "Gia tốc", "Phản lực", "Trọng lực"], correctAnswer: 2, topic: "Động lực học", difficulty: "medium", standard: "Chuẩn BGDDT 2025" },
];

const seedAttempts: ExamAttempt[] = [
  { id: "at1", examId: "ex1", studentName: "Lê Minh Châu", score: 8.5, totalQuestions: 50, completedAt: "03/03/2026 10:30", duration: 85 },
  { id: "at2", examId: "ex1", studentName: "Ngô Thị Lan", score: 7.0, totalQuestions: 50, completedAt: "03/03/2026 09:15", duration: 88 },
  { id: "at3", examId: "ex5", studentName: "Trương Văn Kiên", score: 9.0, totalQuestions: 50, completedAt: "02/03/2026 14:00", duration: 55 },
  { id: "at4", examId: "ex2", studentName: "Lê Minh Châu", score: 6.5, totalQuestions: 40, completedAt: "02/03/2026 11:00", duration: 48 },
  { id: "at5", examId: "ex3", studentName: "Phạm Văn Đức", score: 5.0, totalQuestions: 40, completedAt: "01/03/2026 16:30", duration: 50 },
];

const seedNotifications: ExamNotification[] = [
  { id: "en1", title: "Đề thi mới cần duyệt", message: "Đề Lịch sử THPT QG 2025 đang ở trạng thái nháp", type: "warning", read: false, timestamp: "03/03/2026 09:00" },
  { id: "en2", title: "Lượt thi đạt mốc", message: "Đề Tiếng Anh đã vượt 1.500 lượt thi", type: "success", read: false, timestamp: "02/03/2026 18:00" },
  { id: "en3", title: "Báo cáo gian lận", message: "AI Proctoring phát hiện 3 trường hợp nghi vấn", type: "error", read: false, timestamp: "02/03/2026 15:30" },
  { id: "en4", title: "Cập nhật ngân hàng câu hỏi", message: "Đã thêm 25 câu hỏi mới vào môn Toán", type: "info", read: true, timestamp: "01/03/2026 10:00" },
];

const seedProctoringLogs: ProctoringLog[] = [
  { id: "pl1", examId: "ex1", userId: "u1", userName: "Nguyễn Văn Hải", type: "tab_switch", description: "Chuyển tab 3 lần trong 5 phút", timestamp: "03/03/2026 10:15", severity: "high" },
  { id: "pl2", examId: "ex5", userId: "u2", userName: "Trần Thị Mai", type: "copy_paste", description: "Cố gắng paste nội dung từ clipboard", timestamp: "02/03/2026 14:22", severity: "medium" },
  { id: "pl3", examId: "ex1", userId: "u3", userName: "Lê Hoàng Nam", type: "screen_split", description: "Phát hiện chia đôi màn hình", timestamp: "02/03/2026 10:45", severity: "high" },
  { id: "pl4", examId: "ex2", userId: "u4", userName: "Phạm Quốc Bảo", type: "suspicious_time", description: "Trả lời 10 câu trong 30 giây", timestamp: "01/03/2026 16:10", severity: "medium" },
  { id: "pl5", examId: "ex3", userId: "u5", userName: "Đỗ Minh Tâm", type: "tab_switch", description: "Rời khỏi tab thi 2 lần", timestamp: "01/03/2026 14:55", severity: "low" },
  { id: "pl6", examId: "ex5", userId: "u6", userName: "Vũ Thị Hồng", type: "copy_paste", description: "Cố gắng copy nội dung câu hỏi", timestamp: "28/02/2026 09:30", severity: "medium" },
];

interface ExamManagerContextType {
  exams: Exam[];
  questions: ExamQuestion[];
  attempts: ExamAttempt[];
  notifications: ExamNotification[];
  proctoringLogs: ProctoringLog[];
  addExam: (exam: Exam) => void;
  updateExam: (id: string, data: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  toggleExamVisibility: (id: string) => void;
  addQuestion: (q: ExamQuestion) => void;
  deleteQuestion: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  profile: { name: string; role: string; avatar: string };
}

const ExamManagerContext = createContext<ExamManagerContextType | null>(null);

export const useExamManager = () => {
  const ctx = useContext(ExamManagerContext);
  if (!ctx) throw new Error("useExamManager must be inside ExamManagerProvider");
  return ctx;
};

export const ExamManagerProvider = ({ children }: { children: ReactNode }) => {
  const [exams, setExams] = useState(seedExams);
  const [questions, setQuestions] = useState(seedQuestions);
  const [attempts] = useState(seedAttempts);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [proctoringLogs] = useState(seedProctoringLogs);

  const addExam = useCallback((exam: Exam) => setExams(prev => [exam, ...prev]), []);
  const updateExam = useCallback((id: string, data: Partial<Exam>) => setExams(prev => prev.map(e => {
    if (e.id !== id) return e;
    const updated = { ...e, ...data };
    updated.versions = [...e.versions, { version: e.versions.length + 1, editedAt: new Date().toLocaleDateString("vi-VN"), editedBy: "Võ Thanh Hùng", changes: Object.keys(data).join(", ") }];
    return updated;
  })), []);
  const deleteExam = useCallback((id: string) => setExams(prev => prev.filter(e => e.id !== id)), []);
  const toggleExamVisibility = useCallback((id: string) => setExams(prev => prev.map(e => e.id === id ? { ...e, visible: !e.visible } : e)), []);
  const addQuestion = useCallback((q: ExamQuestion) => setQuestions(prev => [q, ...prev]), []);
  const deleteQuestion = useCallback((id: string) => setQuestions(prev => prev.filter(q => q.id !== id)), []);
  const markNotificationRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotificationsRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);

  const profile = { name: "Võ Thanh Hùng", role: "Quản lý đề thi", avatar: avatarMale2 };

  return (
    <ExamManagerContext.Provider value={{ exams, questions, attempts, notifications, proctoringLogs, addExam, updateExam, deleteExam, toggleExamVisibility, addQuestion, deleteQuestion, markNotificationRead, markAllNotificationsRead, profile }}>
      {children}
    </ExamManagerContext.Provider>
  );
};
