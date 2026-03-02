import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FindTutor from "./pages/FindTutor";
import RegisterTutor from "./pages/RegisterTutor";
import ExamOnline from "./pages/ExamOnline";
import DemoPage from "./pages/DemoPage";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
