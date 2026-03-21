import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import SubjectsSection from "@/components/SubjectsSection";
import ExamSection from "@/components/ExamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background landing">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <SubjectsSection />
      {/* <ExamSection /> */}
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
      <ChatWidget />
    </div>
  );
};

export default Index;
