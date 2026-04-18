import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { CheckCircle } from "lucide-react";
import { feedbackApi } from "@/lib/mockStore";

export default function ContactPage() {
  const { isDark, toggle } = useTheme();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    feedbackApi.add(name, email, message);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="container max-w-lg py-10">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("contactTitle")}</h1>
        <p className="text-muted-foreground mb-8">{t("contactSub")}</p>

        {submitted ? (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-dz-green mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground">{t("contactSuccess")}</p>
            <p className="text-muted-foreground mt-2">{t("contactSuccessSub")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("fName")}</label>
              <input required type="text" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t("fNamePh")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("fEmail")}</label>
              <input required type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="example@email.com" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("fMessage")}</label>
              <textarea required rows={5} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder={t("fMessagePh")} />
              <span className="text-xs text-muted-foreground">{message.length}/500</span>
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity">{t("send")}</button>
          </form>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
