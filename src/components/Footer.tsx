import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-navy text-navy-foreground mt-12">
      <div className="container py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg leading-none">A</span>
              </div>
              <span className="font-bold text-lg">Apex News DZ</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              مصدرك الأول للأخبار الجزائرية والعربية والدولية. تغطية شاملة وموضوعية على مدار الساعة.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">أقسام الموقع</h4>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
              <Link to="/" className="hover:opacity-100 transition-opacity">الرئيسية</Link>
              <Link to="/?cat=algeria" className="hover:opacity-100 transition-opacity">الجزائر</Link>
              <Link to="/?cat=world" className="hover:opacity-100 transition-opacity">العالم</Link>
              <Link to="/?cat=economy" className="hover:opacity-100 transition-opacity">اقتصاد</Link>
              <Link to="/?cat=sports" className="hover:opacity-100 transition-opacity">رياضة</Link>
              <Link to="/?cat=tech" className="hover:opacity-100 transition-opacity">تكنولوجيا</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">تابعونا</h4>
            <div className="flex gap-4 text-sm opacity-70">
              <a href="#" className="hover:opacity-100 transition-opacity">فيسبوك</a>
              <a href="#" className="hover:opacity-100 transition-opacity">تويتر</a>
              <a href="#" className="hover:opacity-100 transition-opacity">يوتيوب</a>
              <a href="#" className="hover:opacity-100 transition-opacity">إنستغرام</a>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-foreground/20 mt-8 pt-6 text-center text-sm opacity-50">
          © ٢٠٢٦ Apex News DZ — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
