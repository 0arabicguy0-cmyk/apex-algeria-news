import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@apex.dz");
  const [password, setPassword] = useState("admin");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: "خطأ في الدخول", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-lg">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">لوحة التحكم</h1>
        <p className="text-muted-foreground text-center text-sm mb-6">Apex News DZ — وضع تجريبي</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
          <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "جارٍ الدخول..." : "دخول"}</Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          أي بريد + كلمة المرور: <code className="bg-muted px-1.5 py-0.5 rounded" dir="ltr">admin</code>
        </p>
      </div>
    </div>
  );
}
