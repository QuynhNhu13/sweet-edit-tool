import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, MapPin, Eye } from "lucide-react";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import tutor6 from "@/assets/tutor-6.jpg";

const tutors = [
  { name: "Nguyễn Minh Tuấn", subject: "Toán học", rating: 4.9, reviews: 127, location: "Hà Nội", price: "200.000đ/buổi", exp: "8 năm", avatar: tutor1 },
  { name: "Trần Thị Hương", subject: "Tiếng Anh", rating: 4.8, reviews: 98, location: "TP.HCM", price: "250.000đ/buổi", exp: "6 năm", avatar: tutor2 },
  { name: "Phạm Văn Đức", subject: "Vật lý", rating: 4.9, reviews: 85, location: "Đà Nẵng", price: "180.000đ/buổi", exp: "10 năm", avatar: tutor3 },
  { name: "Lê Thị Mai", subject: "Hóa học", rating: 4.7, reviews: 72, location: "Hà Nội", price: "220.000đ/buổi", exp: "5 năm", avatar: tutor4 },
  { name: "Hoàng Đức Anh", subject: "Ngữ văn", rating: 4.8, reviews: 64, location: "TP.HCM", price: "190.000đ/buổi", exp: "7 năm", avatar: tutor5 },
  { name: "Vũ Thanh Hà", subject: "Sinh học", rating: 4.6, reviews: 53, location: "Hải Phòng", price: "170.000đ/buổi", exp: "4 năm", avatar: tutor6 },
];

const FindTutor = () => {
  const [search, setSearch] = useState("");
  const filtered = tutors.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-section-lg md:text-hero font-extrabold text-foreground mb-3">
              Tìm gia sư <span className="text-gradient">phù hợp</span>
            </h1>
            <p className="text-muted-foreground text-body-lg">Hơn 1,200 gia sư đã được xác thực và sẵn sàng giảng dạy</p>
          </div>

          <div className="max-w-xl mx-auto mb-12 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc môn học..."
              className="pl-12 h-13 rounded-full shadow-soft text-body"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div key={t.name} className="bg-card rounded-3xl p-6 shadow-soft border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                  />
                  <div>
                    <h3 className="font-bold text-foreground">{t.name}</h3>
                    <p className="text-sm text-neon font-semibold">{t.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-neon text-neon" /> {t.rating} ({t.reviews})</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {t.location}</span>
                </div>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-sm text-muted-foreground">KN: {t.exp}</span>
                  <span className="font-bold text-foreground">{t.price}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full font-semibold h-12" asChild>
                    <Link to="/register" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Xem chi tiết
                    </Link>
                  </Button>
                  <Button className="flex-1 rounded-full gradient-blue text-primary-foreground font-semibold h-12" asChild>
                    <Link to="/register">Đặt lịch học</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default FindTutor;
