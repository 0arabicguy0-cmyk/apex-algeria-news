import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { isDark, toggle } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("feedback_messages").insert({ name, email, message });
    setSubmitting(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="container max-w-lg py-10">
        <h1 className="text-2xl font-bold text-foreground mb-2">تواصل معنا</h1>
        <p className="text-muted-foreground mb-8">نسعد بتلقي ملاحظاتكم واقتراحاتكم</p>

        {submitted ? (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-dz-green mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground">شكراً، تم إرسال رسالتك</p>
            <p className="text-muted-foreground mt-2">سنعود إليك في أقرب وقت</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
              <input
                required
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="اسمك الكامل"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
              <input
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
              <textarea
                required
                rows={5}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="اكتب رسالتك هنا..."
              />
              <span className="text-xs text-muted-foreground">{message.length}/٥٠٠</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "جارٍ الإرسال..." : "إرسال"}
            </button>
          </form>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
