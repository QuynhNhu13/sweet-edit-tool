import { useParams, Link } from "react-router-dom";
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
  const roleName = roleNames[role || ""] || role;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="bg-card rounded-2xl p-10 shadow-elevated border border-border">
            <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-2xl">{roleName[0]}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-3">Demo: {roleName}</h1>
            <p className="text-muted-foreground mb-8">
              Trang demo cho vai trò <strong>{roleName}</strong> đang được phát triển. Vui lòng quay lại sau!
            </p>
            <Button asChild className="rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground">
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
