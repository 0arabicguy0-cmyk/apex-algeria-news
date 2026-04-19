import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

export default function Paywall() {
  const { isRTL } = useLanguage();
  const { subscribe } = useSubscription();
  const { toast } = useToast();

  const handle = () => {
    subscribe();
    toast({
      title: isRTL ? "تم تفعيل اشتراكك" : "Subscription activated",
      description: isRTL ? "استمتع بمحتوى Apex News بريميوم" : "Enjoy Apex News Premium content",
    });
  };

  const benefits = isRTL
    ? ["وصول كامل للمقالات الحصرية", "تجربة قراءة بدون إعلانات", "تحليلات معمّقة من أبرز محرّرينا", "دعم الصحافة المستقلة في الجزائر"]
    : ["Full access to exclusive articles", "Ad-free reading experience", "In-depth analysis from top editors", "Support independent journalism in Algeria"];

  return (
    <div className="relative -mt-24 pt-24 pb-2 pointer-events-none">
      {/* Fade overlay sits above the truncated body */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <div className="pointer-events-auto rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-card to-card p-6 md:p-8 shadow-elegant">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 mx-auto mb-4">
          <Crown className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground text-center">
          {isRTL ? "تابع القراءة مع Apex News بريميوم" : "Continue reading with Apex News Premium"}
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-md mx-auto">
          {isRTL
            ? "هذا المقال محتوى حصري للمشتركين. اشترك لقراءته كاملاً."
            : "This article is exclusive to subscribers. Subscribe to read the full story."}
        </p>

        <ul className="mt-6 space-y-2 max-w-sm mx-auto">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="w-4 h-4 text-dz-green mt-0.5 flex-shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Button onClick={handle} size="lg" className="bg-amber-500 hover:bg-amber-600 text-white gap-2 w-full max-w-xs">
            <Crown className="w-4 h-4" />
            {isRTL ? "اشترك الآن — ٤٩٩ دج/شهر" : "Subscribe now — 499 DZD/month"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            {isRTL ? "تجربة مجانية ٧ أيام · إلغاء في أي وقت" : "7-day free trial · cancel anytime"}
          </p>
        </div>
      </div>
    </div>
  );
}
