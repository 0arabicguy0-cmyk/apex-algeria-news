import { useState } from "react";
import { subscribersApi } from "@/lib/mockStore";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    subscribersApi.add(email.trim().toLowerCase());
    setEmail("");
    toast({ title: t("nlToastTitle"), description: t("nlToastDesc") });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-navy via-navy to-primary text-primary-foreground p-6 md:p-8 my-8">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-3">
          <Mail className="w-3.5 h-3.5" />
          {t("nlBadge")}
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 leading-snug">
          {t("nlTitle")}
        </h3>
        <p className="text-primary-foreground/80 text-sm mb-4">{t("nlSub")}</p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("nlPlaceholder")}
            required
            dir="ltr"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-white/40 text-sm"
          />
          <button type="submit" className="px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-white/90 transition-colors text-sm">
            {t("nlSubscribe")}
          </button>
        </form>
      </div>
      <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -left-20 -top-20 w-56 h-56 rounded-full bg-white/5" />
    </div>
  );
}
