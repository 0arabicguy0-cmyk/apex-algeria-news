import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

import {
  UserCog,
  User,
  Lock,
  Shield,
  Loader2,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();

  const {
    username,
    updateUsername,
    updatePassword,
    loading,
  } = useAuth();

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  /* --------------------------------------------------
     Load current username
  -------------------------------------------------- */

  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
  }, [username]);

  /* --------------------------------------------------
     Update username
  -------------------------------------------------- */

  const handleUsername = async () => {
    const cleanedUsername = newUsername.trim();

    if (!cleanedUsername) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم.",
        variant: "destructive",
      });

      return;
    }

    setSavingUsername(true);

    const { error } = await updateUsername(cleanedUsername);

    setSavingUsername(false);

    if (error) {
      toast({
        title: "تعذر تحديث اسم المستخدم",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "تم تحديث اسم المستخدم",
      description:
        "سيتم استخدام اسم المستخدم الجديد عند تسجيل الدخول القادم.",
    });
  };

  /* --------------------------------------------------
     Update password
  -------------------------------------------------- */

  const handlePassword = async () => {
    if (!currentPassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كلمة المرور الحالية.",
        variant: "destructive",
      });

      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة",
        description:
          "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
        variant: "destructive",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "كلمتا المرور غير متطابقتين",
        description:
          "تأكد من أن كلمة المرور الجديدة وتأكيدها متطابقان.",
        variant: "destructive",
      });

      return;
    }

    if (newPassword === currentPassword) {
      toast({
        title: "كلمة المرور الجديدة مطابقة للحالية",
        description:
          "اختر كلمة مرور مختلفة عن كلمة المرور الحالية.",
        variant: "destructive",
      });

      return;
    }

    setSavingPassword(true);

    const { error } = await updatePassword(
      currentPassword,
      newPassword
    );

    setSavingPassword(false);

    if (error) {
      toast({
        title: "تعذر تحديث كلمة المرور",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast({
      title: "تم تحديث كلمة المرور",
      description:
        "تم تغيير كلمة مرور حساب المسؤول بنجاح.",
    });
  };

  const usernameChanged =
    newUsername.trim() !== "" &&
    newUsername.trim() !== username;

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div
      className="w-full max-w-5xl space-y-6 pb-10"
      dir="rtl"
    >
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCog className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              إعدادات الحساب
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              إدارة اسم المستخدم وكلمة المرور الخاصة بحساب المسؤول.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          ACCOUNT OVERVIEW
      ================================================== */}

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  الحساب الحالي
                </p>

                <p
                  className="mt-1 text-lg font-semibold text-foreground"
                  dir="ltr"
                >
                  {username ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5">
              <Shield className="h-4 w-4 text-primary" />

              <span className="text-sm font-medium">
                مسؤول النظام
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================================================
          USERNAME CARD
      ================================================== */}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>

            <div>
              <p>اسم المستخدم</p>

              <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                اسم المستخدم الذي تستخدمه للدخول إلى لوحة الإدارة.
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          {/* Current username */}

          <div className="space-y-2">
            <Label htmlFor="current-username">
              اسم المستخدم الحالي
            </Label>

            <Input
              id="current-username"
              value={username ?? ""}
              readOnly
              dir="ltr"
              className="h-11 bg-muted/50"
            />
          </div>

          {/* New username */}

          <div className="space-y-2">
            <Label htmlFor="new-username">
              اسم المستخدم الجديد
            </Label>

            <Input
              id="new-username"
              value={newUsername}
              onChange={(e) =>
                setNewUsername(e.target.value)
              }
              placeholder="أدخل اسم مستخدم جديد"
              dir="ltr"
              className="h-11"
              disabled={savingUsername || loading}
            />

            <p className="text-xs text-muted-foreground">
              يجب أن يتكون اسم المستخدم من 3 إلى 32 حرفًا،
              ويمكن استخدام الأحرف والأرقام و . _ -
            </p>
          </div>

          {/* Username button */}

          <div className="flex justify-start pt-1">
            <Button
              onClick={handleUsername}
              disabled={
                savingUsername ||
                loading ||
                !usernameChanged
              }
              className="min-w-[180px]"
            >
              {savingUsername ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle2 className="me-2 h-4 w-4" />
                  تحديث اسم المستخدم
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ==================================================
          PASSWORD CARD
      ================================================== */}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>

            <div>
              <p>تغيير كلمة المرور</p>

              <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                قم بتحديث كلمة المرور للحفاظ على أمان حساب المسؤول.
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          {/* Current password */}

          <div className="space-y-2">
            <Label htmlFor="current-password">
              كلمة المرور الحالية
            </Label>

            <div className="relative">
              <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="أدخل كلمة المرور الحالية"
                dir="ltr"
                className="h-11 ps-10"
                disabled={savingPassword}
              />
            </div>
          </div>

          {/* New password */}

          <div className="space-y-2">
            <Label htmlFor="new-password">
              كلمة المرور الجديدة
            </Label>

            <div className="relative">
              <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="أدخل كلمة المرور الجديدة"
                dir="ltr"
                className="h-11 ps-10"
                disabled={savingPassword}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.
            </p>
          </div>

          {/* Confirm password */}

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              تأكيد كلمة المرور
            </Label>

            <div className="relative">
              <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="أعد إدخال كلمة المرور الجديدة"
                dir="ltr"
                className="h-11 ps-10"
                disabled={savingPassword}
              />
            </div>
          </div>

          {/* Password button */}

          <div className="flex justify-start pt-1">
            <Button
              onClick={handlePassword}
              disabled={
                savingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="min-w-[180px]"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Lock className="me-2 h-4 w-4" />
                  تحديث كلمة المرور
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ==================================================
          ACCOUNT INFORMATION
      ================================================== */}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>

            معلومات الحساب
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="divide-y divide-border rounded-xl border border-border/60">
            {/* Username */}

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  اسم المستخدم
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  معرف تسجيل الدخول الخاص بك
                </p>
              </div>

              <span
                className="w-fit rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                dir="ltr"
              >
                {username ?? "—"}
              </span>
            </div>

            {/* Role */}

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  الصلاحية
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  مستوى الوصول إلى لوحة الإدارة
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Shield className="h-3.5 w-3.5" />
                مسؤول
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}