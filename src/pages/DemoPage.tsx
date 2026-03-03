import { useParams, Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

const roleNames: Record<string, string> = {
  admin: "Admin",
  tutor: "Gia sư",
  teacher: "Giáo viên",
  student: "Học sinh",
  parent: "Phụ huynh",
  accountant: "Kế toán",
  office: "Văn phòng",
  "exam-manager": "Quản lý đề",
};

const DemoPage = () => {
  const { role } = useParams<{ role: string }>();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "tutor") return <Navigate to="/tutor" replace />;
  if (role === "teacher") return <Navigate to="/teacher" replace />;
  if (role === "student") return <Navigate to="/student" replace />;
  if (role === "parent") return <Navigate to="/parent" replace />;
  if (role === "office") return <Navigate to="/office" replace />;
  if (role === "accountant") return <Navigate to="/finance" replace />;
  if (role === "exam-manager") return <Navigate to="/exam-manager" replace />;

  const roleName = roleNames[role || ""] || role;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="bg-card rounded-3xl p-10 shadow-elevated border border-border">
            <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-neon">
              <span className="text-neon font-bold text-2xl font-display">{roleName?.[0]}</span>
            </div>
            <h1 className="text-2xl font-extrabold font-display text-foreground mb-3">Demo: {roleName}</h1>
            <p className="text-muted-foreground mb-8">
              Trang demo cho vai trò <strong>{roleName}</strong> đang được phát triển.
            </p>
            <Button asChild className="rounded-2xl bg-neon text-neon-foreground hover:bg-neon/90 font-bold shadow-neon">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default DemoPage;
