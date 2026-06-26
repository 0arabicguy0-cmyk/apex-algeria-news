import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (loading) return;
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      toast({
        title: t("signInError"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: isRTL ? "مرحباً بعودتك" : "Welcome back" });
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-lg">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          {t("adminPanel")}
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-6">
          {isRTL ? "وصول مسؤولي التحرير فقط" : "Editors access only"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs text-muted-foreground">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              {isRTL ? "← العودة إلى الصفحة الرئيسية" : "← Back to Home"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
