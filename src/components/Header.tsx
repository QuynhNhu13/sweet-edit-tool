import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import EduLogo from "@/components/EduLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const demoRoles = [
  { name: "Admin", path: "/demo/admin" },
  { name: "Gia sư", path: "/demo/tutor" },
  { name: "Giáo viên", path: "/demo/teacher" },
  { name: "Học sinh", path: "/demo/student" },
  { name: "Phụ huynh", path: "/demo/parent" },
  { name: "Kế toán", path: "/demo/accountant" },
  { name: "Văn phòng", path: "/demo/office" },
  { name: "Quản lý đề", path: "/demo/exam-manager" },
];

const sectionLinks = [
  { id: "features", label: "Tính năng" },
  { id: "how-it-works", label: "Cách hoạt động" },
  { id: "subjects", label: "Môn học" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft" : "bg-background/50 backdrop-blur-md"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <EduLogo size={36} />
          <span className="font-bold text-xl text-foreground">
            Edu<span className="text-gradient">Connect</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/find-tutor"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all"
          >
            Tìm gia sư
          </Link>
          <Link
            to="/exam-online"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all"
          >
            Thi thử
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all">
                Demo <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {demoRoles.map((role) => (
                <DropdownMenuItem key={role.path} asChild>
                  <Link to={role.path}>{role.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Button variant="ghost" asChild className="rounded-full text-sm px-6">
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button asChild className="rounded-full bg-neon text-neon-foreground hover:bg-neon/90 font-semibold text-sm shadow-neon px-6">
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left py-2.5 px-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted/50"
            >
              {link.label}
            </button>
          ))}
          <Link to="/find-tutor" className="block py-2.5 px-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted/50" onClick={() => setMobileOpen(false)}>Tìm gia sư</Link>
          <Link to="/exam-online" className="block py-2.5 px-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted/50" onClick={() => setMobileOpen(false)}>Thi thử Online</Link>
          <details className="group">
            <summary className="py-2.5 px-3 text-sm font-medium text-muted-foreground cursor-pointer list-none flex items-center gap-1 rounded-lg hover:bg-muted/50">
              Demo <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pl-6 space-y-1">
              {demoRoles.map((role) => (
                <Link key={role.path} to={role.path} className="block py-2 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  {role.name}
                </Link>
              ))}
            </div>
          </details>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" asChild className="flex-1 rounded-xl">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
            </Button>
            <Button asChild className="flex-1 rounded-xl bg-neon text-neon-foreground hover:bg-neon/90">
              <Link to="/register" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
