import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AdminProvider } from "@/contexts/AdminContext";
import { TutorProvider } from "@/contexts/TutorContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FindTutor from "./pages/FindTutor";
import RegisterTutor from "./pages/RegisterTutor";
import ExamOnline from "./pages/ExamOnline";
import DemoPage from "./pages/DemoPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminTests from "./pages/admin/AdminTests";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminReports from "./pages/admin/AdminReports";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminSettings from "./pages/admin/AdminSettings";
import TutorLayout from "./components/tutor/TutorLayout";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorClasses from "./pages/tutor/TutorClasses";
import TutorWallet from "./pages/tutor/TutorWallet";
import TutorSchedule from "./pages/tutor/TutorSchedule";
import TutorStudents from "./pages/tutor/TutorStudents";
import TutorReviews from "./pages/tutor/TutorReviews";
import TutorChat from "./pages/tutor/TutorChat";
import TutorProfile from "./pages/tutor/TutorProfile";
import TutorClassDetail from "./pages/tutor/TutorClassDetail";
import TutorPublicProfile from "./pages/TutorPublicProfile";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" storageKey="educonnect-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <TutorProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/find-tutor" element={<FindTutor />} />
                <Route path="/register-tutor" element={<RegisterTutor />} />
                <Route path="/exam-online" element={<ExamOnline />} />
                <Route path="/demo/:role" element={<DemoPage />} />
                <Route path="/tutor-profile" element={<TutorPublicProfile />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="approvals" element={<AdminApprovals />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="classes" element={<AdminClasses />} />
                  <Route path="tests" element={<AdminTests />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="audit" element={<AdminAudit />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="/tutor" element={<TutorLayout />}>
                  <Route index element={<TutorDashboard />} />
                  <Route path="classes" element={<TutorClasses />} />
                  <Route path="classes/:classId" element={<TutorClassDetail />} />
                  <Route path="wallet" element={<TutorWallet />} />
                  <Route path="schedule" element={<TutorSchedule />} />
                  <Route path="students" element={<TutorStudents />} />
                  <Route path="reviews" element={<TutorReviews />} />
                  <Route path="chat" element={<TutorChat />} />
                  <Route path="profile" element={<TutorProfile />} />
                </Route>
                <Route path="/pricing" element={<PlaceholderPage title="Bảng giá" description="Trang bảng giá đang được cập nhật." />} />
                <Route path="/help" element={<PlaceholderPage title="Trung tâm trợ giúp" description="Trung tâm trợ giúp đang được xây dựng." />} />
                <Route path="/faq" element={<PlaceholderPage title="Câu hỏi thường gặp" description="Trang FAQ đang được cập nhật." />} />
                <Route path="/contact" element={<PlaceholderPage title="Liên hệ" description="Trang liên hệ đang được xây dựng." />} />
                <Route path="/refund" element={<PlaceholderPage title="Chính sách hoàn tiền" description="Chính sách hoàn tiền đang được cập nhật." />} />
                <Route path="/terms" element={<PlaceholderPage title="Điều khoản sử dụng" description="Điều khoản sử dụng đang được cập nhật." />} />
                <Route path="/privacy" element={<PlaceholderPage title="Chính sách bảo mật" description="Chính sách bảo mật đang được cập nhật." />} />
                <Route path="/gdpr" element={<PlaceholderPage title="GDPR" description="Trang GDPR đang được cập nhật." />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TutorProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
