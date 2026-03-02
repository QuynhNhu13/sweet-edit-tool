import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="bg-card rounded-2xl p-10 shadow-elevated border border-border">
            <h1 className="text-2xl font-extrabold text-foreground mb-3">{title}</h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default PlaceholderPage;
