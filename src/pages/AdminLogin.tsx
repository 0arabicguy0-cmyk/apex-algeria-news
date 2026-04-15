import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "خطأ في التسجيل", description: error.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      toast({ title: "تم التسجيل", description: "تحقق من بريدك الإلكتروني لتأكيد الحساب" });
      setIsSignUp(false);
      setSubmitting(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "خطأ في الدخول", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-lg">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">لوحة التحكم</h1>
        <p className="text-muted-foreground text-center text-sm mb-6">Apex News DZ</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (isSignUp ? "جارٍ التسجيل..." : "جارٍ الدخول...") : (isSignUp ? "تسجيل" : "دخول")}
          </Button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
        >
          {isSignUp ? "لديك حساب؟ سجل الدخول" : "ليس لديك حساب؟ سجل الآن"}
        </button>
      </div>
    </div>
  );
}