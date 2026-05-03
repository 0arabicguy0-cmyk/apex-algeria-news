import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminLogin() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  // Guard: if already authenticated, route by role.
  useEffect(() => {
    if (loading) return;
    if (user && isAdmin) {
      navigate("/admin", { replace: true });
    } else if (user && !isAdmin) {
      // Signed-in non-admin should not see the admin login. Sign them out and send home.
      signOut().finally(() => navigate("/", { replace: true }));
    }
  }, [user, isAdmin, loading, navigate, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);
    setSubmitting(false);

    if (error) {
      toast({
        title: t("signInError"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: mode === "signup"
        ? (isRTL ? "تم إنشاء الحساب" : "Account created")
        : (isRTL ? "مرحباً بعودتك" : "Welcome back"),
    });
    navigate("/admin");
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

        <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")} className="mb-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">{isRTL ? "دخول" : "Sign in"}</TabsTrigger>
            <TabsTrigger value="signup">{isRTL ? "إنشاء حساب" : "Sign up"}</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" />
          <TabsContent value="signup" />
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs text-muted-foreground">{t("fEmail")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs text-muted-foreground">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              dir="ltr"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? t("signingIn")
              : mode === "signin"
                ? t("signIn")
                : (isRTL ? "إنشاء حساب" : "Create account")}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {isRTL
            ? "أول حساب يُسجَّل يصبح مسؤولاً تلقائياً."
            : "The first account you create becomes the admin."}
        </p>
      </div>
    </div>
  );
}
