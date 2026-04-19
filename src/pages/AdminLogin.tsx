import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/mockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { PenTool, ClipboardCheck, ShieldCheck } from "lucide-react";

const ROLES: { value: UserRole; emailKey: string; labelKey: "roleJournalist" | "roleEditor" | "roleAdmin"; icon: typeof PenTool }[] = [
  { value: "journalist", emailKey: "journalist@apex.dz", labelKey: "roleJournalist", icon: PenTool },
  { value: "editor", emailKey: "editor@apex.dz", labelKey: "roleEditor", icon: ClipboardCheck },
  { value: "admin", emailKey: "admin@apex.dz", labelKey: "roleAdmin", icon: ShieldCheck },
];

export default function AdminLogin() {
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@apex.dz");
  const [password, setPassword] = useState("admin");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const pickRole = (r: UserRole) => {
    setRole(r);
    setEmail(ROLES.find((x) => x.value === r)!.emailKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password, role);
    setSubmitting(false);
    if (error) {
      toast({ title: t("signInError"), description: error.message, variant: "destructive" });
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-lg">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">{t("adminPanel")}</h1>
        <p className="text-muted-foreground text-center text-sm mb-6">{t("adminDemoMode")}</p>

        <div className="mb-5">
          <Label className="text-xs text-muted-foreground mb-2 block">{t("role")}</Label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => pickRole(r.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-colors ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(r.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder={t("fEmail")} value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
          <Input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? t("signingIn") : t("signIn")}</Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          {t("adminHint")} <code className="bg-muted px-1.5 py-0.5 rounded" dir="ltr">admin</code>
        </p>
      </div>
    </div>
  );
}
