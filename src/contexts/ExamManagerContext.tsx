import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale2 from "@/assets/avatar-male-2.jpg";

export type ExamStatus = "draft" | "open" | "closed";
export type Difficulty = "easy" | "medium" | "hard";
export type AIMode = "auto_generate" | "fixed_set";

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

const seedExams: Exam[] = [
  { id: "ex1", name: "Đề thi thử Toán THPT QG 2025", subject: "Toán", duration: 90, questionCount: 50, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "auto_generate", difficulty: "medium", aiProctoring: true, attempts: 1234, revenue: 12340000, completionRate: 87, aboveAverageRate: 62, createdAt: "01/01/2026" },
  { id: "ex2", name: "Đề thi thử Vật lý THPT QG 2025", subject: "Vật lý", duration: 50, questionCount: 40, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "auto_generate", difficulty: "medium", aiProctoring: true, attempts: 876, revenue: 8760000, completionRate: 82, aboveAverageRate: 55, createdAt: "05/01/2026" },
  { id: "ex3", name: "Đề thi thử Hóa học THPT QG 2025", subject: "Hóa học", duration: 50, questionCount: 40, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "fixed_set", difficulty: "hard", aiProctoring: true, attempts: 654, revenue: 6540000, completionRate: 78, aboveAverageRate: 48, createdAt: "10/01/2026" },
  { id: "ex4", name: "Đề thi thử Sinh học THPT QG 2025", subject: "Sinh học", duration: 50, questionCount: 40, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "auto_generate", difficulty: "easy", aiProctoring: false, attempts: 543, revenue: 5430000, completionRate: 91, aboveAverageRate: 72, createdAt: "15/01/2026" },
  { id: "ex5", name: "Đề thi thử Tiếng Anh THPT QG 2025", subject: "Tiếng Anh", duration: 60, questionCount: 50, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "auto_generate", difficulty: "medium", aiProctoring: true, attempts: 1567, revenue: 15670000, completionRate: 85, aboveAverageRate: 58, createdAt: "20/01/2026" },
  { id: "ex6", name: "Đề thi thử Ngữ văn THPT QG 2025", subject: "Ngữ văn", duration: 120, questionCount: 2, fee: 10000, year: 2025, status: "open", visible: true, aiMode: "fixed_set", difficulty: "medium", aiProctoring: false, attempts: 432, revenue: 4320000, completionRate: 75, aboveAverageRate: 45, createdAt: "25/01/2026" },
  { id: "ex7", name: "Đề thi thử Lịch sử THPT QG 2025", subject: "Lịch sử", duration: 50, questionCount: 40, fee: 10000, year: 2025, status: "draft", visible: false, aiMode: "auto_generate", difficulty: "medium", aiProctoring: false, attempts: 0, revenue: 0, completionRate: 0, aboveAverageRate: 0, createdAt: "01/02/2026" },
  { id: "ex8", name: "Đề thi thử Địa lý THPT QG 2025", subject: "Địa lý", duration: 50, questionCount: 40, fee: 10000, year: 2025, status: "closed", visible: false, aiMode: "fixed_set", difficulty: "easy", aiProctoring: false, attempts: 298, revenue: 2980000, completionRate: 88, aboveAverageRate: 65, createdAt: "05/02/2026" },
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
  { id: "en3", title: "Báo cáo gian lận", message: "AI Proctoring phát hiện 2 trường hợp nghi vấn", type: "error", read: false, timestamp: "02/03/2026 15:30" },
  { id: "en4", title: "Cập nhật ngân hàng câu hỏi", message: "Đã thêm 25 câu hỏi mới vào môn Toán", type: "info", read: true, timestamp: "01/03/2026 10:00" },
];

interface ExamManagerContextType {
  exams: Exam[];
  questions: ExamQuestion[];
  attempts: ExamAttempt[];
  notifications: ExamNotification[];
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

  const addExam = useCallback((exam: Exam) => setExams(prev => [exam, ...prev]), []);
  const updateExam = useCallback((id: string, data: Partial<Exam>) => setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e)), []);
  const deleteExam = useCallback((id: string) => setExams(prev => prev.filter(e => e.id !== id)), []);
  const toggleExamVisibility = useCallback((id: string) => setExams(prev => prev.map(e => e.id === id ? { ...e, visible: !e.visible } : e)), []);
  const addQuestion = useCallback((q: ExamQuestion) => setQuestions(prev => [q, ...prev]), []);
  const deleteQuestion = useCallback((id: string) => setQuestions(prev => prev.filter(q => q.id !== id)), []);
  const markNotificationRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotificationsRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);

  const profile = { name: "Võ Thanh Hùng", role: "Quản lý đề thi", avatar: avatarMale2 };

  return (
    <ExamManagerContext.Provider value={{ exams, questions, attempts, notifications, addExam, updateExam, deleteExam, toggleExamVisibility, addQuestion, deleteQuestion, markNotificationRead, markAllNotificationsRead, profile }}>
      {children}
    </ExamManagerContext.Provider>
  );
};
