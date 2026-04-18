import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setSubmitting(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    setEmail("");
    toast({ title: "تم الاشتراك", description: "ستصلك أبرز الأخبار يومياً" });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-navy via-navy to-primary text-primary-foreground p-6 md:p-8 my-8">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-3">
          <Mail className="w-3.5 h-3.5" />
          نشرة Apex News اليومية
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 leading-snug">
          أبرز ما يحدث في الجزائر والعالم — في صندوق بريدك كل صباح
        </h3>
        <p className="text-primary-foreground/80 text-sm mb-4">انضم إلى آلاف القراء. اشتراك مجاني، إلغاء في أي وقت.</p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            required
            dir="ltr"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-white/40 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-white/90 transition-colors text-sm disabled:opacity-60"
          >
            {submitting ? "..." : "اشترك"}
          </button>
        </form>
      </div>
      <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -left-20 -top-20 w-56 h-56 rounded-full bg-white/5" />
    </div>
  );
}
